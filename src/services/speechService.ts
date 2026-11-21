import { LanguageCode } from '../types';
import { synthesizeSpeechWithGemini, transcribeAudioWithGemini } from './geminiService';

/**
 * Speech Recognition, Gemini Audio Chunk Transcription fallback,
 * and Sequential Low-Latency Translated Dubbing Output across all 9 languages.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recognition: any = null;
let shouldKeepListening = false;
let activeRecognitionSessionId = 0;
let interimFlushTimer: ReturnType<typeof setTimeout> | null = null;
let pendingInterimText = '';

// Chunked transcription fallback state
let chunkRecorder: MediaRecorder | null = null;
let chunkInterval: ReturnType<typeof setInterval> | null = null;
let chunkActive = false;

// Shared audio unlock state for mobile Safari / Chrome WebView
let sharedAudioContext: AudioContext | null = null;
let audioUnlocked = false;

// Sequential FIFO TTS playback queue so translated sentences never cut each other off
interface DubQueueItem {
  text: string;
  lang: LanguageCode;
  resolve: () => void;
}
const dubQueue: DubQueueItem[] = [];
let isPlayingDubQueue = false;
let currentDubAudio: HTMLAudioElement | null = null;

const BCP47_MAP: Record<LanguageCode, string> = {
  am: 'am-ET',
  en: 'en-US',
  om: 'om-ET',
  ti: 'ti-ET',
  ar: 'ar-SA',
  fr: 'fr-FR',
  es: 'es-ES',
  zh: 'zh-CN',
  de: 'de-DE'
};

function dispatchDubbingState(active: boolean) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('oneworld:dubbing-state', { detail: { active } }));
  } catch {
    // ignore
  }
}

export function unlockAudioPlayback(): void {
  if (typeof window === 'undefined') return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      if (!sharedAudioContext) {
        sharedAudioContext = new AudioCtx();
      }
      if (sharedAudioContext.state === 'suspended') {
        sharedAudioContext.resume().catch(() => {});
      }
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
    audioUnlocked = true;
  } catch {
    // ignore
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

/**
 * Starts continuous Speech Recognition that emits ONLY finalized sentences
 * (or flushes pending interim speech after ~1.1s pause) and automatically restarts
 * if the browser ends recognition mid-session.
 */
export function startSpeechRecognition(
  lang: LanguageCode,
  onFinalResult: (text: string) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
): boolean {
  if (!isSpeechRecognitionSupported()) {
    if (onError) onError('SpeechRecognitionNotSupported');
    return false;
  }

  stopSpeechRecognition();
  shouldKeepListening = true;
  const sessionId = ++activeRecognitionSessionId;
  let lastEmitted = '';

  const flushSafe = (rawText: string) => {
    const clean = rawText.trim();
    if (!clean || clean === lastEmitted) return;
    lastEmitted = clean;
    pendingInterimText = '';
    if (interimFlushTimer) {
      clearTimeout(interimFlushTimer);
      interimFlushTimer = null;
    }
    onFinalResult(clean);
    setTimeout(() => {
      if (lastEmitted === clean) lastEmitted = '';
    }, 2500);
  };

  const launchInstance = () => {
    if (!shouldKeepListening || sessionId !== activeRecognitionSessionId) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      const rec = new SpeechRecognitionClass();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = BCP47_MAP[lang] || 'en-US';
      recognition = rec;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        if (sessionId !== activeRecognitionSessionId) return;
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i]?.[0]?.transcript || '';
          if (event.results[i].isFinal) {
            finalTranscript += ' ' + transcriptPiece;
          } else {
            interimTranscript += ' ' + transcriptPiece;
          }
        }

        const cleanFinal = finalTranscript.trim();
        const cleanInterim = interimTranscript.trim();

        if (cleanFinal) {
          flushSafe(cleanFinal);
        } else if (cleanInterim) {
          pendingInterimText = cleanInterim;
          if (interimFlushTimer) clearTimeout(interimFlushTimer);
          interimFlushTimer = setTimeout(() => {
            if (shouldKeepListening && pendingInterimText && sessionId === activeRecognitionSessionId) {
              flushSafe(pendingInterimText);
            }
          }, 1150);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onerror = (event: any) => {
        const errCode = String(event?.error || 'speech-error');
        if (errCode === 'not-allowed' || errCode === 'service-not-allowed' || errCode === 'language-not-supported') {
          shouldKeepListening = false;
        }
        if (onError) onError(errCode);
      };

      rec.onend = () => {
        if (pendingInterimText && sessionId === activeRecognitionSessionId) {
          flushSafe(pendingInterimText);
        }
        if (shouldKeepListening && sessionId === activeRecognitionSessionId) {
          setTimeout(() => {
            if (shouldKeepListening && sessionId === activeRecognitionSessionId) {
              launchInstance();
            }
          }, 260);
        } else if (onEnd) {
          onEnd();
        }
      };

      rec.start();
    } catch (err) {
      shouldKeepListening = false;
      if (onError) onError(String(err));
    }
  };

  launchInstance();
  return true;
}

