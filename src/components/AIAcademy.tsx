import React, { useState } from 'react';
import { generateAICourseTopic, askAIEducationQuestion } from '../services/geminiService';
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
  Loader2,
  Send,
  MessageSquare,
  BookCheck,
  ChevronRight,
  Layers
} from 'lucide-react';

interface AIAcademyProps {
  userLang: LanguageCode;
  onEarnRoyalty: (amount: number, reason: string) => void;
}

export const AIAcademy: React.FC<AIAcademyProps> = ({ userLang, onEarnRoyalty }) => {
  const [activeTab, setActiveTab] = useState<'qa' | 'curriculum'>('qa');

  // --- Q&A Terminal State ---
  const [questionText, setQuestionText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ሳይንስና ቴክኖሎጂ');
  const [selectedLevel, setSelectedLevel] = useState('ሁለተኛ ደረጃ / ኮሌጅ');
  const [isAsking, setIsAsking] = useState(false);
  const [qaAnswer, setQaAnswer] = useState<{
    questionTitle: string;
    directAnswer: string;
    keyPoints: string[];
    realWorldExample: string;
    followUpSuggestions: string[];
  } | null>(null);

  // --- Curriculum Generator State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);
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

  const subjectsList = [
    'ሳይንስና ቴክኖሎጂ',
    'ሂሳብና ፊዚክስ',
    'ህክምናና የጤና ሳይንስ',
    'ህግና ፖለቲካ',
    'ስነ-ጥበብና ታሪክ',
    'ቋንቋና ስነ-ፅሁፍ',
    'ቢዝነስና ኢኮኖሚ',
    'ግብርናና የተፈጥሮ ሀብት',
    'መንፈሳዊና ፍልስፍና'
  ];

  const levelList = [
    'አንደኛ ደረጃ (Primary)',
    'ሁለተኛ ደረጃ / ኮሌጅ (Secondary/College)',
    'ዩኒቨርሲቲ / የመጀመሪያ ዲግሪ (Undergraduate)',
    'ማስተርስና የላቀ ምርምር (Postgraduate/PhD)'
  ];

  const presetQuestions = [
    'የሰው ሰራሽ አስተውሎት (AI) እና የሰው አእምሮ ዋና ልዩነት ምንድን ነው?',
    'የኳንተም ሜካኒክስ መሰረታዊ ህጎች እንዴት ይተገበራሉ?',
    'የሰው ልጅ የልብ ዝውውር ስርአት እንዴት ይሰራል?',
    'የኢኮኖሚ ግሽበትን (Inflation) ለመቆጣጠር ውጤታማ ፖሊሲዎች ምንድን ናቸው?',
    'የፎቶሲንተሲስ (Photosynthesis) ኬሚካላዊ ሂደት ደረጃ በደረጃ እንዴት ነው?',
    'የጥንታዊት ግብፅና የአክሱም ስልጣኔዎች ታሪካዊ ግንኙነት ምን ይመስላል?'
  ];

  const sampleCurriculumTopics = [
    'የሰው ሰራሽ አስተውሎት (Artificial Intelligence)',
    'የጥንታዊ አለም ስልጣኔዎችና ቅርሶች',
    'የሰው ልጅ ጤናና ረጅም እድሜ ሳይንስ',
    'አለም አቀፍ ህግና ጂኦፖለቲክስ',
    'ዘመናዊ የፀሐይ ሀይልና ግብርና',
    'ዲጂታል ፋይናንስና እቁብ ኢኮኖሚ'
  ];

  const handleAskQuestion = async (q: string) => {
    if (!q.trim() || isAsking) return;
    setIsAsking(true);
    try {
      const result = await askAIEducationQuestion(q, selectedSubject, selectedLevel, userLang);
      setQaAnswer(result);
      onEarnRoyalty(20, `በትምህርት ቤት የኤአይ ጥያቄ ማቅረብ (${q.slice(0, 30)})`);
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      } catch {}
    } catch (e) {
      console.error('Q&A generation error:', e);
    } finally {
      setIsAsking(false);
    }
  };

  const handleVoiceQa = () => {
    if (!qaAnswer) return;
    const textToRead = `${qaAnswer.questionTitle}። ${qaAnswer.directAnswer}። ቁልፍ ነጥቦች፡ ${qaAnswer.keyPoints.join('። ')}። ተግባራዊ ምሳሌ፡ ${qaAnswer.realWorldExample}`;
    speakText(textToRead, userLang);
  };

  const handleSearchCurriculum = async (topicToSearch: string) => {
    if (!topicToSearch.trim() || isLoadingCourse) return;
    setIsLoadingCourse(true);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);

    try {
      const generated = await generateAICourseTopic(topicToSearch, userLang);
      setCourseData(generated);
      onEarnRoyalty(15, `በኤአይ አካዳሚ አዲስ እውቀት ማመንጨት (${topicToSearch})`);
    } catch (e) {
      console.error('Course generation error:', e);
    } finally {
      setIsLoadingCourse(false);
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
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch {}
      onEarnRoyalty(30, `የኤአይ ትምህርት ፈተና በድል ማጠናቀቅ (${courseData.title})`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Crisp Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">
              የትምህርት ቤት · ገደብ የለሽ የኤአይ እውቀት ማዕከል
            </h2>
            <p className="text-[11px] text-slate-400">
              በማንኛውም የትምህርት ዘርፍ ጥያቄ የሚያቀርቡበትና ፈጣን ማብራሪያ የሚያገኙበት
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'qa'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ጥያቄና መልስ (Q&A)</span>
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'curriculum'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookCheck className="w-3.5 h-3.5" />
            <span>ስርአተ-ትምህርት (Curriculum)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIMITLESS AI QUESTION & ANSWER TERMINAL */}
      {activeTab === 'qa' && (
        <div className="space-y-6">
          <div className="bg-[#101626] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            {/* Subject and Level Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  የትምህርት ዘርፍ ምረጥ (Subject Domain)
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-bold"
                >
                  {subjectsList.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  የትምህርት ደረጃ (Education Level)
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-bold"
                >
                  {levelList.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskQuestion(questionText);
              }}
              className="space-y-3"
            >
              <div className="relative">
                <textarea
                  rows={3}
                  required
                  placeholder="የሚፈልጉትን ማንኛውንም የትምህርት ጥያቄ እዚህ ይጻፉ... (ለምሳሌ፡ የፎቶሲንተሲስ ሂደት ደረጃ በደረጃ እንዴት ይከናወናል?)"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  <span>በአለም አቀፍ Gemini AI የላቀ ሞዴል የሚመነጭ መልስ</span>
                </div>

                <button
                  type="submit"
                  disabled={isAsking || !questionText.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-950 flex items-center gap-2 cursor-pointer"
                >
                  {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>ጥያቄውን አቅርብና መልስ አግኝ</span>
                </button>
              </div>
            </form>

            {/* Quick Sample Questions Carousel */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                የተመረጡ ተደጋጋሚ ጥያቄዎች (Sample Inquiries)፦
              </span>
              <div className="flex flex-wrap gap-2">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuestionText(q);
                      handleAskQuestion(q);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950/50 text-slate-300 hover:text-indigo-300 border border-slate-800 rounded-xl text-xs transition-colors text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {isAsking && (
            <div className="p-10 bg-[#101626] border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 shadow-xl">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <h4 className="text-sm font-bold text-white">ኤአይ አስተማሪው ጥያቄዎን በጥልቀት በመተንተን ላይ ነው...</h4>
              <p className="text-xs text-slate-400">ሳይንሳዊ ትክክለኛነት ያለው የተሟላ ማብራሪያ እየተዘጋጀ ነው</p>
            </div>
          )}

          {/* AI Response Card */}
          {!isAsking && qaAnswer && (
            <div className="bg-[#101626] border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 inline-block mb-1">
                    {selectedSubject} · {selectedLevel}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {qaAnswer.questionTitle}
                  </h3>
                </div>

                <button
                  onClick={handleVoiceQa}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                  title="መልሱን በድምፅ አድምጥ"
                >
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  <span>በድምፅ አድምጥ</span>
                </button>
              </div>

              {/* Direct Detailed Answer */}
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 whitespace-pre-line bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {qaAnswer.directAnswer}
              </div>

              {/* Key Takeaway Points */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  <span>ቁልፍ ነጥቦችና መደምደሚያ (Key Insights)፦</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {qaAnswer.keyPoints.map((point, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-World Demonstration */}
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl text-xs text-slate-300 space-y-1">
                <span className="font-bold text-emerald-400">ተግባራዊ ምሳሌና የዕለት ተዕለት ፋይዳ፦</span>
                <p className="leading-relaxed">{qaAnswer.realWorldExample}</p>
              </div>

              {/* Follow-up Questions Suggestions */}
              {qaAnswer.followUpSuggestions && qaAnswer.followUpSuggestions.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400">ቀጣይ ተዛማጅ ጥያቄዎች፦</span>
                  <div className="flex flex-wrap gap-2">
                    {qaAnswer.followUpSuggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => {
                          setQuestionText(sug);
                          handleAskQuestion(sug);
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-700 cursor-pointer flex items-center gap-1"
                      >
                        <ChevronRight className="w-3 h-3 text-indigo-400" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CURRICULUM GENERATOR */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchCurriculum(searchQuery);
              }}
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="የሚፈልጉትን የትምህርት ርዕስ እዚህ ይፈልጉ... (ለምሳሌ፡ የሰው ሰራሽ አስተውሎት፣ የጠፈር ሳይንስ)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingCourse || !searchQuery.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoadingCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>ስርአተ-ትምህርት አዘጋጅ</span>
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 text-[11px] font-medium mr-1">የተመረጡ ርዕሶች፡</span>
              {sampleCurriculumTopics.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(topic);
                    handleSearchCurriculum(topic);
                  }}
                  className="px-3 py-1 bg-slate-900 hover:bg-indigo-950/50 text-slate-300 hover:text-indigo-300 border border-slate-800 rounded-lg text-[11px] transition-colors cursor-pointer"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {isLoadingCourse && (
            <div className="p-12 bg-[#101626] border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <h4 className="text-sm font-bold text-white">የትምህርት ሞጁሉ እየተዘጋጀ ነው...</h4>
              <p className="text-xs text-slate-400">ፅንሰ-ሀሳቦችና የፈተና ጥያቄዎች እየተመነጩ ነው</p>
            </div>
          )}

          {!isLoadingCourse && courseData && (
            <div className="bg-[#101626] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
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
                  <span>በትረካ ድምፅ አዳምጡ</span>
                </button>
              </div>

              {/* Core Concepts */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  መሰረታዊ ፅንሰ ሀሳቦች
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

              {/* Quiz */}
              <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <HelpCircle className="w-4 h-4" />
                  የእውቀት መፈተሻ ጥያቄ
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
      )}
    </div>
  );
};
