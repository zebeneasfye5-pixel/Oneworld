import { LanguageCode } from '../types';
import { getApiUrl } from '../config/env';

// Client-side session translation cache for instant zero-latency repeat lookups
const clientTranslationCache = new Map<string, string>();

/**
 * Intelligent multilingual translation service routed through the backend Gemini API (/api/translate).
 */
export async function translateTextWithGemini(
  text: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode
): Promise<string> {
  if (!text || text.trim() === '') return '';
  if (sourceLang === targetLang) return text;

  const cacheKey = `${sourceLang}=>${targetLang}:${text.trim()}`;
  const cached = clientTranslationCache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(getApiUrl('/api/translate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceLang, targetLang })
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.translatedText) {
        clientTranslationCache.set(cacheKey, data.translatedText);
        return data.translatedText;
      }
    }
  } catch (err) {
    console.warn('Translation request notice:', err);
  }

  return text;
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
