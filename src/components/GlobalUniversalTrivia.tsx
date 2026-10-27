import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Trophy, 
  RefreshCw, 
  BookOpen, 
  Brain,
  Globe2,
  Award,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText } from '../services/speechService';
import { AppLanguage } from '../i18n/translations';

export interface TriviaItem {
  id: string;
  category: string;
  categoryIcon: string;
  difficulty: 'ጀማሪ (Foundational)' | 'መካከለኛ (Advanced)' | 'የሊቃውንት ደረጃ (Mastery)';
  questionAm: string;
  optionsAm: string[];
  correctIndex: number;
  rewardETB: number;
  explanationAm: string;
  realWorldImpact: string;
}

const EXTENSIVE_GLOBAL_TRIVIA: TriviaItem[] = [
  // 1. World History & Civilization
  {
    id: 't-hist-1',
    category: 'የአለም ታሪክና ስልጣኔ',
    categoryIcon: '🏛️',
    difficulty: 'መካከለኛ (Advanced)',
    questionAm: 'የሰው ልጅ ጥንታዊ መነሻ ተብላ በዩኔስኮና በአለም ሳይንቲስቶች የምትታወቀውና ሉሲ (ድንቅነሽ) የተገኘችበት ምድር የትኛዋ ናት?',
    optionsAm: ['ግብፅ', 'ኢትዮጵያ', 'ግሪክ', 'ህንድ'],
    correctIndex: 1,
    rewardETB: 50,
    explanationAm: 'ሉሲ (ድንቅነሽ) በኢትዮጵያ አፋር ክልል ሃዳር ውስጥ በ1974 እ.ኤ.አ የተገኘች የ3.2 ሚሊዮን አመታት እድሜ ያላት የሰው ዘር ቅሪተ-አካል ናት።',
    realWorldImpact: 'የሰው ልጆች በሙሉ አንድ የጋራ የዘር ግንድ እንዳላቸው የሚያረጋግጥ ሳይንሳዊ መሰረት ነው።'
  },
  {
    id: 't-hist-2',
    category: 'የአለም ታሪክና ስልጣኔ',
    categoryIcon: '🏛️',
    difficulty: 'የሊቃውንት ደረጃ (Mastery)',
    questionAm: 'በጥንታዊው አለም የራሳቸውን መገበያያ የወርቅና የብር ሳንቲም የቀረጹ ከሮማ፣ ፋርስና ቻይና ጋር አራተኛው ታላቅ የንግድ ስልጣኔ የትኛው ነበር?',
    optionsAm: ['የአክሱም ስልጣኔ', 'የባቢሎን ስልጣኔ', 'የማያ ስልጣኔ', 'የኦቶማን ስልጣኔ'],
    correctIndex: 0,
    rewardETB: 75,
    explanationAm: 'የአክሱም ስልጣኔ በኢትዮጵያ ምድር ከክርስቶስ ልደት በፊት ጀምሮ እስከ መጀመሪያው ሺህ አመት የራሱን ገንዘብ የቀረጸ የአለም አቀፍ የንግድና የባህር ሃይል ማዕከል ነበር።',
    realWorldImpact: 'የፋይናንስ ሉዓላዊነትና አለም አቀፍ የንግድ ስርአት ጥንታዊ መሰረትን ያሳያል።'
  },
  {
    id: 't-hist-3',
    category: 'የአለም ታሪክና ስልጣኔ',
    categoryIcon: '🏛️',
    difficulty: 'መካከለኛ (Advanced)',
    questionAm: 'በጥንቷ ግብፅ ከክርስቶስ ልደት በፊት በ2560 የተገነባውና እስከ ዛሬ በህይወት የቆየው ብቸኛው የጥንታዊ አለም አስደናቂ ቅርስ የቱ ነው?',
    optionsAm: ['የባቢሎን አንጠልጣይ አትክልት', 'የጊዛ ታላቁ ፒራሚድ', 'የአሌክሳንድሪያ ብርሃን ማማ', 'የሮዶስ ግዙፉ ሀውልት'],
    correctIndex: 1,
    rewardETB: 50,
    explanationAm: 'የጊዛ ታላቁ ፒራሚድ ለፈርዖን ኩፉ የተሰራ ሲሆን ከሰባቱ የጥንታዊ አለም ድንቆች ብቸኛው እስካሁን ያልፈረሰ ነው።',
    realWorldImpact: 'የጥንታዊ ምህንድስና፣ የጂኦሜትሪ እና የከዋክብት እውቀት ጥልቀትን ያሳያል።'
  },

  // 2. Science, AI & Technology
  {
    id: 't-sci-1',
    category: 'ሳይንስ፣ AI እና ቴክኖሎጂ',
    categoryIcon: '🚀',
    difficulty: 'ጀማሪ (Foundational)',
    questionAm: 'በአርቴፊሻል ኢንተሊጀንስ (AI) ውስጥ "Machine Learning" የሚባለው ስርአት መሰረታዊ መርህ ምንድን ነው?',
    optionsAm: [
      'ኮምፒውተር ከቀረቡለት ሰፊ ዳታዎችና ልምዶች በራሱ እየተማረ ትንበያ መስጠት መቻሉ',
      'የሞባይል ባትሪ በፍጥነት እንዲሞላ ማድረግ ብቻ',
      'የኮምፒውተር ማቀዝቀዣ ማራገቢያ ማሽከርከር',
      'ኢንተርኔት ሳይኖር ድምፅ መቅዳት'
    ],
    correctIndex: 0,
    rewardETB: 50,
    explanationAm: 'ማሽን ለርኒንግ ኮምፒውተሮች ያለ ሰው ልጅ ቀጥታ ፕሮግራሚንግ ከተከማቸ ዳታ ውስጥ ቅጦችንና ህጎችን ለይተው ራሳቸውን እንዲያሻሽሉ ያስችላቸዋል።',
    realWorldImpact: 'የጤና ምርመራን፣ ቋንቋ ተርጓሚዎችንና ዘመናዊ ምርምርን በሰከንዶች ውስጥ ያሳልጣል።'
  },
  {
    id: 't-sci-2',
    category: 'ሳይንስ፣ AI እና ቴክኖሎጂ',
    categoryIcon: '🚀',
    difficulty: 'የሊቃውንት ደረጃ (Mastery)',
    questionAm: 'በአልበርት አንስታይን አንፃራዊነት ፅንሰ-ሀሳብ (E = mc²) ውስጥ "c" የሚወክለው ምንን ነው?',
    optionsAm: ['የኮምፒውተር ፍጥነት', 'የብርሃን ፍጥነት በባዶ ህዋ ውስጥ', 'የድምፅ ፍጥነት በአየር ውስጥ', 'የስበት ሀይል መጠን'],
    correctIndex: 1,
    rewardETB: 100,
    explanationAm: 'c የብርሃን ፍጥነት (በሰከንድ 300,000 ኪሎሜትር) ሲሆን ግዝፈት (Mass) ወደ ከፍተኛ ሀይል (Energy) የመቀየር ህግን ያረጋግጣል።',
    realWorldImpact: 'የኒውክሌር ሀይል፣ የፀሐይ ብርሃን አመነጫጨት እና የህዋ ጉዞ መሰረት ነው።'
  },
  {
    id: 't-sci-3',
    category: 'ሳይንስ፣ AI እና ቴክኖሎጂ',
    categoryIcon: '🚀',
    difficulty: 'መካከለኛ (Advanced)',
    questionAm: 'በኳንተም ኮምፒውቲንግ (Quantum Computing) ውስጥ ከመደበኛ 0 እና 1 ቢቶች በተለየ ሁለቱንም በአንድ ጊዜ መወከል የሚችለው መሰረታዊ መለኪያ ምን ይባላል?',
    optionsAm: ['ባይት (Byte)', 'ኪውቢት (Qubit)', 'ሜጋሄርትዝ (MHz)', 'ፒክስል (Pixel)'],
    correctIndex: 1,
    rewardETB: 75,
    explanationAm: 'ኪውቢት በሱፐርፖዚሽን (Superposition) ባህሪ በአንድ ጊዜ በ0 እና 1 ሁኔታ ውስጥ በመሆን እጅግ ውስብስብ የሆኑ ስሌቶችን በቅጽበት ይፈታል።',
    realWorldImpact: 'የመድሃኒት ግኝትንና የሳይበር ደህንነት ምስጠራን በአስር ሺህ እጥፍ ያፋጥናል።'
  },

  // 3. Human Health, Medicine & Longevity
  {
    id: 't-hlth-1',
    category: 'የሰው ልጅ ጤናና ረጅም እድሜ',
    categoryIcon: '🩺',
    difficulty: 'ጀማሪ (Foundational)',
    questionAm: 'የሰው ልጅ አንጎል በትክክል እንዲሰራና መርዛማ ቆሻሻዎችን (Metabolic waste) እንዲያጸዳ እጅግ ወሳኝ የሆነው የተፈጥሮ ሂደት የቱ ነው?',
    optionsAm: ['ያልተቋረጠ ጥልቅ እንቅልፍ (Deep Sleep)', 'ቀኑን ሙሉ ስክሪን ማየት', 'ከፍተኛ ቡና ብቻ መጠጣት', 'የምሽት እንቅስቃሴ ማብዛት'],
    correctIndex: 0,
    rewardETB: 50,
    explanationAm: 'በጥልቅ እንቅልፍ ወቅት የአንጎል ግሊምፋቲክ ስርአት (Glymphatic system) በቀን የተከማቹ መርዛማ ንጥረ ነገሮችን በማጠብ የማስታወስና የአስተሳሰብ ጤናን ይጠብቃል።',
    realWorldImpact: 'የአእምሮ እርጅናን (Alzheimer\'s) እና የጭንቀት በሽታዎችን በከፍተኛ ሁኔታ ይከላከላል።'
  },
  {
    id: 't-hlth-2',
    category: 'የሰው ልጅ ጤናና ረጅም እድሜ',
    categoryIcon: '🩺',
    difficulty: 'መካከለኛ (Advanced)',
    questionAm: 'የሰው ልጅ የልብና የደም ቧንቧ ጤናን ለመጠበቅ እንዲሁም እብጠትን (Inflammation) ለመቀነስ የሚረዱት ጠቃሚ ያልተሟሉ ቅባቶች (Omega-3) በብዛት የት ይገኛሉ?',
    optionsAm: ['በጥልቅ ባህር አሳዎች፣ በለውዝና በተልባ ፍሬ', 'በተጣራ ነጭ ስኳር', 'በፋብሪካ በበሰለ የዘንባባ ዘይት', 'በካርቦኔት ለስላሳ መጠጦች'],
    correctIndex: 0,
    rewardETB: 60,
    explanationAm: 'ኦሜጋ-3 ፋቲ አሲዶች የደም ቧንቧ ጥንካሬን በማለስለስና የደም ግፊትን በማስተካከል የልብ ድካም አደጋን በከፍተኛ ደረጃ ይቀንሳሉ።',
    realWorldImpact: 'ለረጅም እድሜ፣ ለአይን እይታ እና ለህዋሳት እድሳት ዋነኛ ንጥረ-ነገር ነው።'
  },
  {
    id: 't-hlth-3',
    category: 'የሰው ልጅ ጤናና ረጅም እድሜ',
    categoryIcon: '🩺',
    difficulty: 'የሊቃውንት ደረጃ (Mastery)',
    questionAm: 'የሰውነት ህዋሳት የተበላሹ ክፍሎቻቸውን በራሳቸው በማጽዳት ለአዳዲስ ህዋሳት ግንባታ እንዲውሉ የሚያደርገውና በኖቤል ሽልማት የተረጋገጠው የተፈጥሮ ሂደት ምን ይባላል?',
    optionsAm: ['ኦቶፋጂ (Autophagy)', 'ኦስሞሲስ (Osmosis)', 'ግሎኮሊሲስ (Glycolysis)', 'አናቦሊዝም (Anabolism)'],
    correctIndex: 0,
    rewardETB: 90,
    explanationAm: 'ኦቶፋጂ (በተወሰነ የጾም/Intermittent Fasting ወቅት የሚነቃቃ) ህዋሳት ያረጁ ክፍሎቻቸውን መልሰው ጥቅም ላይ በማዋል ካንሰርንና እርጅናን የሚዋጉበት ስርአት ነው።',
    realWorldImpact: 'የተፈጥሮ ረጅም እድሜንና ጤናማ እርጅናን በሳይንስ ያረጋገጠ ጥበብ ነው።'
  },

  // 4. Global Economics, Wealth & Trade
  {
    id: 't-econ-1',
    category: 'አለም አቀፍ ኢኮኖሚና ብልጽግና',
    categoryIcon: '🌍',
    difficulty: 'ጀማሪ (Foundational)',
    questionAm: 'በኢኮኖሚክስ ውስጥ "የዋጋ ግሽበት" (Inflation) ሲባል ትክክለኛው ትርጉም ምንድን ነው?',
    optionsAm: [
      'የሸቀጦችና አገልግሎቶች ዋጋ በጊዜ ሂደት እያደገ መጥቶ የገንዘብ የመግዛት አቅም ማነስ',
      'የባንኮች ቁጥር መቀነስ',
      'የዝናብ መጠን ማነስ',
      'የመንገዶች መዘጋት'
    ],
    correctIndex: 0,
    rewardETB: 50,
    explanationAm: 'የዋጋ ግሽበት የገንዘብ የመግዛት አቅም ሲቀንስ አንድን እቃ ለመግዛት ተጨማሪ ገንዘብ ማውጣት የሚያስገድድ የኢኮኖሚ ክስተት ነው።',
    realWorldImpact: 'የቁጠባ ገንዘብን ዋጋ እንዳያጣ በንብረትና በአምራች ኢንቨስትመንት ላይ የማዋልን አስፈላጊነት ያስተምራል።'
  },
  {
    id: 't-econ-2',
    category: 'አለም አቀፍ ኢኮኖሚና ብልጽግና',
    categoryIcon: '🌍',
    difficulty: 'የሊቃውንት ደረጃ (Mastery)',
    questionAm: 'አልበርት አንስታይን "የአለማችን 8ኛው ድንቅ" በማለት የጠራውና ሀብት በጊዜ ሂደት በከፍተኛ ፍጥነት እንዲያድግ የሚያደርገው የፋይናንስ ህግ የትኛው ነው?',
    optionsAm: ['የወለድ ወለድ እድገት (Compound Interest)', 'ቀጥተኛ ብድር', 'የወርቅ ማዕድን ፍለጋ', 'የካሽ ግብይት'],
    correctIndex: 0,
    rewardETB: 100,
    explanationAm: 'ኮምፓውንድ ኢንተረስት በዋናው ገንዘብ ላይ የተገኘው ትርፍ በድጋሚ ኢንቨስት እየተደረገ በጊዜ ሂደት የገንዘብ መጠኑን በከፍተኛ ደረጃ የሚያባዛ የሂሳብ ህግ ነው።',
    realWorldImpact: 'የረጅም ጊዜ ስርአት ያለው ቁጠባና እቁብ ማንኛውንም ድሀ ወደ ባለጸጋነት የመቀየር አቅም እንዳለው ያሳያል።'
  },

  // 5. Geography, Ecology & World Wonders
  {
    id: 't-geog-1',
    category: 'ጂኦግራፊና የተፈጥሮ አስደናቂ ቅርሶች',
    categoryIcon: '🌿',
    difficulty: 'ጀማሪ (Foundational)',
    questionAm: 'በአለም ላይ በርዝመቱ አንደኛ የሆነውና ከጣና ሀይቅ መነሻውን ይዞ እስከ ሜዲትራኒያን ባህር ድረስ የሚጓዘው ታላቁ ወንዝ የቱ ነው?',
    optionsAm: ['አባይ (የናይል ወንዝ)', 'አማዞን', 'ሚሲሲፒ', 'ያንትዜ'],
    correctIndex: 0,
    rewardETB: 50,
    explanationAm: 'የአባይ (ናይል) ወንዝ ከ6,650 ኪሎሜትር በላይ የሚጓዝ የአለማችን ረጅሙ ወንዝ ሲሆን 85% የሚሆነው የውሃ መጠን የሚመነጨው ከኢትዮጵያ ተራሮች ነው።',
    realWorldImpact: 'የምስራቅ አፍሪካንና የሰሜን አፍሪካን የግብርና፣ የሀይልና የስልጣኔ ህልውና የተሸከመ የውሃ ሀብት ነው።'
  },
  {
    id: 't-geog-2',
    category: 'ጂኦግራፊና የተፈጥሮ አስደናቂ ቅርሶች',
    categoryIcon: '🌿',
    difficulty: 'መካከለኛ (Advanced)',
    questionAm: 'የአለማችን ውቅያኖስ ጥልቅ ስፍራ ተብሎ የሚታወቀውና ከ11,000 ሜትር በላይ ወደ ውስጥ የሚዘልቀው ገደል የቱ ነው?',
    optionsAm: ['የማሪያና ትሬንች (Mariana Trench)', 'የቀይ ባህር ስምጥ ሸለቆ', 'የካስፒያን ባህር ወለል', 'የቤርሙዳ ጥልቀት'],
    correctIndex: 0,
    rewardETB: 65,
    explanationAm: 'የማሪያና ትሬንች በፓሲፊክ ውቅያኖስ ውስጥ የሚገኝ እጅግ ጥልቅ ስፍራ ሲሆን የኤቨረስት ተራራ እንኳን ቢገባበት ከ2 ኪሎሜትር በላይ በውሃ ይሸፈናል።',
    realWorldImpact: 'የፕላኔታችንን የውስጥ ጂኦሎጂና ያልተመረመሩ የባህር ውስጥ ህይወቶችን ምስጢር ይዟል።'
  },

  // 6. International Law & Global Peace
  {
    id: 't-law-1',
    category: 'አለም አቀፍ ህግና ሰላም',
    categoryIcon: '⚖️',
    difficulty: 'መካከለኛ (Advanced)',
    questionAm: 'በ1948 እ.ኤ.አ የተባበሩት መንግስታት ድርጅት ያፀደቀውና "ሁሉም የሰው ልጆች ነፃ ሆነው በእኩል ክብርና መብት ይወለዳሉ" የሚለው ታሪካዊ ሰነድ ምን ይባላል?',
    optionsAm: [
      'አለም አቀፍ የሰብአዊ መብቶች ድንጋጌ (UDHR)',
      'የቬርሳይ ስምምነት',
      'የሮም ውል',
      'የኪዮቶ ስምምነት'
    ],
    correctIndex: 0,
    rewardETB: 70,
    explanationAm: 'የአለም አቀፍ የሰብአዊ መብቶች ድንጋጌ የሰው ልጆች በዘር፣ በቋንቋ፣ በፆታና በእምነት ሳይለያዩ እኩል ክብርና ነፃነት ያላቸው መሆኑን በህግ ያፀና ሰነድ ነው።',
    realWorldImpact: 'የOneworld መድረክ የሰላም፣ የፍትህና የእኩልነት መሰረት የሆነ የህግ ዋስትና ነው።'
  },

  // 7. Great Inventions & Visionary Figures
  {
    id: 't-inv-1',
    category: 'ታላላቅ የፈጠራ ውጤቶች',
    categoryIcon: '💡',
    difficulty: 'መካከለኛ (Advanced)',
    questionAm: 'በ1928 እ.ኤ.አ በአሌክሳንደር ፍሌሚንግ በድንገት የተገኘውና በሚሊዮኖች የሚቆጠሩ ሰዎችን ህይወት ከኢንፌክሽን የታደገው የመጀመሪያው አንቲባዮቲክ መድሃኒት የቱ ነው?',
    optionsAm: ['ፔኒሲሊን (Penicillin)', 'አስፕሪን (Aspirin)', 'ፓራሲታሞል (Paracetamol)', 'ኢንሱሊን (Insulin)'],
    correctIndex: 0,
    rewardETB: 60,
    explanationAm: 'ፔኒሲሊን የባክቴሪያ ህዋሳትን ግድግዳ በማፍረስ የህክምና ሳይንስንና የቀዶ ጥገና ደህንነትን ለዘላለም የለወጠ ታላቅ ግኝት ነው።',
    realWorldImpact: 'የሰው ልጆችን አማካይ የእድሜ ጣሪያ በእጥፍ እንዲጨምር ካደረጉ ቁልፍ ግኝቶች ቀዳሚው ነው።'
  }
];

