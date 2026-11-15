import {
  SupportedLanguage,
  Room,
  RoomOccupant,
  EqubPool,
  LotteryDraw,
  CharityProject,
  TalentContestant,
  TriviaQuestion,
  BankAccount,
  TransactionRecord,
  VirtualGift,
  LiveSpeechMessage
} from '../types';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'am', name: 'Amharic', localName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'en', name: 'English', localName: 'English', flag: '🇬🇧' },
  { code: 'om', name: 'Afaan Oromoo', localName: 'Afaan Oromoo', flag: '🇪🇹' },
  { code: 'ti', name: 'Tigrinya', localName: 'ትግርኛ', flag: '🇪🇹' },
  { code: 'ar', name: 'Arabic', localName: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'French', localName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', localName: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', localName: '中文', flag: '🇨🇳' }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-1',
    titleAm: 'ሁለንተናዊ መልካም አስተሳሰብና የአለም ሰላም ጉባኤ',
    titleEn: 'Universal Goodwill & Global Peace Agora',
    category: 'philosophy',
    categoryLabelAm: 'ሁለንተናዊ መልካም አስተሳሰብ',
    descriptionAm: 'የአለማችንን ህዝቦች በፍቅር፣ በጋራ መከባበርና በመልካም ስነምግባር የሚያስተሳስሩ እሴቶችን መገንባት።',
    descriptionEn: 'Fostering love, mutual respect, and ethical human values across all nations.',
    hostName: 'ዘበነ አስፍዬ (Zebene Asfye)',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 0,
    totalAudience: 0,
    isLive: true,
    topics: ['ሰብአዊነት', 'አለም አቀፍ ፍቅር', 'ዘላቂ ሰላም', 'የባህል መቀራረብ']
  },
  {
    id: 'room-2',
    titleAm: 'የቴክኖሎጂ እውቀት፣ ኤአይ እና የፈጠራ ስልጣኔ',
    titleEn: 'Technology Frontier, AI & Innovative Civilization',
    category: 'tech',
    categoryLabelAm: 'የቴክኖሎጂ እውቀት',
    descriptionAm: 'የሰው ሰራሽ አስተውሎት (AI)፣ የሳይንስ ምርምር እና ቴክኖሎጂን ለድህነት ቅነሳ ማዋል ላይ ያተኮረ።',
    descriptionEn: 'Deep dive into artificial intelligence, scientific discovery, and deploying tech for human prosperity.',
    hostName: 'Oneworld Tech Hall',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 0,
    totalAudience: 0,
    isLive: true,
    topics: ['AI & Robotics', 'ዲጂታል ኢኮኖሚ', 'ክፍት ሳይንስ', 'ቴክኖሎጂ ለልማት']
  },
  {
    id: 'room-3',
    titleAm: 'ፓለቲካዊ እና ኢኮኖሚያዊ እሳቤ፣ ፍትሃዊ የሀብት ክፍፍል',
    titleEn: 'Political & Economic Thought & Global Equity',
    category: 'politics',
    categoryLabelAm: 'ፓለቲካዊ እና ኢኮኖሚያዊ እሳቤ',
    descriptionAm: 'አለም አቀፍ የንግድ ስርአት፣ ፍትሃዊ የኢኮኖሚ እድገት እና የሀገረ መንግስታት ሉዓላዊ አጋርነት።',
    descriptionEn: 'Reimagining global economics, fair trade, African integration, and sovereign cooperation.',
    hostName: 'Oneworld Policy Hall',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 0,
    totalAudience: 0,
    isLive: true,
    topics: ['የአፍሪካ አንድነት ኢኮኖሚ', 'የፋይናንስ ሉዓላዊነት', 'ዲጂታል ገንዘብ', 'ፍትሃዊ ንግድ']
  },
  {
    id: 'room-4',
    titleAm: 'የአለማችን የበጎ አድራጎትና የሰብአዊ ድጋፍ መረብ',
    titleEn: 'Global Humanitarian Solidarity & Charity Action',
    category: 'charity',
    categoryLabelAm: 'በጎ አድራጎት ስራ',
    descriptionAm: 'ለድሀድሀ ማህበረሰብ፣ ወላጅ አልባ ህፃናት እና ጧሪ ላጡ አዛውንቶች አስቸኳይ የመፍትሄ ተግባር።',
    descriptionEn: 'Direct mutual aid and philanthropic capital deployment for orphans, elderly, and rural villages.',
    hostName: 'Oneworld Charity Hall',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 0,
    totalAudience: 0,
    isLive: true,
    topics: ['ወላጅ አልባ ህፃናት', 'ንፁህ ውሃ ለገጠር', 'የአዛውንቶች እንክብካቤ', 'የአደጋ ጊዜ ድጋፍ']
  },
  {
    id: 'room-5',
    titleAm: 'የስልጣኔ፣ የጥንታዊ ቅርሶችና የባህል ትስስር አውድ',
    titleEn: 'Civilizations, Ancient Heritage & Cultural Dialogue',
    category: 'culture',
    categoryLabelAm: 'በስልጣኔ አውድ',
    descriptionAm: 'የአለም ጥንታዊ ስልጣኔዎች፣ የኢትዮጵያ ታሪክ፣ የኪነ-ጥበብ እውቀትና የሰው ልጆች የጋራ ቅርሶች።',
    descriptionEn: 'Celebrating ancient human history, Ethiopian civilizations, and cross-cultural synthesis.',
    hostName: 'Oneworld Heritage Hall',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 0,
    totalAudience: 0,
    isLive: true,
    topics: ['ታሪክና ቅርስ', 'ስነ-ጥበብ', 'ስነ-ጽሁፍ', 'ባህላዊ እውቀት']
  },
  {
    id: 'room-6',
    titleAm: 'የአባላት የግል ስልጠናና የማወያያ ቤት',
    titleEn: 'Member Community Masterclass & Discussion Sub-Hall',
    category: 'community',
    categoryLabelAm: 'የአባላት የጋራ ቤት',
    descriptionAm: 'በአባላት ሀላፊነት ስር የሚመዘገቡ ተሳታፊዎችን የማወያየት፣ የማሰልጠን እና እውቀት የማጋራት ማዕከል።',
    descriptionEn: 'Member-led localized seminar, team coaching, and real-time cross-border dialogue.',
    hostName: 'ዘበነ አስፍዬ (Zebene Asfye)',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 0,
    totalAudience: 0,
    isMemberOwned: true,
    isLive: true,
    topics: ['የክህሎት ስልጠና', 'የግል አዳራሽ ውይይት', 'የቡድን ምክክር', 'የጋራ ስራ']
  }
];

