import { LanguageCode } from '../types';
import { getApiUrl } from '../config/env';

// Client-side session translation cache for instant zero-latency repeat lookups
const clientTranslationCache = new Map<string, string>();
const clientTtsCache = new Map<string, { audioBase64: string; mimeType: string }>();
const MAX_CLIENT_TTS_CACHE = 150;

/**
 * Single-target translation routed through backend Gemini API (/api/translate).
 * Returns null if translation fails so callers NEVER show untranslated text disguised as a translation.
 */
export async function translateTextWithGemini(
  text: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode
): Promise<string | null> {
  if (!text || text.trim() === '') return null;
  const cleanText = text.trim();
  if (sourceLang === targetLang) return cleanText;

  const cacheKey = `${sourceLang}=>${targetLang}:${cleanText}`;
  const cached = clientTranslationCache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(getApiUrl('/api/translate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText, sourceLang, targetLang })
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.translatedText && typeof data.translatedText === 'string') {
        const translated = data.translatedText.trim();
        if (translated) {
          clientTranslationCache.set(cacheKey, translated);
          return translated;
        }
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      console.warn('Translation API error:', res.status, errData?.error || '');
    }
  } catch (err) {
    console.warn('Translation request failed:', err);
  }

  return null;
}

/**
 * Multi-language batch translation in ONE single Gemini request (/api/translate-batch).
 * Prevents rate-limit/quota exhaustion while hydrating all listeners simultaneously.
 */
export async function translateBatchWithGemini(
  text: string,
  sourceLang: LanguageCode,
  targetLangs: LanguageCode[]
): Promise<{ translations: Partial<Record<LanguageCode, string>>; error?: string }> {
  const cleanText = (text || '').trim();
  if (!cleanText) return { translations: {} };

  const resolved: Partial<Record<LanguageCode, string>> = {
    [sourceLang]: cleanText
  };

  const missing: LanguageCode[] = [];
  for (const tgt of targetLangs) {
    if (tgt === sourceLang) continue;
    const cacheKey = `${sourceLang}=>${tgt}:${cleanText}`;
    const cached = clientTranslationCache.get(cacheKey);
    if (cached) {
      resolved[tgt] = cached;
    } else {
      missing.push(tgt);
    }
  }

  if (missing.length === 0) {
    return { translations: resolved };
  }

  try {
    const res = await fetch(getApiUrl('/api/translate-batch'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText, sourceLang, targetLangs: missing })
    });

    const data = await res.json().catch(() => ({}));
    const returnedMap: Record<string, string> | undefined =
      data?.translations || data?.partialTranslations;

    if (returnedMap && typeof returnedMap === 'object') {
      for (const [code, val] of Object.entries(returnedMap)) {
        if (typeof val === 'string' && val.trim()) {
          const cleanVal = val.trim();
          resolved[code as LanguageCode] = cleanVal;
          clientTranslationCache.set(`${sourceLang}=>${code}:${cleanText}`, cleanVal);
        }
      }
    }

    if (!res.ok) {
      return {
        translations: resolved,
        error: data?.error || `Translation batch error (${res.status})`
      };
    }

    return { translations: resolved };
  } catch (err: any) {
    return {
      translations: resolved,
      error: err?.message || 'Network error during translation'
    };
  }
}

let ttsCooldownUntil = 0;

/**
 * Server-side Gemini TTS (/api/tts) returning WAV audio for crisp spoken translations in ALL languages
 */
export async function synthesizeSpeechWithGemini(
  text: string,
  lang: LanguageCode
): Promise<{ audioBase64: string; mimeType: string } | null> {
  const cleanText = (text || '').trim().slice(0, 600);
  if (!cleanText) return null;

  const cacheKey = `${lang}:${cleanText}`;
  const cached = clientTtsCache.get(cacheKey);
  if (cached) return cached;

  if (Date.now() < ttsCooldownUntil) {
    return null;
  }

  try {
    const res = await fetch(getApiUrl('/api/tts'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText, lang })
    });

    if (res.status === 429) {
      ttsCooldownUntil = Date.now() + 10000;
      return null;
    }
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (data?.audioBase64) {
      const payload = {
        audioBase64: String(data.audioBase64),
        mimeType: String(data.mimeType || 'audio/wav')
      };
      if (clientTtsCache.size >= MAX_CLIENT_TTS_CACHE) {
        const oldest = clientTtsCache.keys().next().value;
        if (oldest) clientTtsCache.delete(oldest);
      }
      clientTtsCache.set(cacheKey, payload);
      return payload;
    }
  } catch (err) {
    console.warn('TTS request failed:', err);
  }

  return null;
}

/**
 * Server-side Audio Transcription fallback (/api/transcribe) via gemini-3.5-transcribe
 */
export async function transcribeAudioWithGemini(
  audioBase64: string,
  mimeType: string,
  sourceLang: LanguageCode
): Promise<string> {
  if (!audioBase64) return '';
  try {
    const res = await fetch(getApiUrl('/api/transcribe'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType, sourceLang })
    });
    if (!res.ok) return '';
    const data = await res.json().catch(() => null);
    return typeof data?.transcript === 'string' ? data.transcript.trim() : '';
  } catch {
    return '';
  }
}

/**
 * AI Academy: Generates structured interactive lessons via server-side Gemini API (/api/ai/course)
 */
export async function generateAICourseTopic(
  topicPrompt: string,
  userLang: LanguageCode = 'am'
): Promise<{
  title: string;
  summary: string;
  coreConcepts: { title: string; explanation: string }[];
  practicalApplication: string;
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}> {
  const res = await fetch(getApiUrl('/api/ai/course'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topicPrompt, userLang })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error || 'የትምህርት ሞጁሉን ከሰርቨር ማምጣት አልተቻለም። እባክዎ የኢንተርኔት ወይም የAPI ቁልፍ ሁኔታን ያረጋግጡ።');
  }

  return res.json();
}

/**
 * Limitless Educational AI Q&A Engine for House 10 (/api/ai/ask)
 */
export async function askAIEducationQuestion(
  question: string,
  subject: string = 'ሳይንስና ቴክኖሎጂ',
  level: string = 'ሁለተኛ ደረጃ / ኮሌጅ',
  userLang: LanguageCode = 'am'
): Promise<{
  questionTitle: string;
  directAnswer: string;
  keyPoints: string[];
  realWorldExample: string;
  followUpSuggestions: string[];
}> {
  if (!question || !question.trim()) {
    throw new Error('Question cannot be empty');
  }

  const res = await fetch(getApiUrl('/api/ai/ask'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, subject, level, userLang })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error || 'መልሱን ከኤአይ ሰርቨር ማምጣት አልተቻለም።');
  }

  return res.json();
}