export function stopSpeechRecognition(): void {
  shouldKeepListening = false;
  activeRecognitionSessionId++;
  if (interimFlushTimer) {
    clearTimeout(interimFlushTimer);
    interimFlushTimer = null;
  }
  pendingInterimText = '';
  if (recognition) {
    try {
      recognition.onend = null;
      recognition.stop();
    } catch {
      // ignore
    }
    recognition = null;
  }
}

/**
 * Fallback live speech-to-text using MediaRecorder slices + server /api/transcribe
 * when Web Speech API is unsupported (e.g. Firefox, iOS WebViews, Oromo/Tigrinya browsers).
 */
export function startAudioChunkTranscription(
  stream: MediaStream,
  sourceLang: LanguageCode,
  onTranscript: (text: string) => void,
  onError?: (err: string) => void
): boolean {
  stopAudioChunkTranscription();
  if (typeof MediaRecorder === 'undefined' || !stream) {
    onError?.('MediaRecorder unavailable');
    return false;
  }

  const audioTracks = stream.getAudioTracks().filter((t) => t.readyState === 'live' && t.enabled);
  if (audioTracks.length === 0) {
    onError?.('No active audio track');
    return false;
  }

  chunkActive = true;
  const audioOnlyStream = new MediaStream([audioTracks[0]]);
  const preferredMime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : MediaRecorder.isTypeSupported('audio/webm')
    ? 'audio/webm'
    : 'audio/mp4';

  const recordOneSlice = () => {
    if (!chunkActive) return;
    try {
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(audioOnlyStream, preferredMime ? { mimeType: preferredMime } : undefined);
      chunkRecorder = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 800) {
          chunks.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        if (!chunkActive || chunks.length === 0) return;
        const blob = new Blob(chunks, { type: recorder.mimeType || preferredMime || 'audio/webm' });
        if (blob.size < 2500) return;

        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
            if (!chunkActive || typeof reader.result !== 'string') return;
            const base64 = reader.result.split(',')[1];
            if (!base64) return;
            const transcript = await transcribeAudioWithGemini(
              base64,
              blob.type || 'audio/webm',
              sourceLang
            );
            if (transcript && transcript.length > 1) {
              onTranscript(transcript);
            }
          };
          reader.readAsDataURL(blob);
        } catch {
          // ignore slice failure
        }
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state === 'recording') {
          try {
            recorder.stop();
          } catch {
            // ignore
          }
        }
      }, 3600);
    } catch (err) {
      onError?.(String(err));
      stopAudioChunkTranscription();
    }
  };

  recordOneSlice();
  chunkInterval = setInterval(recordOneSlice, 3900);
  return true;
}

export function stopAudioChunkTranscription(): void {
  chunkActive = false;
  if (chunkInterval) {
    clearInterval(chunkInterval);
    chunkInterval = null;
  }
  if (chunkRecorder && chunkRecorder.state === 'recording') {
    try {
      chunkRecorder.stop();
    } catch {
      // ignore
    }
  }
  chunkRecorder = null;
}

function playBase64Audio(audioBase64: string, mimeType: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const binaryStr = atob(audioBase64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      currentDubAudio = audio;
      audio.volume = 1.0;

      const finish = (ok: boolean) => {
        if (currentDubAudio === audio) currentDubAudio = null;
        URL.revokeObjectURL(url);
        resolve(ok);
      };

      audio.onended = () => finish(true);
      audio.onerror = () => finish(false);
      audio.play().catch(() => finish(false));
    } catch {
      resolve(false);
    }
  });
}

