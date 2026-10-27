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
    hostName: 'ዶ/ር ዘበነ አስፋው (Dr. Zebene)',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 8,
    totalAudience: 1420,
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
    hostName: 'ኢንጂነር አብርሃም ገብረ (Eng. Abraham)',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 12,
    totalAudience: 2890,
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
    hostName: 'ሳራ ኑር (Sarah Nur)',
    hostAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 6,
    totalAudience: 980,
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
    hostName: 'ዮናስ ታደሰ (Yonas Tadesse)',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 5,
    totalAudience: 1650,
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
    hostName: 'ፕሮፌሰር አለማየሁ (Prof. Alemayehu)',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 9,
    totalAudience: 870,
    isLive: true,
    topics: ['ታሪክና ቅርስ', 'ስነ-ጥበብ', 'ስነ-ጽሁፍ', 'ባህላዊ እውቀት']
  },
  {
    id: 'room-6',
    titleAm: 'የአቶ ዘበነ የግል ስልጠናና የማወያያ ቤት',
    titleEn: "Host Zebene's Community Masterclass & Discussion Sub-Hall",
    category: 'community',
    categoryLabelAm: 'የአባላት የጋራ ቤት',
    descriptionAm: 'በአባላት ሀላፊነት ስር የሚመዘገቡ ተሳታፊዎችን የማወያየት፣ የማሰልጠን እና እውቀት የማጋራት ማዕከል።',
    descriptionEn: 'Member-led localized seminar, team coaching, and real-time cross-border dialogue.',
    hostName: 'ዘበነ አስፋው (Zebene Asfaw - Host)',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    activeSpeakers: 4,
    totalAudience: 420,
    isMemberOwned: true,
    isLive: true,
    topics: ['የክህሎት ስልጠና', 'የግል አዳራሽ ውይይት', 'የቡድን ምክክር', 'የጋራ ስራ']
  }
];

export const INITIAL_OCCUPANTS: RoomOccupant[] = [
  {
    id: 'user-self',
    name: 'እርስዎ (You - User)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    country: 'ኢትዮጵያ (Ethiopia)',
    countryFlag: '🇪🇹',
    preferredLang: 'am',
    isHost: false,
    isSpeaking: false,
    isMuted: true,
    isVideoOn: true,
    seatNumber: 1,
    royaltyPointsEarned: 240,
    titleBadge: 'የሰላም አምባሳደር'
  },
  {
    id: 'occ-2',
    name: 'ዶ/ር ዘበነ አስፋው (Host)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    country: 'ኢትዮጵያ',
    countryFlag: '🇪🇹',
    preferredLang: 'am',
    isHost: true,
    isSpeaking: true,
    isMuted: false,
    isVideoOn: true,
    isPodiumSpeaker: true,
    seatNumber: 2,
    royaltyPointsEarned: 1850,
    titleBadge: 'የአዳራሽ መሪ'
  },
  {
    id: 'occ-3',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    country: 'ሩሲያ / Switzerland',
    countryFlag: '🇨🇭',
    preferredLang: 'en',
    isSpeaking: false,
    isMuted: true,
    isVideoOn: true,
    seatNumber: 3,
    royaltyPointsEarned: 620,
    titleBadge: 'የእውቀት መሪ'
  },
  {
    id: 'occ-4',
    name: 'Tariq Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
    country: 'UAE / ኦማን',
    countryFlag: '🇦🇪',
    preferredLang: 'ar',
    isSpeaking: false,
    isMuted: true,
    isVideoOn: true,
    seatNumber: 4,
    royaltyPointsEarned: 890,
    titleBadge: 'የበጎ አድራጊ ጀግና'
  },
  {
    id: 'occ-5',
    name: 'Fatoumata Diallo',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=160&q=80',
    country: 'ሴኔጋል / ፈረንሳይ',
    countryFlag: '🇸🇳',
    preferredLang: 'fr',
    isSpeaking: false,
    isMuted: true,
    isVideoOn: false,
    seatNumber: 5,
    royaltyPointsEarned: 430
  },
  {
    id: 'occ-6',
    name: 'Wei Zhang (ዌይ ዣንግ)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    country: 'ቻይና (China)',
    countryFlag: '🇨🇳',
    preferredLang: 'zh',
    isSpeaking: false,
    isMuted: true,
    isVideoOn: true,
    seatNumber: 6,
    royaltyPointsEarned: 780
  },
  {
    id: 'occ-7',
    name: 'ሰለሞን ተሾመ (Solomon)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&q=80',
    country: 'ኢትዮጵያ (ድሬዳዋ)',
    countryFlag: '🇪🇹',
    preferredLang: 'om',
    isSpeaking: false,
    isMuted: true,
    isVideoOn: false,
    seatNumber: 7,
    royaltyPointsEarned: 310
  },
  {
    id: 'occ-8',
    name: 'Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&q=80',
    country: 'ሜክሲኮ / ስፔን',
    countryFlag: '🇲🇽',
    preferredLang: 'es',
    isSpeaking: false,
    isMuted: true,
    isVideoOn: true,
    seatNumber: 8,
    royaltyPointsEarned: 520
  }
];