// Genuine live occupants are populated dynamically from authenticated WebRTC peers
export const INITIAL_OCCUPANTS: RoomOccupant[] = [];

// Genuine live speech/chat messages are loaded from backend room history and live WebSocket broadcasts
export const INITIAL_SPEECH_MESSAGES: LiveSpeechMessage[] = [];

export const INITIAL_EQUB_POOLS: EqubPool[] = [
  {
    id: 'equb-daily-1',
    titleAm: 'የአለም አቀፍ የዲጂታል እቁብ - ዕለታዊ ዙር',
    titleEn: 'Global Digital Equb - Daily Velocity Pool',
    cycleType: 'ዕለታዊ (Daily)',
    amountPerMember: 1000,
    currency: 'ETB',
    maxMembers: 20,
    currentRound: 1,
    totalRounds: 20,
    nextDrawDate: 'ዛሬ 12:00 ሰዓት (Today 6:00 PM)',
    reserveBank10Percent: 0,
    reserveBuilder5Percent: 0,
    netWinnerPayout85Percent: 0,
    members: [],
    pastWinners: []
  },
  {
    id: 'equb-weekly-1',
    titleAm: 'የአለም አቀፍ ትብብር ሳምንታዊ የልማት እቁብ',
    titleEn: 'International Weekly Solidarity & Enterprise Equb',
    cycleType: 'ሳምንታዊ (Weekly)',
    amountPerMember: 10000,
    currency: 'ETB',
    maxMembers: 12,
    currentRound: 1,
    totalRounds: 12,
    nextDrawDate: 'የፊታችን እሁድ (Next Sunday)',
    reserveBank10Percent: 0,
    reserveBuilder5Percent: 0,
    netWinnerPayout85Percent: 0,
    members: [],
    pastWinners: []
  }
];

export const INITIAL_LOTTERY: LotteryDraw = {
  id: 'lottery-global-1',
  titleAm: 'የአለም አንድ ታላቅ የበጎ አድራጎት ሎተሪ (AlemAnd Grand Fortune)',
  ticketPrice: 50,
  currency: 'ETB',
  jackpotAmount: 500000,
  participantsCount: 0,
  drawDate: 'በየቀኑ ማታ 3:00 ሰዓት (Daily 9:00 PM)',
  userTickets: [],
  recentWinners: []
};