interface GlobalUniversalTriviaProps {
  onEarnPrize: (amount: number, gameTitle: string) => void;
  userLang?: AppLanguage;
}

export const GlobalUniversalTrivia: React.FC<GlobalUniversalTriviaProps> = ({
  onEarnPrize,
  userLang = 'am'
}) => {
  const [questions, setQuestions] = useState<TriviaItem[]>(EXTENSIVE_GLOBAL_TRIVIA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [totalWonETB, setTotalWonETB] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtered pool
  const filteredQuestions = activeCategoryFilter === 'all'
    ? questions
    : questions.filter(q => q.category === activeCategoryFilter);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const categories = [
    'all',
    'የአለም ታሪክና ስልጣኔ',
    'ሳይንስ፣ AI እና ቴክኖሎጂ',
    'የሰው ልጅ ጤናና ረጅም እድሜ',
    'አለም አቀፍ ኢኮኖሚና ብልጽግና',
    'ጂኦግራፊና የተፈጥሮ አስደናቂ ቅርሶች',
    'አለም አቀፍ ህግና ሰላም',
    'ታላላቅ የፈጠራ ውጤቶች'
  ];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      const nextStreak = streakCount + 1;
      setStreakCount(nextStreak);
      const bonusMultiplier = nextStreak >= 3 ? 1.5 : 1.0;
      const finalReward = Math.round(currentQ.rewardETB * bonusMultiplier);
      setTotalWonETB(prev => prev + finalReward);
      onEarnPrize(finalReward, `የእውቀት አድማስ ድል (${currentQ.category})`);
    } else {
      setStreakCount(0);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  // Generate boundless infinite new questions
  const handleGenerateInfiniteQuestion = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const dynamicThemes = [
        {
          cat: 'ሳይንስ፣ AI እና ቴክኖሎጂ',
          icon: '🚀',
          q: 'የሰው ሰራሽ አስተውሎት (Artificial General Intelligence - AGI) የመጨረሻ ግብ ምንድን ነው?',
          opts: ['የሰው ልጅ ሊሰራው የሚችለውን ማንኛውንም የአእምሮ ስራ በእኩል ወይም በላቀ ደረጃ መስራት መቻል', 'የሞባይል ቀፎዎችን መገጣጠም', 'የቤት ቀለም መቀባት', 'መኪና ማጠብ ብቻ'],
          cIdx: 0,
          exp: 'AGI የሰው ልጅ የአስተሳሰብ፣ የፈጠራና የስሌት አቅም ደረጃ የደረሰ የላቀ ሰው ሰራሽ አስተውሎት ደረጃ ነው።'
        },
        {
          cat: 'የአለም ታሪክና ስልጣኔ',
          icon: '🏛️',
          q: 'የጥንታዊው የሐር መንገድ (Silk Road) አለምን እንዴት ለወጣት?',
          opts: ['በእስያ፣ በአውሮፓና በአፍሪካ መካከል የንግድ፣ የሳይንስ፣ የሃርና የባህል ልውውጥን በማገናኘቱ', 'ጦርነትን ብቻ በማስፋፋቱ', 'የወርቅ ዋጋን በመቀነሱ', 'በባህር ላይ ብቻ በመንቀሳቀሱ'],
          cIdx: 0,
          exp: 'የሐር መንገድ በአለም ህዝቦች መካከል የቴክኖሎጂ፣ የመድሃኒትና የባህል ልውውጥን በማስፋፋት የዘመናዊ ግሎባላይዜሽን ፈር ቀዳጅ ነው።'
        },
        {
          cat: 'የሰው ልጅ ጤናና ረጅም እድሜ',
          icon: '🩺',
          q: 'በሰውነታችን ውስጥ የቫይታሚን ዲ (Vitamin D) ዋነኛ ተፈጥሯዊ ምንጭ የትኛው ነው?',
          opts: ['የጠዋት የፀሐይ ብርሃን በቆዳችን ላይ ሲያርፍ በሰውነት የሚመረት', 'ነጭ ስኳር በብዛት መመገብ', 'ጨለማ ክፍል ውስጥ ብቻ መቆየት', 'ውሃ በበረዶ መጠጣት'],
          cIdx: 0,
          exp: 'የፀሐይ አልትራቫዮሌት ጨረሮች በቆዳችን ውስጥ ያለውን ኮሌስትሮል ወደ ቫይታሚን ዲ በመቀየር የአጥንት ጥንካሬንና የበሽታ መከላከያ ህዋሳትን ያነቃቃሉ።'
        }
      ];

      const picked = dynamicThemes[Math.floor(Math.random() * dynamicThemes.length)];
      const newQuestion: TriviaItem = {
        id: `dyn-q-${Date.now()}`,
        category: picked.cat,
        categoryIcon: picked.icon,
        difficulty: 'የሊቃውንት ደረጃ (Mastery)',
        questionAm: picked.q,
        optionsAm: picked.opts,
        correctIndex: picked.cIdx,
        rewardETB: 80,
        explanationAm: picked.exp,
        realWorldImpact: 'ለህይወትዎ ዘላቂ እውቀትና የተግባር ግንዛቤ ይሰጣል።'
      };

      setQuestions(prev => [newQuestion, ...prev]);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsGenerating(false);
    }, 800);
  };

  const handleReadQuestion = () => {
    const textToRead = `${currentQ.questionAm}. አማራጮች፡ አንድ፡ ${currentQ.optionsAm[0]}፤ ሁለት፡ ${currentQ.optionsAm[1]}፤ ሶስት፡ ${currentQ.optionsAm[2]}፤ አራት፡ ${currentQ.optionsAm[3]}`;
    speakText(textToRead, 'am');
  };

  return (
    <div className="bg-[#101626] border border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentQ.categoryIcon}</span>
            <h3 className="text-base md:text-lg font-black text-white">
              የአለም አቀፍ እውቀትና የጥበብ አድማስ (Global Boundless Wisdom Q&A)
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ገደብ የለሽ
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            በአለማችን ሊታወቁ የሚገባቸው፣ ህይወትንና ስልጣኔን የሚያበለጽጉ ጥያቄዎችን በመመለስ እውቀትዎን ያሳድጉ፤ የገንዘብ ሽልማት ይሰብስቡ!
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {streakCount >= 2 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 animate-pulse">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{streakCount}x ኮምቦ ጉርሻ!</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>አጠቃላይ ገቢ፡ +{totalWonETB.toLocaleString()} ብር</span>
          </div>

          <button
            onClick={handleGenerateInfiniteQuestion}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer"
            title="ገደብ የለሽ አዲስ ጥያቄ አፍልቅ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'በማፍለቅ ላይ...' : 'አዲስ ጥያቄ አፍልቅ'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategoryFilter(cat);
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsAnswered(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeCategoryFilter === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat === 'all' ? '🌐 ሁሉንም ዘርፎች (All Domains)' : cat}
          </button>
        ))}
      </div>

      {/* Main Question Card */}
      <div className="p-6 md:p-8 bg-slate-950/70 border border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 font-mono">
              ጥያቄ {currentIndex + 1} ከ {filteredQuestions.length}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-semibold text-slate-400">
              {currentQ.category}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentQ.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReadQuestion}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-400 hover:text-white transition cursor-pointer"
              title="ጥያቄውን በድምፅ ያዳምጡ"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
              +{currentQ.rewardETB} ብር ሽልማት
            </span>
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-lg md:text-xl font-black text-white leading-relaxed">
          {currentQ.questionAm}
        </h3>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.optionsAm.map((opt, idx) => {
            let btnStyle = 'bg-slate-900/80 border-slate-800 hover:border-amber-500/60 text-slate-200';

            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
              } else if (selectedOption === idx) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
              } else {
                btnStyle = 'bg-slate-950 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border text-left font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-400 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswered && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                )}
                {isAnswered && selectedOption === idx && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Deep Dive */}
        {isAnswered && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                ስለምን እንደሆነ ማብራሪያ (Scientific & Historical Wisdom):
              </span>

              <button
                onClick={() => speakText(currentQ.explanationAm, 'am')}
                className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>ማብራሪያውን በድምፅ አዳምጥ</span>
              </button>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {currentQ.explanationAm}
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>ተግባራዊ ፋይዳው፡</strong> {currentQ.realWorldImpact}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-90 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
              >
                <span>ቀጣይ ጥያቄ (Next Question)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
