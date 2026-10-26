export type LanguageCode = 'am' | 'en' | 'om' | 'ti' | 'ar' | 'fr' | 'es' | 'zh';

export interface SupportedLanguage {
  code: LanguageCode;
  name: string;
  localName: string;
  flag: string;
}

export type RoomCategory = 
  | 'philosophy' // ሁለንተናዊ መልካም አስተሳሰብ
  | 'tech'       // የቴክኖሎጂ እውቀት
  | 'politics'   // ፓለቲካዊ እና ኢኮኖሚያዊ እሳቤ
  | 'charity'    // በጎ አድራጎት ስራ
  | 'culture'    // በስልጣኔ አውድ
  | 'community'; // አባላት የየራሳቸው ቤት

export interface RoomOccupant {
  id: string;
  name: string;
  avatar: string;
  country: string;
  countryFlag: string;
  preferredLang: LanguageCode;
  isHost?: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isPodiumSpeaker?: boolean;
  seatNumber: number;
  royaltyPointsEarned?: number;
  titleBadge?: string;
}

export interface Room {
  id: string;
  titleAm: string;
  titleEn: string;
  category: RoomCategory;
  categoryLabelAm: string;
  descriptionAm: string;
  descriptionEn: string;
  hostName: string;
  hostAvatar: string;
  activeSpeakers: number;
  totalAudience: number;
  isMemberOwned?: boolean;
  isLive: boolean;
  scheduledTime?: string;
  topics: string[];
}

export interface LiveSpeechMessage {
  id: string;
  speakerName: string;
  speakerAvatar: string;
  sourceLang: LanguageCode;
  originalText: string;
  translations: Record<LanguageCode, string>;
  timestamp: string;
  seatNumber: number;
}

export interface EqubMember {
  id: string;
  name: string;
  avatar: string;
  country: string;
  joinedAt: string;
  hasWon: boolean;
  wonCycleRound?: number;
}

export interface EqubPool {
  id: string;
  titleAm: string;
  titleEn: string;
  cycleType: 'ዕለታዊ (Daily)' | 'ሳምንታዊ (Weekly)' | 'ወርሃዊ (Monthly)';
  amountPerMember: number;
  currency: 'ETB' | 'USD';
  members: EqubMember[];
  maxMembers: number;
  currentRound: number;
  totalRounds: number;
  nextDrawDate: string;
  reserveBank10Percent: number;
  reserveBuilder5Percent: number;
  netWinnerPayout85Percent: number;
  pastWinners: {
    round: number;
    winnerName: string;
    amount: number;
    date: string;
  }[];
}

export interface LotteryDraw {
  id: string;
  titleAm: string;
  ticketPrice: number;
  currency: 'ETB' | 'USD';
  jackpotAmount: number;
  participantsCount: number;
  drawDate: string;
  userTickets: string[];
  recentWinners: {
    ticket: string;
    winnerName: string;
    prize: number;
    time: string;
  }[];
}

export interface CharityProject {
  id: string;
  titleAm: string;
  titleEn: string;
  category: 'extreme_poverty' | 'orphans' | 'elderly' | 'rural_infrastructure';
  categoryLabelAm: string;
  descriptionAm: string;
  targetAmount: number;
  raisedAmount: number;
  currency: 'ETB' | 'USD';
  donorCount: number;
  imageUrl: string;
  beneficiariesCount: number;
  impactMetrics: string;
  donations: {
    donorName: string;
    amount: number;
    currency: string;
    timestamp: string;
    country: string;
  }[];
}

export interface TalentContestant {
  id: string;
  name: string;
  categoryAm: string;
  categoryEn: string;
  country: string;
  countryFlag: string;
  performanceTitle: string;
  videoPlaceholderBg: string;
  avatar: string;
  bio: string;
  judgeScores: {
    creativity: number; // out of 10
    impact: number;     // out of 10
    skill: number;      // out of 10
  };
  audienceLikes: number;
  hasLiked?: boolean;
  earnedRoyaltiesETB: number;
}

export interface TriviaQuestion {
  id: string;
  category: string;
  questionAm: string;
  questionEn: string;
  optionsAm: string[];
  optionsEn: string[];
  correctIndex: number;
  rewardETB: number;
  explanationAm: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: 'CBE' | 'TELEBIRR' | 'AWASH' | 'DASHEN' | 'ABYSSINIA' | 'COOP' | 'SWIFT';
  accountNumber: string;
  holderName: string;
  isPrimary: boolean;
  verified: boolean;
}

export interface TransactionRecord {
  id: string;
  date: string;
  type: 'EARNING' | 'WITHDRAW' | 'DEPOSIT' | 'ROYALTY' | 'EQUB' | 'CHARITY' | 'GIFT' | 'GAME_PRIZE';
  descriptionAm: string;
  amount: number;
  currency: 'ETB' | 'USD';
  status: 'የተጠናቀቀ (Completed)' | 'በሂደት ላይ (Processing)';
  bankCut10?: number;
  builderCut5?: number;
  netAmount?: number;
}

export interface PeerCreditItem {
  id: string;
  borrowerName: string;
  borrowerAvatar: string;
  amount: number;
  currency: 'ETB';
  reason: string;
  repaymentPeriodDays: number;
  interestRate: number;
  status: 'ጥያቄ የቀረበ' | 'የፀደቀ' | 'የተመለሰ';
  backersCount: number;
}

export interface VirtualGift {
  id: string;
  nameAm: string;
  nameEn: string;
  icon: string;
  priceETB: number;
  rarity: 'common' | 'rare' | 'legendary';
}