export const INITIAL_CHARITY_PROJECTS: CharityProject[] = [
  {
    id: 'charity-1',
    titleAm: 'የአለማችን እጅግ አቅመ-ደካሞችና የድሀድሀ ማህበረሰብ ድጋፍ',
    titleEn: 'Extreme Poverty & Needy Families Direct Support',
    category: 'extreme_poverty',
    categoryLabelAm: 'የድሀድሀ ማህበረሰብ ድጋፍ',
    descriptionAm: 'ለዕለታዊ ምግባቸውና ለመጠለያ ለተቸገሩ ቤተሰቦች የህይወት አድን ድጋፍ እና ዘላቂ የገቢ ማስገኛ ጥቃቅን ኢንተርፕራይዞችን ማቋቋም።',
    targetAmount: 500000,
    raisedAmount: 0,
    currency: 'ETB',
    donorCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    beneficiariesCount: 1250,
    impactMetrics: 'የምግብና የኑሮ ድጋፍ ፕሮጀክት',
    donations: []
  },
  {
    id: 'charity-2',
    titleAm: 'ወላጅ አልባ ህፃናት ማሳደጊያ፣ የትምህርትና የጤና እንክብካቤ',
    titleEn: 'Orphan Shelter, Comprehensive Healthcare & Education',
    category: 'orphans',
    categoryLabelAm: 'ወላጅ አልባ ህፃናት',
    descriptionAm: 'ወላጅ አልባ ህፃናት በአስተማማኝ መጠለያ፣ በንፁህ አልሚ ምግብ፣ በትምህርት መሳሪያዎችና በቴክኖሎጂ እውቀት እንዲታነፁ የሚደረግ ፕሮጀክት።',
    targetAmount: 750000,
    raisedAmount: 0,
    currency: 'ETB',
    donorCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80',
    beneficiariesCount: 480,
    impactMetrics: 'የትምህርትና የመኖሪያ ዋስትና ፕሮጀክት',
    donations: []
  },
  {
    id: 'charity-3',
    titleAm: 'ጧሪ የሌላቸው አዛውንቶች ክብካቤና ማህበራዊ ዋስትና',
    titleEn: 'Elderly Compassion Sanctuary & Dignified Care',
    category: 'elderly',
    categoryLabelAm: 'ጧሪ የሌላቸው አዛውንቶች',
    descriptionAm: 'እድሜያቸው የገፉና ተንከባካቢ ያጡ አዛውንቶችን በክብር መጦሪያ፣ የህክምና ቁሳቁስና አልባሳት የማሟላት ቅዱስ ተግባር።',
    targetAmount: 400000,
    raisedAmount: 0,
    currency: 'ETB',
    donorCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    beneficiariesCount: 310,
    impactMetrics: 'የመጠለያና ነፃ ህክምና ፕሮጀክት',
    donations: []
  },
  {
    id: 'charity-4',
    titleAm: 'መሰረተ ልማት ለገጠር ማህበረሰብ - ንፁህ መጠጥ ውሃና የፀሐይ ብርሃን',
    titleEn: 'Rural Village Clean Water Wells & Solar Electrification',
    category: 'rural_infrastructure',
    categoryLabelAm: 'የገጠር መሰረተ ልማት',
    descriptionAm: 'ውሃና መብራት ላልደረሰባቸው የገጠር መንደሮች የጥልቅ ጉድጓድ ውሃ ማውጣትና የሶላር ማይክሮ-ግሪድ መብራት መትከል።',
    targetAmount: 1200000,
    raisedAmount: 0,
    currency: 'ETB',
    donorCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=600&q=80',
    beneficiariesCount: 8400,
    impactMetrics: 'የንፁህ ውሃና የፀሐይ ብርሃን ፕሮጀክት',
    donations: []
  }
];

export const INITIAL_TALENT_CONTESTANTS: TalentContestant[] = [];