export const INITIAL_SPEECH_MESSAGES: LiveSpeechMessage[] = [
  {
    id: 'msg-1',
    speakerName: 'ዶ/ር ዘበነ አስፋው (Host)',
    speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    sourceLang: 'am',
    originalText: 'የሰው ልጅ በአንድ ቤት ተሰባስቦ በቴክኖሎጂ፣ በፍቅርና በስልጣኔ እውቀት ሲለዋወጥ አለማችን ውብና የተረጋጋች ትሆናለች።',
    translations: {
      am: 'የሰው ልጅ በአንድ ቤት ተሰባስቦ በቴክኖሎጂ፣ በፍቅርና በስልጣኔ እውቀት ሲለዋወጥ አለማችን ውብና የተረጋጋች ትሆናለች።',
      en: 'When humanity gathers under one roof exchanging knowledge in tech, love, and civilization, our world becomes peaceful and beautiful.',
      om: 'Yeroo ilmi namaa mana tokko keessatti walitti qabamee beekumsa teeknooloojii fi jaalalaa waljijjiiru, addunyaan keenya ni bareeddi.',
      ti: 'ደቂ ሰባት ኣብ ሓደ ገዛ ተኣኪቦም ብቴክኖሎጂን ፍቕርን ፍልጠት እንተተለዋዊጦም፡ ዓለምና ጽብቕቲ ትኸውን።',
      ar: 'عندما تجتمع البشرية تحت سقف واحد لتبادل المعرفة والتكنولوجيا والمحبة، يصبح عالمنا جميلاً ومزدهراً.',
      fr: 'Quand l\'humanité se réunit sous un même toit pour échanger savoirs, technologie et fraternité, notre monde s\'épanouit.',
      es: 'Cuando la humanidad se reúne bajo un mismo techo intercambiando conocimiento, tecnología y amor, nuestro mundo prospera.',
      zh: '当全人类汇聚一堂，交流科技、爱心与文明知识时，我们的世界将变得和平而美好。',
      de: 'Wenn die Menschheit unter einem Dach zusammenkommt und Wissen über Technologie, Liebe und Zivilisation austauscht, wird unsere Welt friedlich und schön.'
    },
    timestamp: '10:42 AM',
    seatNumber: 2
  },
  {
    id: 'msg-2',
    speakerName: 'Elena Rostova',
    speakerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    sourceLang: 'en',
    originalText: 'Automated speech translation dissolves barriers instantly. I hear Dr. Zebene in English without delay!',
    translations: {
      am: 'ፈጣኑ አውቶማቲክ የድምፅ ተርጓሚ የቋንቋ እንቅፋቶችን በቅጽበት አስወግዷል። ዶ/ር ዘበነ የሚናገሩትን ወዲያው በእንግሊዝኛ እየሰማሁ ነው!',
      en: 'Automated speech translation dissolves barriers instantly. I hear Dr. Zebene in English without delay!',
      om: 'Hiikni sagalee ariifataan gufuuwwan afaanii dafee balleesseera. Waan Dr. Zabanen dubbatan battalumatti Ingiliffaan dhaga\'aan jira!',
      ti: 'እቲ ቅልጡፍ ናይ ድምጺ ተርጓሚ ናይ ቋንቋ ዕንቅፋታት ብኡንብኡ ኣወጊድዎ። ንዶ/ር ዘበነ ብእንግሊዝኛ ብቐጥታ ይሰምዖም ኣለኹ!',
      ar: 'الترجمة الصوتية الفورية أزالت حواجز اللغة في لحظة. أستمع إلى حديث الدكتور زبيني بالإنجليزية دون أي تأخير!',
      fr: 'La traduction vocale instantanée fait disparaître les barrières linguistiques en un éclair!',
      es: 'La traducción de voz instantánea elimina las barreras idiomáticas al instante.',
      zh: '即时语音翻译瞬间消除了语言障碍。我正在以英语无延迟地聆听演讲！',
      de: 'Die automatische Sprachübersetzung überwindet Barrieren sofort. Ich höre Dr. Zebene ohne Verzögerung auf Deutsch!'
    },
    timestamp: '10:44 AM',
    seatNumber: 3
  }
];

