import { LanguageCode } from '../types';

/**
 * Speech Recognition and Speech Synthesis helper
 * Integrates Web Speech API with real-time translation loop
 */

// Speech Recognition instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recognition: any = null;

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function startSpeechRecognition(
  lang: LanguageCode,
  onResult: (text: string, isFinal: boolean) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
): boolean {
  if (!isSpeechRecognitionSupported()) {
    if (onError) onError('Speech recognition is not supported in this browser.');
    return false;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    }

    recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;

    // Map language codes to BCP 47
    const langMap: Record<LanguageCode, string> = {
      am: 'am-ET',
      en: 'en-US',
      om: 'om-ET',
      ti: 'ti-ET',
      ar: 'ar-SA',
      fr: 'fr-FR',
      es: 'es-ES',
      zh: 'zh-CN'
    };

    recognition.lang = langMap[lang] || 'am-ET';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        onResult(interimTranscript.trim(), false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      if (onError) onError(event.error || 'Speech recognition error');
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    recognition.start();
    return true;
  } catch (err) {
    if (onError) onError(String(err));
    return false;
  }
}

export function stopSpeechRecognition(): void {
  if (recognition) {
    try {
      recognition.stop();
    } catch {
      // ignore
    }
    recognition = null;
  }
}

/**
 * Text to speech synthesizer (Audio voice output for translations)
 */
export function speakText(text: string, lang: LanguageCode): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text || text.trim() === '') return;

  try {
    window.speechSynthesis.cancel(); // cancel pending

    const utterance = new SpeechSynthesisUtterance(text);
    const langVoiceMap: Record<LanguageCode, string> = {
      am: 'am-ET',
      en: 'en-US',
      om: 'om-ET',
      ti: 'ti-ET',
      ar: 'ar-SA',
      fr: 'fr-FR',
      es: 'es-ES',
      zh: 'zh-CN'
    };

    utterance.lang = langVoiceMap[lang] || 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2)));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('SpeechSynthesis error:', e);
  }
}