export const INITIAL_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 'triv-1',
    category: 'የአለም ታሪክና ስልጣኔ',
    questionAm: 'የሰው ልጅ ጥንታዊ መነሻ ተብላ በዩኔስኮና በአለም ሳይንቲስቶች የምትታወቀውና ሉሲ (ድንቅነሽ) የተገኘችበት ሀገር የትኛዋ ናት?',
    questionEn: 'Which country is globally recognized as the cradle of humankind where "Lucy" (Dinknesh) was discovered?',
    optionsAm: ['ግብፅ', 'ኢትዮጵያ', 'ግሪክ', 'ህንድ'],
    optionsEn: ['Egypt', 'Ethiopia', 'Greece', 'India'],
    correctIndex: 1,
    rewardETB: 50,
    explanationAm: 'ሉሲ (ድንቅነሽ) በኢትዮጵያ አፋር ክልል ሃዳር ውስጥ በ1974 እ.ኤ.አ የተገኘች ጥንታዊ የሰው ዘር ቅሪተ-አካል ናት።'
  },
  {
    id: 'triv-2',
    category: 'የቴክኖሎጂ እውቀት',
    questionAm: 'የአርቴፊሻል ኢንተሊጀንስ (AI) የትራንስፎርመር ሞዴል (Transformer Architecture) መሰረታዊ ጥቅም ምንድን ነው?',
    questionEn: 'What is the primary breakthrough of the Transformer architecture in modern AI?',
    optionsAm: [
      'የባትሪ እድሜን ብቻ መጨመር',
      'ቃላትንና መረጃዎችን በሙሉ ትኩረት (Attention Mechanism) በከፍተኛ ፍጥነት ማስተሳሰር',
      'የኮምፒውተር ገመዶችን ማሳነስ',
      'የድምፅ ድምፅን ማጥፋት'
    ],
    optionsEn: [
      'Increasing battery life only',
      'Connecting context across tokens via Self-Attention mechanisms',
      'Reducing computer wiring',
      'Muting ambient audio'
    ],
    correctIndex: 1,
    rewardETB: 75,
    explanationAm: 'ትራንስፎርመር ሞዴሎች ሰፊ ፅሁፎችንና መረጃዎችን በሙሉ አውድ በማገናኘት ፈጣንና ትክክለኛ የትርጉም እና የማሰብ አቅም ይሰጣሉ።'
  },
  {
    id: 'triv-3',
    category: 'ኢኮኖሚና ፋይናንስ',
    questionAm: 'የኢትዮጵያ ባህላዊ የቁጠባና የፋይናንስ መረዳጃ "እቁብ" (Equb) በአለም አቀፍ የኢኮኖሚክስ ስነ-ቃል ምን ተብሎ ይጠራል?',
    questionEn: 'What is the international economics terminology for the traditional Ethiopian "Equb" rotating savings system?',
    optionsAm: [
      'ROSCA (Rotating Savings and Credit Association)',
      'Hedge Fund Derivatives',
      'Venture Capital Equity',
      'Cryptocurrency Staking'
    ],
    optionsEn: [
      'ROSCA (Rotating Savings and Credit Association)',
      'Hedge Fund Derivatives',
      'Venture Capital Equity',
      'Cryptocurrency Staking'
    ],
    correctIndex: 0,
    rewardETB: 100,
    explanationAm: 'እቁብ በአለም አቀፍ ደረጃ በስፋት የሚታወቅና የተከበረ ROSCA (Rotating Savings and Credit Association) ማህበራዊ የቁጠባ ስርአት ነው።'
  }
];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [];

export const VIRTUAL_GIFTS: VirtualGift[] = [
  { id: 'gift-1', nameAm: 'የሰላም አበባ', nameEn: 'Peace Flower', icon: '🌸', priceETB: 20, rarity: 'common' },
  { id: 'gift-2', nameAm: 'የወርቅ ዋንጫ', nameEn: 'Golden Trophy', icon: '🏆', priceETB: 100, rarity: 'rare' },
  { id: 'gift-3', nameAm: 'ባህላዊ ከበሮ', nameEn: 'Ethiopian Drum (Kebero)', icon: '🥁', priceETB: 50, rarity: 'common' },
  { id: 'gift-4', nameAm: 'የሰላም እርግብ', nameEn: 'Dove of Harmony', icon: '🕊️', priceETB: 75, rarity: 'rare' },
  { id: 'gift-5', nameAm: 'የስልጣኔ አክሊል', nameEn: 'Crown of Wisdom', icon: '👑', priceETB: 500, rarity: 'legendary' }
];

export const LEGAL_TREATIES = [
  {
    titleAm: 'የተባበሩት መንግስታት ሁለንተናዊ የሰብአዊ መብቶች ድንጋጌ (UDHR)',
    titleEn: 'Universal Declaration of Human Rights (UN 1948)',
    status: 'የተረጋገጠ (Active Ratification)',
    scope: 'የአለም ህዝቦች እኩልነት፣ የመናገርና የመሰብሰብ ነፃነት ዋስትና'
  },
  {
    titleAm: 'የአፍሪካ ህብረት የሳይበር ደህንነትና የግል መረጃ ጥበቃ ስምምነት',
    titleEn: 'African Union Malabo Convention on Cybersecurity & Data Privacy',
    status: 'የተረጋገጠ (Active Ratification)',
    scope: 'የድንበር ተሻጋሪ መረጃዎች ጥበቃና የዜጎች ሚስጥራዊነት ዋስትና'
  },
  {
    titleAm: 'የኢትዮጵያ ብሄራዊ ባንክ የዲጂታል ክፍያ መመሪያ (NBE Directives ONPS/02/2020)',
    titleEn: 'National Bank of Ethiopia Payment System Directive',
    status: 'ህጋዊ ፈቃድ የተሰጠው (Compliant)',
    scope: 'የ10% መጠባበቂያ ሂሳብና የባንክ ትስስር ህጋዊ ጥበቃ'
  },
  {
    titleAm: 'የአለም አቀፍ የቴሌኮሙዩኒኬሽን ህብረት (ITU) የዲጂታል እኩልነት መመሪያ',
    titleEn: 'ITU Digital Accessibility & Cross-Language Rights Protocol',
    status: 'የተረጋገጠ (Active Ratification)',
    scope: 'ማንኛውም ሰው በራሱ ቋንቋ መረጃ የማግኘት አለም አቀፍ መብት'
  }
];