function speakWithBrowserTTS(text: string, lang: LanguageCode): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) {
      resolve();
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const targetBcp = BCP47_MAP[lang] || 'en-US';
      utterance.lang = targetBcp;
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const shortCode = targetBcp.substring(0, 2).toLowerCase();
      const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(shortCode));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };

      utterance.onend = finish;
      utterance.onerror = finish;
      // Safety timeout in case mobile Chrome hangs onend
      setTimeout(finish, Math.min(14000, Math.max(3000, text.length * 110)));

      window.speechSynthesis.speak(utterance);
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      resolve();
    }
  });
}

async function processDubQueue(): Promise<void> {
  if (isPlayingDubQueue) return;
  isPlayingDubQueue = true;

  if (dubQueue.length > 0) {
    dispatchDubbingState(true);
  }

  while (dubQueue.length > 0) {
    const item = dubQueue.shift()!;
    try {
      if (!audioUnlocked) unlockAudioPlayback();

      // Primary: crisp server-side Gemini TTS (guarantees Amharic, Oromo, Tigrinya, Chinese, Arabic, etc.)
      const ttsResult = await synthesizeSpeechWithGemini(item.text, item.lang);
      let played = false;
      if (ttsResult?.audioBase64) {
        played = await playBase64Audio(ttsResult.audioBase64, ttsResult.mimeType);
      }

      if (!played) {
        await speakWithBrowserTTS(item.text, item.lang);
      }
    } catch {
      await speakWithBrowserTTS(item.text, item.lang);
    } finally {
      item.resolve();
    }
  }

  dispatchDubbingState(false);
  isPlayingDubQueue = false;
}

/**
 * Queues translated speech so incoming messages play aloud sequentially without overlapping
 * and temporarily ducks remote peer raw audio during dubbing.
 */
export function speakTranslationQueued(text: string, lang: LanguageCode): Promise<void> {
  if (!text || !text.trim()) return Promise.resolve();
  return new Promise((resolve) => {
    // Keep queue bounded to last 6 utterances so lag never accumulates
    if (dubQueue.length >= 6) {
      const dropped = dubQueue.shift();
      dropped?.resolve();
    }
    dubQueue.push({ text: text.trim(), lang, resolve });
    processDubQueue();
  });
}

export function clearDubbingQueue(): void {
  while (dubQueue.length > 0) {
    const item = dubQueue.shift();
    item?.resolve();
  }
  if (currentDubAudio) {
    try {
      currentDubAudio.pause();
    } catch {
      // ignore
    }
    currentDubAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  dispatchDubbingState(false);
}

/**
 * Text to speech synthesizer for manual button clicks (uses server Gemini TTS + browser fallback)
 */
export function speakText(text: string, lang: LanguageCode): void {
  if (!text || text.trim() === '') return;
  unlockAudioPlayback();
  void speakTranslationQueued(text, lang);
}

/**
 * Synchronized Voice Announcement when user changes language
 */
export function announceLanguageSwitch(lang: LanguageCode | string): void {
  const announcements: Record<string, string> = {
    am: 'ቋንቋ ወደ አማርኛ ተቀይሯል። ወደ Oneworld እንኳን ደህና መጡ!',
    om: 'Afaan Oromoo filatameera. Baga gara Oneworld dhuftan!',
    ti: 'ቋንቋ ናብ ትግርኛ ተቐይሩ ኣሎ። ናብ Oneworld እንቋዕ ብደሓን መጻእኹም!',
    en: 'Language switched to English. Welcome to Oneworld!',
    fr: 'Langue changée en français. Bienvenue sur Oneworld !',
    zh: '语言已切换为中文。欢迎来到 Oneworld！',
    ar: 'تم تغيير اللغة إلى العربية. مرحباً بكم في Oneworld!',
    es: 'Idioma cambiado a español. ¡Bienvenido a Oneworld!',
    de: 'Sprache auf Deutsch umgestellt. Willkommen bei Oneworld!'
  };

  const text = announcements[lang] || announcements.am;
  unlockAudioPlayback();
  void speakTranslationQueued(text, lang as LanguageCode);
}
