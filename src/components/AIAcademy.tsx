import React, { useState } from 'react';
import { generateAICourseTopic } from '../services/geminiService';
import { speakText } from '../services/speechService';
import { LanguageCode } from '../types';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  BrainCircuit, 
  Loader2 
} from 'lucide-react';

interface AIAcademyProps {
  userLang: LanguageCode;
  onEarnRoyalty: (amount: number, reason: string) => void;
}

export const AIAcademy: React.FC<AIAcademyProps> = ({ userLang, onEarnRoyalty }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<{
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
  } | null>(null);

  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const sampleTopics = [
    'የሰው ሰራሽ አስተውሎት (Artificial Intelligence)',
    'የኢትዮጵያ ጥንታዊ ስልጣኔና ቅርሶች',
    'አለም አቀፍ ህግና ጂኦፖለቲክስ',
    'ዘመናዊ የፀሐይ ሀይልና ግብርና',
    'የኳንተም ኮምፒውቲንግ መሰረታዊያን',
    'ዲጂታል ፋይናንስና እቁብ ኢኮኖሚ'
  ];

  const handleSearchTopic = async (topicToSearch: string) => {
    if (!topicToSearch.trim() || isLoading) return;
    setIsLoading(true);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);

    try {
      const generated = await generateAICourseTopic(topicToSearch, userLang);
      setCourseData(generated);
      onEarnRoyalty(15, `በኤአይ አካዳሚ አዲስ እውቀት ማመንጨት (${topicToSearch})`);
    } catch (e) {
      console.error('Course generation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceNarration = () => {
    if (!courseData) return;
    const narrationText = `${courseData.title}። ${courseData.summary}። ዋና ዋና ፅንሰ ሀሳቦች፡ ${courseData.coreConcepts.map(c => c.title + '፣ ' + c.explanation).join('። ')}`;
    speakText(narrationText, userLang);
  };

  const handleAnswerQuiz = (index: number) => {
    if (quizSubmitted || !courseData) return;
    setSelectedQuizAnswer(index);
    setQuizSubmitted(true);

    if (index === courseData.quizQuestion.correctIndex) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      onEarnRoyalty(30, `የኤአይ ትምህርት ፈተና በድል ማጠናቀቅ (${courseData.title})`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-black text-white">
              የኤአይ አውቶማቲክ የትምህርት አድማስ (AI Universal Knowledge Engine)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            በማንኛውም የትምህርት አይነት ላይ እውቀት የሚመነጭበት፣ የተሟላ ስርአተ-ትምህርት የሚቀርብበትና በድምፅ የሚተረክበት መድረክ
          </p>
        </div>

        <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>በGemini AI የላቀ ሞዴል የሚመነጭ እውቀት</span>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchTopic(searchQuery);
          }}
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="የሚፈልጉትን የትምህርት ርዕስ እዚህ ይፈልጉ... (ለምሳሌ፡ የሰው ሰራሽ አስተውሎት፣ የጠፈር ሳይንስ፣ ስራ ፈጠራ)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-950 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>እውቀት አመንጭ (Generate Lesson)</span>
          </button>
        </form>

        {/* Quick Recommended Topics */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">የተመረጡ ርዕሶች፡</span>
          {sampleTopics.map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSearchQuery(topic);
                handleSearchTopic(topic);
              }}
              className="px-3 py-1 bg-slate-900 hover:bg-indigo-950/50 text-slate-300 hover:text-indigo-300 border border-slate-800 rounded-lg text-[11px] transition-colors cursor-pointer"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Course Display */}
      {isLoading && (
        <div className="p-12 bg-[#101626] border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <h4 className="text-sm font-bold text-white">የሰው ሰራሽ አስተውሎት ሞዴሉ እውቀቱን እያመነጨ ነው...</h4>
          <p className="text-xs text-slate-400">የትምህርት ሞጁል፣ ማብራሪያዎች እና የፈተና ጥያቄዎች እየተዘጋጁ ነው</p>
        </div>
      )}

      {!isLoading && courseData && (
        <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Course Title & Narration */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                የተጠናቀቀ የትምህርት ሞጁል
              </div>
              <h3 className="text-lg font-black text-white">{courseData.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                {courseData.summary}
              </p>
            </div>

            <button
              onClick={handleVoiceNarration}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Volume2 className="w-4 h-4" />
              <span>በትረካ ድምፅ አዳምጡ (Voice Narration)</span>
            </button>
          </div>

          {/* Core Concepts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              መሰረታዊ ፅንሰ ሀሳቦች (Key Educational Pillars)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {courseData.coreConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                >
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    ክፍል 0{idx + 1}
                  </span>
                  <h5 className="text-xs font-bold text-white">{concept.title}</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">{concept.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Application */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-1">
            <span className="text-xs font-bold text-emerald-400">ተግባራዊ ፋይዳና አተገባበር፡</span>
            <p className="text-xs text-slate-300 leading-relaxed">{courseData.practicalApplication}</p>
          </div>

          {/* Interactive Quiz Question */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <HelpCircle className="w-4 h-4" />
              የእውቀት መፈተሻ ጥያቄ (Comprehension Check)
            </div>
            <p className="text-xs font-semibold text-white">{courseData.quizQuestion.question}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {courseData.quizQuestion.options.map((option, optIdx) => {
                const isSelected = selectedQuizAnswer === optIdx;
                const isCorrect = optIdx === courseData.quizQuestion.correctIndex;

                let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                if (quizSubmitted) {
                  if (isCorrect) {
                    style = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                  } else if (isSelected) {
                    style = 'bg-red-950/60 border-red-500 text-red-300';
                  } else {
                    style = 'bg-slate-950/40 border-slate-800 text-slate-600';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={quizSubmitted}
                    onClick={() => handleAnswerQuiz(optIdx)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${style}`}
                  >
                    <span>{option}</span>
                    {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <strong>ማብራሪያ፡ </strong>{courseData.quizQuestion.explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