export const INITIAL_EQUB_POOLS: EqubPool[] = [
  {
    id: 'equb-daily-1',
    titleAm: 'የአለም አቀፍ የዲጂታል እቁብ - ዕለታዊ ዙር',
    titleEn: 'Global Digital Equb - Daily Velocity Pool',
    cycleType: 'ዕለታዊ (Daily)',
    amountPerMember: 1000,
    currency: 'ETB',
    maxMembers: 20,
    currentRound: 4,
    totalRounds: 20,
    nextDrawDate: 'ዛሬ 12:00 ሰዓት (Today 6:00 PM)',
    reserveBank10Percent: 2000,   // 10% of 20,000 ETB
    reserveBuilder5Percent: 1000, // 5% of 20,000 ETB
    netWinnerPayout85Percent: 17000, // 85% of 20,000 ETB
    members: [
      { id: 'm-1', name: 'አብርሃም ኪዳኔ', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120', country: 'ኢትዮጵያ', joinedAt: '2026-10-20', hasWon: true, wonCycleRound: 1 },
      { id: 'm-2', name: 'Bethelhem D.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', country: 'ኢትዮጵያ', joinedAt: '2026-10-21', hasWon: true, wonCycleRound: 2 },
      { id: 'm-3', name: 'Omar Al-Faruq', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120', country: 'ዱባይ', joinedAt: '2026-10-22', hasWon: true, wonCycleRound: 3 },
      { id: 'm-4', name: 'እርስዎ (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120', country: 'ኢትዮጵያ', joinedAt: '2026-10-23', hasWon: false },
      { id: 'm-5', name: 'Sara Mesfin', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120', country: 'አሜሪካ', joinedAt: '2026-10-24', hasWon: false },
      { id: 'm-6', name: 'Dawit Bekele', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120', country: 'ኢትዮጵያ', joinedAt: '2026-10-24', hasWon: false }
    ],
    pastWinners: [
      { round: 1, winnerName: 'አብርሃም ኪዳኔ', amount: 17000, date: '2026-10-21' },
      { round: 2, winnerName: 'Bethelhem D.', amount: 17000, date: '2026-10-22' },
      { round: 3, winnerName: 'Omar Al-Faruq', amount: 17000, date: '2026-10-23' }
    ]
  },
  {
    id: 'equb-weekly-1',
    titleAm: 'የአለም አቀፍ ትብብር ሳምንታዊ የልማት እቁብ',
    titleEn: 'International Weekly Solidarity & Enterprise Equb',
    cycleType: 'ሳምንታዊ (Weekly)',
    amountPerMember: 10000,
    currency: 'ETB',
    maxMembers: 12,
    currentRound: 2,
    totalRounds: 12,
    nextDrawDate: 'የፊታችን እሁድ (Next Sunday)',
    reserveBank10Percent: 12000,
    reserveBuilder5Percent: 6000,
    netWinnerPayout85Percent: 102000,
    members: [
      { id: 'mw-1', name: 'ኢንጂነር ካሌብ', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120', country: 'ኢትዮጵያ', joinedAt: '2026-10-15', hasWon: true, wonCycleRound: 1 },
      { id: 'mw-2', name: 'እርስዎ (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120', country: 'ኢትዮጵያ', joinedAt: '2026-10-16', hasWon: false },
      { id: 'mw-3', name: 'Marta Yohannes', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', country: 'ጀርመን', joinedAt: '2026-10-17', hasWon: false }
    ],
    pastWinners: [
      { round: 1, winnerName: 'ኢንጂነር ካሌብ', amount: 102000, date: '2026-10-19' }
    ]
  }
];

export const INITIAL_LOTTERY: LotteryDraw = {
  id: 'lottery-global-1',
  titleAm: 'የአለም አንድ ታላቅ የበጎ አድራጎት ሎተሪ (AlemAnd Grand Fortune)',
  ticketPrice: 50,
  currency: 'ETB',
  jackpotAmount: 500000,
  participantsCount: 4210,
  drawDate: 'በየቀኑ ማታ 3:00 ሰዓት (Daily 9:00 PM)',
  userTickets: ['ALEM-882941', 'ALEM-739201'],
  recentWinners: [
    { ticket: 'ALEM-551982', winnerName: 'ሃና አስራት (Hanna)', prize: 50000, time: 'ትላንት' },
    { ticket: 'ALEM-992144', winnerName: 'Lucas Dubois', prize: 15000, time: 'ከ2 ቀን በፊት' }
  ]
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
    raisedAmount: 382400,
    currency: 'ETB',
    donorCount: 618,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    beneficiariesCount: 1250,
    impactMetrics: '1,250 ቤተሰቦች የምግብና የኑሮ ድጋፍ አግኝተዋል',
    donations: [
      { donorName: 'አኖኒመስ (Anonymous)', amount: 5000, currency: 'ETB', timestamp: 'ከ10 ደቂቃ በፊት', country: '🇪🇹' },
      { donorName: 'Dr. Michael S.', amount: 100, currency: 'USD', timestamp: 'ከ1 ሰዓት በፊት', country: '🇨🇦' }
    ]
  },
  {
    id: 'charity-2',
    titleAm: 'ወላጅ አልባ ህፃናት ማሳደጊያ፣ የትምህርትና የጤና እንክብካቤ',
    titleEn: 'Orphan Shelter, Comprehensive Healthcare & Education',
    category: 'orphans',
    categoryLabelAm: 'ወላጅ አልባ ህፃናት',
    descriptionAm: 'ወላጅ አልባ ህፃናት በአስተማማኝ መጠለያ፣ በንፁህ አልሚ ምግብ፣ በትምህርት መሳሪያዎችና በቴክኖሎጂ እውቀት እንዲታነፁ የሚደረግ ፕሮጀክት።',
    targetAmount: 750000,
    raisedAmount: 590000,
    currency: 'ETB',
    donorCount: 840,
    imageUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80',
    beneficiariesCount: 480,
    impactMetrics: '480 ህፃናት ሙሉ የትምህርትና የመኖሪያ ዋስትና ተሰጥቷቸዋል',
    donations: [
      { donorName: 'ሰላም ፋውንዴሽን', amount: 25000, currency: 'ETB', timestamp: 'ከ3 ሰዓት በፊት', country: '🇪🇹' }
    ]
  },
  {
    id: 'charity-3',
    titleAm: 'ጧሪ የሌላቸው አዛውንቶች ክብካቤና ማህበራዊ ዋስትና',
    titleEn: 'Elderly Compassion Sanctuary & Dignified Care',
    category: 'elderly',
    categoryLabelAm: 'ጧሪ የሌላቸው አዛውንቶች',
    descriptionAm: 'እድሜያቸው የገፉና ተንከባካቢ ያጡ አዛውንቶችን በክብር መጦሪያ፣ የህክምና ቁሳቁስና አልባሳት የማሟላት ቅዱስ ተግባር።',
    targetAmount: 400000,
    raisedAmount: 312000,
    currency: 'ETB',
    donorCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    beneficiariesCount: 310,
    impactMetrics: '310 አዛውንቶች የሞቀ መጠለያና ነፃ ህክምና ተቋቁሞላቸዋል',
    donations: [
      { donorName: 'አቶ ዘበነ', amount: 10000, currency: 'ETB', timestamp: 'ትላንት', country: '🇪🇹' }
    ]
  },
  {
    id: 'charity-4',
    titleAm: 'መሰረተ ልማት ለገጠር ማህበረሰብ - ንፁህ መጠጥ ውሃና የፀሐይ ብርሃን',
    titleEn: 'Rural Village Clean Water Wells & Solar Electrification',
    category: 'rural_infrastructure',
    categoryLabelAm: 'የገጠር መሰረተ ልማት',
    descriptionAm: 'ውሃና መብራት ላልደረሰባቸው የገጠር መንደሮች የጥልቅ ጉድጓድ ውሃ ማውጣትና የሶላር ማይክሮ-ግሪድ መብራት መትከል።',
    targetAmount: 1200000,
    raisedAmount: 845000,
    currency: 'ETB',
    donorCount: 1120,
    imageUrl: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=600&q=80',
    beneficiariesCount: 8400,
    impactMetrics: '6 የገጠር መንደሮች የንፁህ ውሃ ተጠቃሚ ሆነዋል',
    donations: [
      { donorName: 'ግሎባል ዳያስፖራ ትብብር', amount: 50000, currency: 'ETB', timestamp: 'ዛሬ', country: '🇪🇹' }
    ]
  }
];

export const INITIAL_TALENT_CONTESTANTS: TalentContestant[] = [
  {
    id: 'talent-1',
    name: 'አቤል ተፈሪ (Abel Teferi)',
    categoryAm: 'ግጥምና ጥልቅ ስነፅሁፍ',
    categoryEn: 'Spoken Word Poetry & Philosophy',
    country: 'ኢትዮጵያ',
    countryFlag: '🇪🇹',
    performanceTitle: '"የሰው ልጆች አንድነትና የድንበር አልባ ፍቅር ዜማ"',
    videoPlaceholderBg: 'from-amber-900 to-indigo-950',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
    bio: 'የ24 አመቱ ወጣት ባለቅኔ፤ የሰው ልጆችን አንድነትና ጥንታዊ ስልጣኔ በግጥም የሚገልጽ።',
    judgeScores: { creativity: 9.6, impact: 9.8, skill: 9.5 },
    audienceLikes: 4890,
    hasLiked: false,
    earnedRoyaltiesETB: 14500
  },
  {
    id: 'talent-2',
    name: 'ሳባ ሀይሉ (Saba Hailu)',
    categoryAm: 'ሙዚቃና የድምፅ ውህደት',
    categoryEn: 'Vocal Harmony & Traditional Kirar Fusion',
    country: 'ኢትዮጵያ / ኤርትራ',
    countryFlag: '🇪🇹',
    performanceTitle: '"የጥንታዊ ዋሽንትና የክራር ማዕበል"',
    videoPlaceholderBg: 'from-purple-900 to-slate-950',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
    bio: 'ባህላዊ የክራር ቃናን ከዘመናዊ የድምፅ ቴክኖሎጂ ጋር ያዋሃደች የተሰጥኦ ባለቤት።',
    judgeScores: { creativity: 9.8, impact: 9.7, skill: 9.9 },
    audienceLikes: 6120,
    hasLiked: false,
    earnedRoyaltiesETB: 18200
  },
  {
    id: 'talent-3',
    name: 'ኢንጂነር ዳዊት ንጉሴ',
    categoryAm: 'ቴክኖሎጂና ፈጠራ',
    categoryEn: 'Green Energy Solar Invention',
    country: 'ኢትዮጵያ',
    countryFlag: '🇪🇹',
    performanceTitle: '"ከአፈርና ከፀሐይ የሚሰራ ርካሽ የሀይል ማመንጫ ፈጠራ"',
    videoPlaceholderBg: 'from-emerald-900 to-cyan-950',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160',
    bio: 'ለገጠር አርሶ አደሮች ተደራሽ የሚሆን አነስተኛ የፀሐይ ሀይል መቀየሪያ ያመረተ ፈጣሪ።',
    judgeScores: { creativity: 9.9, impact: 10.0, skill: 9.7 },
    audienceLikes: 7450,
    hasLiked: false,
    earnedRoyaltiesETB: 23100
  }
];

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

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'የኢትዮጵያ ንግድ ባንክ (Commercial Bank of Ethiopia - CBE)',
    bankCode: 'CBE',
    accountNumber: '1000192837465',
    holderName: 'ዘበነ አስፋው (Zebene Asfaw)',
    isPrimary: true,
    verified: true
  },
  {
    id: 'bank-2',
    bankName: 'ቴሌብር (Telebirr SuperApp)',
    bankCode: 'TELEBIRR',
    accountNumber: '0911234567',
    holderName: 'ዘበነ አስፋው',
    isPrimary: false,
    verified: true
  },
  {
    id: 'bank-3',
    bankName: 'አዋሽ ባንክ (Awash Bank)',
    bankCode: 'AWASH',
    accountNumber: '01320495837200',
    holderName: 'Zebene Asfaw',
    isPrimary: false,
    verified: true
  },
  {
    id: 'bank-4',
    bankName: 'ዳሽን ባንክ (Dashen Bank / Amole)',
    bankCode: 'DASHEN',
    accountNumber: '502938471625',
    holderName: 'Zebene Asfaw',
    isPrimary: false,
    verified: true
  }
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-101',
    date: 'ዛሬ 10:15',
    type: 'ROYALTY',
    descriptionAm: 'የአዳራሽ ውይይት ተሳትፎ እና የላይክ ክፍያ (Activity Royalty)',
    amount: 450,
    currency: 'ETB',
    status: 'የተጠናቀቀ (Completed)',
    bankCut10: 45,
    builderCut5: 22.5,
    netAmount: 382.5
  },
  {
    id: 'tx-102',
    date: 'ትላንት',
    type: 'EQUB',
    descriptionAm: 'የዕለታዊ ዲጂታል እቁብ መዋጮ ክፍያ',
    amount: -1000,
    currency: 'ETB',
    status: 'የተጠናቀቀ (Completed)'
  },
  {
    id: 'tx-103',
    date: 'ከ2 ቀን በፊት',
    type: 'CHARITY',
    descriptionAm: 'ለወላጅ አልባ ህፃናት ማሳደጊያ በጎ አድራጎት የተበረከተ',
    amount: -500,
    currency: 'ETB',
    status: 'የተጠናቀቀ (Completed)'
  },
  {
    id: 'tx-104',
    date: 'ከ3 ቀን በፊት',
    type: 'GAME_PRIZE',
    descriptionAm: 'ከአለም አቀፍ የጥያቄና መልስ ውድድር የተገኘ ድል',
    amount: 150,
    currency: 'ETB',
    status: 'የተጠናቀቀ (Completed)',
    bankCut10: 15,
    builderCut5: 7.5,
    netAmount: 127.5
  }
];

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
