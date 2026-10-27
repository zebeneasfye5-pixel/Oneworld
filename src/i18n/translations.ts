export type AppLanguage = 'am' | 'om' | 'ti' | 'en' | 'fr' | 'zh' | 'ar' | 'de';

export interface LanguageMeta {
  code: AppLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const APP_LANGUAGES: LanguageMeta[] = [
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', dir: 'ltr' },
  { code: 'om', name: 'Afaan Oromoo', nativeName: 'Afaan Oromoo', flag: '🇪🇹', dir: 'ltr' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇹', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
];

export interface HouseInfo {
  title: string;
  desc: string;
  roles: string[];
}

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  dashboard: string;
  installApp: string;
  installedNotice: string;
  signIn: string;
  signUp: string;
  signOut: string;
  phoneNumber: string;
  password: string;
  fullName: string;
  gender: string;
  age: string;
  nationality: string;
  address: string;
  idNumber: string;
  roleTitle: string;
  photo: string;
  balance: string;
  royaltyPoints: string;
  reserveRule: string;
  builderVaultTitle: string;
  builderVaultDesc: string;
  enterPin: string;
  unlock: string;
  locked: string;
  offlineReady: string;
  online: string;
  foundingManifesto: string;
  founderName: string;
  foundingDate: string;
  
  // Navigation Bar Items
  nav: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    h7: string;
    h8: string;
    h9: string;
    h10: string;
    h11: string;
    h12: string;
    h13: string;
    h14: string;
    h15: string;
    equb: string;
    games: string;
    bank: string;
  };

  // Header Elements
  header: {
    live: string;
    installApp: string;
    vault: string;
    profile: string;
    openDashboard: string;
    selectLanguage: string;
  };

  // PWA Banner
  banner: {
    title: string;
    subtitle: string;
    badge: string;
    button: string;
  };

  // House Stage & Video Grid Media
  stageMedia: {
    regRequired: string;
    joinPromptPrefix: string;
    joinPromptSuffix: string;
    gateDesc: string;
    selectRole: string;
    agreeBylaws: string;
    registerBtn: string;
    liveHall: string;
    active: string;
    seatsTitle: string;
    seatsCount: string;
    yourSeat: string;
    occupied: string;
    openSeat: string;
    takeSeat: string;
    leaveSeat: string;
    micOn: string;
    micOff: string;
    camOn: string;
    camOff: string;
    sendGift: string;
    speaking: string;
  };

  // House 1 Agora & Stage
  roomStage: {
    allHalls: string;
    philosophy: string;
    tech: string;
    politics: string;
    charity: string;
    community: string;
    openSubHall: string;
    numberedChairs: string;
    takeASeat: string;
    leaveTheSeat: string;
    micMute: string;
    micUnmute: string;
    camClose: string;
    camOpen: string;
    sendGift: string;
    inputPlaceholder: string;
    send: string;
    liveBadge: string;
  };

  // Numbered Chairs & Stage Badges
  chairs: {
    seatPrefix: string;
    occupiedChairs: string;
    openSeat: string;
    takeSeat: string;
    leaveSeat: string;
    you: string;
    youOnSeat: string;
    youParticipant: string;
    host: string;
    leadSpeaker: string;
    activeMember: string;
    speakingNow: string;
    micLive: string;
    micMuted: string;
    camOff: string;
    toggleWebcam: string;
    avatarMode: string;
    raiseHand: string;
    lowerHand: string;
    audienceCount: string;
    hostLabel: string;
    liveBadge: string;
  };

  // Official Charter / Guidelines Modal
  charterModal: {
    title: string;
    founderLabel: string;
    section1Title: string;
    section1Text1: string;
    section1Text2: string;
    section2Title: string;
    section2Rule1: string;
    section2Rule2: string;
    section3Title: string;
    section3Rule1: string;
    section3Rule2: string;
    section3Rule3: string;
    section3Rule4: string;
    understoodBtn: string;
  };

  // Announcements & Notifications
  announcements: {
    liveTranslatorTitle: string;
    liveTranslatorSubtitle: string;
    liveTranslationTo: string;
    originalSpeech: string;
    speakTranslation: string;
    seatClaimed: string;
    seatLeft: string;
    insufficientFunds: string;
    giftSent: string;
    profileSaved: string;
    vaultBtn: string;
    charterBtn: string;
    offlineReadyNotice: string;
    founderNotice: string;
  };

  // Master Drawer
  drawer: {
    searchPlaceholder: string;
    housesHeading: string;
    profile: string;
    tags: Record<string, string>;
  };

  // 15 Sovereign Houses
  houses: {
    h1: HouseInfo;
    h2: HouseInfo;
    h3: HouseInfo;
    h4: HouseInfo;
    h5: HouseInfo;
    h6: HouseInfo;
    h7: HouseInfo;
    h8: HouseInfo;
    h9: HouseInfo;
    h10: HouseInfo;
    h11: HouseInfo;
    h12: HouseInfo;
    h13: HouseInfo;
    h14: HouseInfo;
    h15: HouseInfo;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  am: {
    appName: 'Oneworld',
    appSubtitle: 'የአለማችን ህዝቦች የጋራ 15ቱ ዋና ዋና ቤቶችና ማህበራዊ መድረክ',
    dashboard: 'ዋና ዳሽቦርድ',
    installApp: 'ወደ ስልክ ጫን (Install App)',
    installedNotice: 'መተግበሪያው በስልክዎ ላይ ተጭኗል',
    signIn: 'ግባ (Sign In)',
    signUp: 'ተመዝገብ (Sign Up)',
    signOut: 'ውጣ (Sign Out)',
    phoneNumber: 'ስልክ ቁጥር',
    password: 'የይለፍ ቃል (Password)',
    fullName: 'ሙሉ ስም',
    gender: 'ፆታ',
    age: 'እድሜ',
    nationality: 'ዜግነት',
    address: 'አድራሻ / ከተማ',
    idNumber: 'መታወቂያ ቁጥር / ፓስፖርት',
    roleTitle: 'የስልጣን ማዕረግ / ሀላፊነት',
    photo: 'የፊት ፎቶ',
    balance: 'የሂሳብ ቀሪ',
    royaltyPoints: 'የእንቅስቃሴ ሮያሊቲ',
    reserveRule: '60% ለአባላት · 10% ለባንክ · 10% ለገንቢው (ዘበነ አስፍዬ) · 20% ለማህበረሰብ',
    builderVaultTitle: 'የገንቢው ሚስጥራዊ ካዝና (Builder Sovereign Vault)',
    builderVaultDesc: 'በባለቤቱ ዘበነ አስፍዬ የይለፍ ቃል (2026) ብቻ የሚከፈት የገቢ መዝገብ',
    enterPin: 'የ2026 ሚስጥር ቁጥር ያስገቡ',
    unlock: 'ክፈት (Unlock)',
    locked: 'በ2026 ኮድ የተቆለፈ',
    offlineReady: 'ከኢንተርኔት ውጭ ይሰራል (Offline Ready)',
    online: 'በቀጥታ መስመር ላይ (Online)',
    foundingManifesto: 'የመድረኩ አመሰራረት፣ ህግና ደንብ መመሪያ',
    founderName: 'ዘበነ አስፍዬ (Zebene Asfaye)',
    foundingDate: 'ጥቅምት 2026 እ.ኤ.አ',
    nav: {
      h1: '፩. የጋራ ቤት',
      h2: '፪. የስጋ ዘመድ',
      h3: '፫. ባለስልጣን',
      h4: '፬. የሚስጥር ቤት',
      h5: '፭. የሰርግ ቤት',
      h6: '፮. የእምነት ቤት',
      h7: '፯. የደህንነት ቤት',
      h8: '፰. ታለንት ሾው',
      h9: '፱. ማስታወቂያና ገበያ',
      h10: '፲. ትምህርት ቤት',
      h11: '፲፩. ተቋማዊ ስልጠና',
      h12: '፲፪. ሳይኮሎጂና ምክር',
      h13: '፲፫. ድለላና ፈላጊ',
      h14: '፲፬. አቤቱታና ዳኝነት',
      h15: '፲፭. የአገልግሎት ክፍያ',
      equb: 'ዲጂታል እቁብና ሎተሪ',
      games: 'ጨዋታዎች (ገበጣ)',
      bank: 'ባንክና ሮያሊቲ'
    },
    header: {
      live: 'በቀጥታ (Live)',
      installApp: 'ወደ ስልክ ጫን',
      vault: 'ካዝና (2026)',
      profile: 'መገለጫ',
      openDashboard: 'ዳሽቦርድ ክፈት',
      selectLanguage: 'ቋንቋ ይምረጡ'
    },
    banner: {
      title: 'Oneworld አፕሊኬሽን በስልክዎ ላይ ይጫኑ',
      subtitle: 'ኔትወርክ በሌለበትና ደካማ በሆነበት ሰአትም ያለምንም ችግር በቀጥታ እንዲከፍት ወደ ስክሪንዎ ይጫኑ',
      badge: 'ፈጣንና ኦፍላይን',
      button: 'አሁን ጫን (Install App)'
    },
    stageMedia: {
      regRequired: 'የቤቱ አባልነት ምዝገባ ግዴታ',
      joinPromptPrefix: 'ወደ',
      joinPromptSuffix: 'ለመግባት አባል ይሁኑ',
      gateDesc: 'ወደዚህ ቤት ገብተው ወንበር ለመያዝ፣ በቪዲዮና ድምፅ ለመወያየት እባክዎ የቤቱን አባልነት ያረጋግጡ።',
      selectRole: 'የሚወክሉት የስራ ወይም የሃላፊነት ድርሻ',
      agreeBylaws: 'የቤቱን ህግ፣ ደንብና ስነ-ስርአት አክብሬ ለመሳተፍ ተስማምቻለሁ',
      registerBtn: 'የቤቱ አባል ሁንና ግባ',
      liveHall: 'የቀጥታ ቪዲዮና የድምፅ መድረክ',
      active: 'አክቲቭ',
      seatsTitle: 'የቤቱ መቀመጫ ወንበሮች',
      seatsCount: 'የተያዙ',
      yourSeat: 'እርስዎ',
      occupied: 'የተያዘ',
      openSeat: 'ክፍት ወንበር',
      takeSeat: 'ወንበር ያዙ',
      leaveSeat: 'ወንበሩን ልቀቅ',
      micOn: 'ማይክ ዝጋ',
      micOff: 'ማይክ ክፈት',
      camOn: 'ቪዲዮ ዝጋ',
      camOff: 'ቪዲዮ ክፈት',
      sendGift: 'ስጦታ ላክ',
      speaking: 'እየተናገሩ ነው...'
    },
    roomStage: {
      allHalls: 'ሁሉም አዳራሾች',
      philosophy: 'መልካም አስተሳሰብ',
      tech: 'ቴክኖሎጂና AI',
      politics: 'ፓለቲካና ኢኮኖሚ',
      charity: 'በጎ አድራጎት',
      community: 'የአባላት የግል ቤቶች',
      openSubHall: 'የግል አዳራሽ ክፈት',
      numberedChairs: 'የአዳራሹ የተራ ቁጥር ወንበሮች',
      takeASeat: 'ወንበር ያዙ (Take a Seat)',
      leaveTheSeat: 'ወንበር ልቀቅ (Leave Seat)',
      micMute: 'ማይክ ዝጋ (Mute)',
      micUnmute: 'ማይክ ክፈት (Unmute)',
      camClose: 'ካሜራ ዝጋ',
      camOpen: 'ካሜራ ክፈት',
      sendGift: 'ስጦታ ላክ',
      inputPlaceholder: 'በራስዎ ቋንቋ ሀሳብዎን ይፃፉ...',
      send: 'ላክ',
      liveBadge: 'በቀጥታ (Live)'
    },
    chairs: {
      seatPrefix: 'ወንበር #',
      occupiedChairs: 'የተያዙ ወንበሮች፡',
      openSeat: 'ክፍት ወንበር',
      takeSeat: 'ወንበር ያዙ',
      leaveSeat: 'ወንበር ልቀቅ',
      you: 'እርስዎ',
      youOnSeat: 'እርስዎ በወንበር #',
      youParticipant: 'እርስዎ (ተሳታፊ)',
      host: 'የመድረክ መሪ',
      leadSpeaker: 'ዋና ተናጋሪ',
      activeMember: 'ተሳታፊ አባል',
      speakingNow: 'እየተናገረ ነው',
      micLive: 'ማይክ በርቷል',
      micMuted: 'ድምፅ ተዘግቷል',
      camOff: 'ካሜራ ጠፍቷል',
      toggleWebcam: 'ቀጥታ ዌብካም',
      avatarMode: 'HD አቫታር',
      raiseHand: 'እጅ አውጣ',
      lowerHand: 'እጅ ዝቅ አድርግ',
      audienceCount: 'ተሳታፊ',
      hostLabel: 'አስተናጋጅ፡',
      liveBadge: 'በቀጥታ (Live)'
    },
    charterModal: {
      title: 'የ«OneWorld (ዓለም አንድ)» መድረክ አመሰራረት፣ ህግና ደንብ መመሪያ (Official Charter)',
      founderLabel: 'መስራች፡ ዘበነ አስፍዬ (Zebene Asfaye) · ጥቅምት 2026 እ.ኤ.አ',
      section1Title: 'ክፍል ፩፡ የአመሰራረት አዋጅ እና ራዕይ',
      section1Text1: 'ይህ «OneWorld (ዓለም አንድ)» የተሰኘው ታላቅ የሰው ልጆች የጋራ 15ቱ ቤቶች ማህበራዊ መድረክና የዕውቀት ማዕከል በኢትዮጵያዊው ራዕይ መሪ ዘበነ አስፍዬ (Zebene Asfaye) በ2026 እ.ኤ.አ የተመሰረተ ሉዓላዊ መድረክ ነው።',
      section1Text2: 'ዋና አላማው የአለማችንን ህዝቦች በሁለንተናዊ መልካም አስተሳሰብ፣ በቴክኖሎጂ እውቀት፣ በፓለቲካዊና ኢኮኖሚያዊ እሳቤ፣ በበጎ አድራጎት ስራ እና በስልጣኔ አውድ ወደ ተቀራረበ ደረጃ ለማምጣት በአንድ ቤት ተሰባስበው እንዲመካከሩ፣ እውቀት እንዲለዋወጡ፣ ፍቅርና አንድነትን እንዲገነቡ ማድረግ ነው።',
      section2Title: 'ክፍል ፪፡ የ15ቱ ዋና ዋና ቤቶች የመረጃ ጥበቃና መለያየት (Data Isolation)',
      section2Rule1: 'የመረጃ ሚስጥራዊነት፡ አንዱ ቤት የሌላኛውን ቤት ምንም አይነት መረጃ ማግኘት አይችልም። በእያንዳንዱ ቤት የሚደረጉ ውይይቶችና ሰነዶች በዚያው ቤት ብቻ የተመጠኑ ናቸው።',
      section2Rule2: 'ሚስጥራዊ የጋብቻና የዳኝነት ውሎች፡ በሰርግ ቤትና በዳኝነት ቤት የሚደረጉ ውሎች በአለም አቀፍ የፍትሐብሔር ህግ ቁጥሮች ተመዝግበው ህጋዊ ማህተም የሚሰጣቸው ናቸው።',
      section3Title: 'ክፍል ፫፡ የገቢ፣ የባንክና የገንቢው የኮሚሽን ስርአት (60% / 10% / 10% / 20%)',
      section3Rule1: 'ለተሳታፊዎችና ለአባላት ቀጥታ ገቢ (60%)፡ አባላቱ በተለያዩ ተሳትፎዎችና አባላትን ከማፍራት ለሚያገኙት ገቢ 60% ቀጥታ ይከፈላቸዋል።',
      section3Rule2: 'የባንክ መጠባበቂያ (10%)፡ በኢትዮጵያ ንግድ ባንክና በብሄራዊ ባንክ መመሪያ መሰረት የፈሳሽነትና የግብይት ዋስትና እንዲሆን 10% ይቀመጣል።',
      section3Rule3: 'ለገንቢው/ድርጅቱ 10% ቋሚ ገቢ (ሚስጥራዊ 2026 ኮድ)፡ ለመድረኩ መስራች ዘበነ አስፍዬ በኢትዮጵያ ንግድ ባንክ (CBE) አካውንት 1000167413618 በቀጥታ እንዲተላለፍ በ2026 ኮድ የተጠበቀ 10% ቋሚ ገቢ ተደንግጓል።',
      section3Rule4: 'ለማህበረሰብ እቁብና በጎ አድራጎት (20%)፡ ለማህበረሰብ የጋራ ፈንድ፣ ለድሃ ድሆችና ለእቁብ ማጠናከሪያ 20% ይውላል።',
      understoodBtn: 'መመሪያውን ተረድቻለሁ'
    },
    announcements: {
      liveTranslatorTitle: 'አውቶማቲክ የቀጥታ ቋንቋ ተርጓሚ (Live Speech Translation)',
      liveTranslatorSubtitle: 'ማንኛውም ሰው በራሱ ቋንቋ ሲናገር በራስዎ ቋንቋ ወዲያው ይሰማሉ',
      liveTranslationTo: 'የቀጥታ ትርጉም (ወደ አማርኛ)፡',
      originalSpeech: 'የመጀመሪያ ንግግር',
      speakTranslation: 'በትርጉም ድምፅ ያዳምጡ',
      seatClaimed: 'ወንበር በተሳካ ሁኔታ ተያዘ! ማይክና ቪዲዮ ነቅቷል።',
      seatLeft: 'ወንበሩን ለቀዋል፤ በተመልካችነት ላይ ነዎት።',
      insufficientFunds: 'ይቅርታ፣ በቂ ሂሳብ የለዎትም።',
      giftSent: 'ስጦታው በተሳካ ሁኔታ ተልኳል!',
      profileSaved: 'የአባልነት መገለጫዎና ፎቶዎ በተሳካ ሁኔታ ተረጋግጧል!',
      vaultBtn: 'የገንቢው ሚስጥራዊ ካዝና (PIN 2026)',
      charterBtn: 'የመድረኩ ህግ፣ ደንብና አመሰራረት (Charter)',
      offlineReadyNotice: 'ከኢንተርኔት ውጭ ይሰራል (Offline Ready)',
      founderNotice: 'መስራች፡ ዘበነ አስፍዬ (2026)'
    },
    drawer: {
      searchPlaceholder: 'ቤቶችን በስም ወይም በቁጥር ፈልግ (1-15)...',
      housesHeading: '15ቱ ዋና ዋና ቤቶች በቅደም ተከተል (Houses 1-15)',
      profile: 'መገለጫ',
      tags: {
        h1: 'ክፍት',
        h2: 'ውልድና',
        h3: 'መሪነት',
        h4: 'ሚስጥር',
        h5: 'ሰርግ',
        h6: 'እምነት',
        h7: 'ደህንነት',
        h8: 'ታለንት',
        h9: 'ገበያ',
        h10: 'ትምህርት',
        h11: 'ስልጠና',
        h12: 'ሳይኮሎጂ',
        h13: 'ድለላ',
        h14: 'ዳኝነት',
        h15: 'ክፍያ'
      }
    },
    houses: {
      h1: { title: '1. የሁሉም የጋራ ቤት', desc: 'ማንኛውም የአለም ህዝብ በስልክና ፓስዋርድ ተመዝግቦ በጋራ የሚመካከርበት ክፍት አጎራ', roles: ['የጋራ ቤት አባል', 'የውይይት መሪ', 'ዋና ተናጋሪ', 'ክቡር ታዳሚ'] },
      h2: { title: '2. የስጋ ዘመድ ቤት', desc: 'የስጋ ዝምድና ያላቸው ሰዎች ተሰባስበው ስለ ውልድናቸው የሚወያዩበትና ውልድና የሚያጠናክሩበት', roles: ['የቤተሰብ መሪ', 'የዘር ሀረግ መዛግብት ጠባቂ', 'የስጋ ዘመድ አባል', 'የሽማግሌዎች ጉባኤተኛ'] },
      h3: { title: '3. የባለስልጣን ቤት', desc: 'መሪዎችና ባለስልጣናት ስለ ሀገር ልማትና ደህንነት የሚመካከሩበት ከፍተኛ አዳራሽ', roles: ['የህዝብ ተወካይ / ሚኒስትር', 'የልማትና ደህንነት አማካሪ', 'የዲፕሎማሲ መልዕክተኛ', 'የፖሊሲ ተንታኝ'] },
      h4: { title: '4. የሚስጥር ቤት', desc: 'በትዳር የሚፈላለጉ ጥንዶችና ሚስጥረኞች ሳይባክን የሚመካከሩበት የተጠበቀ ጓዳ', roles: ['የትዳር ፈላጊ ጥንዶች', 'የህይወትና ትዳር ሚስጥር አማካሪ', 'የተጠበቀ ተመካካሪ', 'የቤተሰብ ሽማግሌ'] },
      h5: { title: '5. የሰርግ ቤት', desc: 'የቀጥታ ቪዲዮ የኦንላይን ሰርግ ስነ-ስርአት፣ ሚዜዎች፣ ሽማግሌዎች፣ ጥሎሽና አለም አቀፍ ህጋዊ የጋብቻ ውል ሰነድ', roles: ['ሙሽራ / ሙሽሪት', 'ሚዜ', 'አጋቢ ሽማግሌ', 'የሰርግ ምስክር', 'የክብር ታዳሚ'] },
      h6: { title: '6. የእምነት ቤት', desc: 'ሁሉም እምነቶች እንደየ እምነታቸው ተመዝግበው በየራሳቸው ግሩፕ የሚማማሩበት መንፈሳዊ ማዕከል', roles: ['የሃይማኖት አባት / መምህር', 'የሰንበት/ተመራማሪ አባል', 'የሰላምና አንድነት አምባሳደር', 'ተማሪ'] },
      h7: { title: '7. የደህንነት አስጠባቂ ቤት', desc: 'የደህንነት ፓሊሶችና የፀጥታ አካላት የሚረብሹ እንቅስቃሴዎችን የሚከታተሉበትና የሚመክሩበት', roles: ['የሰላምና ፀጥታ ሃላፊ', 'የሳይበር ደህንነት ተቆጣጣሪ', 'የህግ አስከባሪ መኮንን', 'የማህበረሰብ ጥበቃ'] },
      h8: { title: '8. የታለንት ሾው ቤት', desc: 'የቴክኖሎጂ ፈጠራ፣ መሪነት፣ ሙዚቃ፣ ኮሜዲ፣ ትምህርትና ተሰጥኦዎች በዳኞችና በላይክ የሚወዳደሩበት', roles: ['ተወዳዳሪ ባለተሰጥኦ', 'ዋና ዳኛ', 'የሙዚቃና ጥበብ አሰልጣኝ', 'የታዳሚ ድምፅ ሰጪ'] },
      h9: { title: '9. የማስታወቂያና የገበያ ቤት', desc: 'አምራቾች፣ ነጋዴዎችና ባለሀብቶች ምርታቸውን በቪዲዮና ድምፅ የሚያስተዋውቁበትና ቀጥታ የሚሸጡበት', roles: ['ዋና አምራች / ላኪ', 'ነጋዴ / ቸርቻሪ', 'ገዢ / ሸማች', 'የንግድ ድርድር አስተባባሪ'] },
      h10: { title: '10. የትምህርት ቤት', desc: 'አለም አቀፍ ቋንቋ፣ AI፣ ቴክኖሎጂ፣ ሂሳብ፣ ጤና፣ ፊዚክስና ጥንታዊ ጥበባት አጫጭር ትምህርቶች የሚሰጡበት', roles: ['የዩኒቨርሲቲ ፕሮፌሰር / መምህር', 'የAIና ቴክኖሎጂ አሰልጣኝ', 'ተማሪ / ተመራማሪ', 'የጥበብ አዋቂ'] },
      h11: { title: '11. ተቋማዊ ስልጠና መስጫ አዳራሽ', desc: 'በአለም፣ በሀገር፣ በክልል፣ በወረዳና በቀበሌ ደረጃ መንግስታዊና መንግስታዊ ላልሆኑ ተቋማት የቪዲዮ ስልጠና', roles: ['የተቋም ዋና ስራ አስፈፃሚ', 'የስልጠና ዳይሬክተር', 'ሰልጣኝ ሰራተኛ', 'የአቅም ግንባታ ባለሙያ'] },
      h12: { title: '12. የምክርና ሳይኮሎጂ ትሪትመንት ቤት', desc: 'የስነ-ልቦና ህክምናና የምክር አገልግሎት ሰጪዎች ከተገልጋዮች ጋር በቪዲዮና ድምፅ የሚገናኙበት', roles: ['ክሊኒካል ሳይኮሎጂስት', 'የአዕምሮ ጤና አማካሪ', 'ተገልጋይ / ታካሚ', 'የማገገሚያ አስተባባሪ'] },
      h13: { title: '13. የድለላና ፈላጊ/ተፈላጊ ቤት', desc: 'ደላሎችና ተገልጋዮች እንዲሁም በቀጥታ ፈላጊና ተፈላጊ ተገናኝተው ጉዳያቸውን የሚፈፅሙበት', roles: ['ህጋዊ የሪልስቴትና መኪና ደላላ', 'የሸቀጥ አቅራቢ / ፈላጊ', 'ቀጥታ ገዥ / ተከራይ', 'የንግድ አማካሪ'] },
      h14: { title: '14. የአቤቱታና የዳኝነት ቤት', desc: 'ዳኞችና በደል የደረሰባቸው አቤቱታ አቅራቢዎች ተገናኝተው ውሳኔ በድምፅና በሰነድ የሚያገኙበት ፍርድ ቤት', roles: ['የግልግል ዳኛ', 'ጠበቃና የህግ አማካሪ', 'አቤቱታ አቅራቢ', 'ተከሳሽ / መልስ ሰጪ'] },
      h15: { title: '15. የአገልግሎት ክፍያ ቤት', desc: 'የመብራት፣ የውሃ፣ የትራንስፖርትና ሌሎች አገልግሎቶች ክፍያ በCBE እና ቴሌብር የሚፈፀምበት', roles: ['የመብራትና ውሃ ተጠቃሚ', 'የክፍያ ዴስክ ኦፊሰር', 'የባንክ አስተባባሪ', 'የቴሌኮም ተጠቃሚ'] }
    }
  },
  om: {
    appName: 'Oneworld',
    appSubtitle: 'Manoolee gurguddoo 15 fi Wiirtuu Beekumsaa Uummata Addunyaa',
    dashboard: 'Daashboordii Olaanaa',
    installApp: 'Bilbila irratti fe\'i (Install App)',
    installedNotice: 'Applikeeshiniin bilbila keessan irratti fe\'ameera',
    signIn: 'Seeni (Sign In)',
    signUp: 'Galmaa\'i (Sign Up)',
    signOut: 'Ba\'i (Sign Out)',
    phoneNumber: 'Lakkoofsa Bilbilaa',
    password: 'Jecha Darbii (Password)',
    fullName: 'Maqaa Guutuu',
    gender: 'Korniyaa',
    age: 'Umrii',
    nationality: 'Lammummaa',
    address: 'Teessoo / Magaalaa',
    idNumber: 'Waraqaa Eenyummaa',
    roleTitle: 'Aangoo / Gahee Hojii',
    photo: 'Suuraa Fuulaa',
    balance: 'Hambaa Baankii',
    royaltyPoints: 'Qabxii Sochii',
    reserveRule: '60% miseensotaaf · 10% baankiif · 10% ijaaraaf (Zebene Asfaye) · 20% hawaasaaf',
    builderVaultTitle: 'Kuusaa Qooda Ijaaraa (PIN 2026)',
    builderVaultDesc: 'Galmee galii eeyyama qooda qabaa Zebene Asfayetiin qofa banamu',
    enterPin: 'Koodii icciitii 2026 galchaa',
    unlock: 'Bani (Unlock)',
    locked: 'Koodii 2026n cufame',
    offlineReady: 'Toora intarneetiin ala ni hojjeta (Offline)',
    online: 'Toora irratti jira (Online)',
    foundingManifesto: 'Heera fi Qajeelfama Hundeeffama Waltajjichaa',
    founderName: 'Zebene Asfaye (Hundeesaa)',
    foundingDate: 'Onkololeessa 2026',
    nav: {
      h1: '1. Mana Waloo',
      h2: '2. Fira Dhiigaa',
      h3: '3. Abbootii Taayitaa',
      h4: '4. Mana Icciitii',
      h5: '5. Mana Cidhaa',
      h6: '6. Mana Amantaa',
      h7: '7. Mana Nageenyaa',
      h8: '8. Agarsiisa Dandeettii',
      h9: '9. Beeksisa fi Gabaa',
      h10: '10. Mana Barumsaa',
      h11: '11. Leenjii Dhaabbilee',
      h12: '12. Gorsa Saayikooloojii',
      h13: '13. Dilaalaa fi Barbaadduu',
      h14: '14. Komii fi Murtii',
      h15: '15. Kaffaltii Tajaajilaa',
      equb: 'Iqubii fi Lootarii',
      games: 'Taphawwan (Sadeeqa)',
      bank: 'Baankii fi Qooda'
    },
    header: {
      live: 'Kallattiin (Live)',
      installApp: 'Bilbila irratti fe\'i',
      vault: 'Kuusaa (2026)',
      profile: 'Piroofaayilii',
      openDashboard: 'Daashboordii Bani',
      selectLanguage: 'Afaan Filadhaa'
    },
    banner: {
      title: 'Applikeeshinii Oneworld Bilbila Keessan Irratti Fe\'aa',
      subtitle: 'Yeroo intarneetiin hin jirretti fi laafaa ta\'etti haalaan akka hojjetuuf gara iskiriinii keessaniitti fe\'aa',
      badge: 'Saffisaa & Offline',
      button: 'Amma Fe\'i (Install App)'
    },
    stageMedia: {
      regRequired: 'Dirqama Galmee Miseensummaa Manaa',
      joinPromptPrefix: 'Gara',
      joinPromptSuffix: 'seenuuf miseensa ta\'aa',
      gateDesc: 'Mana kana seentanii teessoo qabachuuf, viidiyoo fi sagaleen mari\'achuuf mirkaneessa miseensummaa xumuraa.',
      selectRole: 'Gahee Hojii Ykn Aangoo Keessan Filadhaa',
      agreeBylaws: 'Heera, dambii fi naamusa manichaa kabajuuf walii galeera',
      registerBtn: 'Miseensa Ta\'iitii Seeni',
      liveHall: 'Walgahii Viidiyoo fi Sagalee Kallattii',
      active: 'Hojjataa',
      seatsTitle: 'Teessoowwan Mana Kanaa',
      seatsCount: 'Qabaman',
      yourSeat: 'Isin',
      occupied: 'Qabameera',
      openSeat: 'Teessoo Duwwaa',
      takeSeat: 'Teessoo Qabadhu',
      leaveSeat: 'Teessoo Gadhiisi',
      micOn: 'Maayikii Cufi',
      micOff: 'Maayikii Bani',
      camOn: 'Kaameeraa Cufi',
      camOff: 'Kaameeraa Bani',
      sendGift: 'Kennaa Ergi',
      speaking: 'Dubbachaa jira...'
    },
    roomStage: {
      allHalls: 'Galmawwan Hunda',
      philosophy: 'Ilaalcha Gaarii',
      tech: 'Teeknooloojii & AI',
      politics: 'Siyaasa & Diinagdee',
      charity: 'Hojii Tola Ooltummaa',
      community: 'Manneen Dhuunfaa Miseensotaa',
      openSubHall: 'Galma Dhuunfaa Bani',
      numberedChairs: 'Teessoowwan Lakkoofsaa Galmichaa',
      takeASeat: 'Teessoo Qabadhu',
      leaveTheSeat: 'Teessoo Gadhiisi',
      micMute: 'Maayikii Cufi',
      micUnmute: 'Maayikii Bani',
      camClose: 'Kaameeraa Cufi',
      camOpen: 'Kaameeraa Bani',
      sendGift: 'Kennaa Ergi',
      inputPlaceholder: 'Afaan keessaniin yaada keessan barreessaa...',
      send: 'Ergi',
      liveBadge: 'Kallattiin (Live)'
    },
    chairs: {
      seatPrefix: 'Teessoo #',
      occupiedChairs: 'Teessuma Qabaman:',
      openSeat: 'Teessoo Banaa',
      takeSeat: 'Teessoo Qabadhu',
      leaveSeat: 'Teessoo Gadhiisi',
      you: 'Isin',
      youOnSeat: 'Isin Teessoo #',
      youParticipant: 'Isin (Hirmaataa)',
      host: 'Gaggeessaa Waltajjii',
      leadSpeaker: 'Dubbataa Guddaa',
      activeMember: 'Miseensa Hirmaataa',
      speakingNow: 'Dubbachaa jira',
      micLive: 'Maayikii Banaadha',
      micMuted: 'Sagalee Cufameera',
      camOff: 'Kaameraa Cufameera',
      toggleWebcam: 'Webkaam Kallattii',
      avatarMode: 'Avataara HD',
      raiseHand: 'Harka Baasi',
      lowerHand: 'Harka Buusi',
      audienceCount: 'hirmaattota',
      hostLabel: 'Gaggeessaa:',
      liveBadge: 'Kallattiin (Live)'
    },
    charterModal: {
      title: 'Hundeeffama, Heeraa fi Qajeelfama Waltajjii «OneWorld» (Official Charter)',
      founderLabel: 'Hundeeffamaa: Zabbana Asfaayee (Zebene Asfaye) · Onkololeessa 2026',
      section1Title: 'Kutaa 1: Labsa Hundeeffamaa fi Mul\'ata',
      section1Text1: 'Waltajjiin «OneWorld» manneen 15 ilmaan namaa tokko godhu kun hoggana mul\'ata qabu Zabbana Asfaayee (Zebene Asfaye) bara 2026 kan hundeeffamedha.',
      section1Text2: 'Kaayyoon guddaan ummata addunyaa yaada gaarii, beekumsa teeknolojii, siyaasaa fi dinagdee, akkasumas hojii tola ooltummaan walitti fiduudha.',
      section2Title: 'Kutaa 2: Eegumsa fi Adda Baasaa Odeeffannoo Manneen 15 (Data Isolation)',
      section2Rule1: 'Iccitii Odeeffannoo: Manni tokko odeeffannoo mana biraa argachuu hin danda\'u. Marii fi ragaaleen hundumtuu mana sana qofatti murtaa\'u.',
      section2Rule2: 'Waliigaltee Cidhaa fi Murtii: Waliigalteen mana cidhaa fi murtii seera siivilii addunyaatiin galmaa\'ee mallattoo seeraa argata.',
      section3Title: 'Kutaa 3: Sirna Galii, Baankii fi Komishinii Ogeessaa (60% / 10% / 10% / 20%)',
      section3Rule1: 'Galii Kallattii Miseensotaaf (60%): Miseensonni hirmaannaa fi miseensa fiduu irraa galii argatan keessaa 60% kallattiin kaffalamaaf.',
      section3Rule2: 'Kuusaa Baankii (10%): Qajeelfama Baankii Daldala Itiyoophiyaa fi Baankii Biyyaalessaatiin wabummaa daldalaaf 10% ta\'a.',
      section3Rule3: 'Galii Dhaabbataa Ogeessaaf 10% (Koodii Iccitii 2026): Hundeeffamaa Zabbana Asfaayeetiif herrega CBE 1000167413618 irratti koodii 2026n eegamee kallattiin darba.',
      section3Rule4: 'Iqubii fi Tola Ooltummaa Hawaasaaf (20%): Fundii waliinii hawaasaa, hiyyeeyyii fi iqubii jabeessuuf 20% oola.',
      understoodBtn: 'Qajeelfamicha Hubadheera'
    },
    announcements: {
      liveTranslatorTitle: 'Hiikaa Sagalee Kallattii Ofumaan (Live Speech Translation)',
      liveTranslatorSubtitle: 'Namni afaan isaatiin yoo dubbatu afaan keessaniin battalumatti dhageessu',
      liveTranslationTo: 'Hiikaa Kallattiin (Gara Afaan Oromootti):',
      originalSpeech: 'Dubbii Jalqabaa',
      speakTranslation: 'Sagaleedhaan Dhaggeeffadhu',
      seatClaimed: 'Teessoon milkaa\'inaan qabameera! Maayikii fi viidiyoon hojjechaa jiru.',
      seatLeft: 'Teessoo gadhiistanii gara daawwannaatti deebitaniittu.',
      insufficientFunds: 'Dhiifama, herregni keessan gahaa miti.',
      giftSent: 'Kennaan milkaa\'inaan darbeera!',
      profileSaved: 'Ibsi miseensummaa fi suuraan milkaa\'inaan mirkanaa\'eera!',
      vaultBtn: 'Saanduqa Iccitii Ogeessaa (PIN 2026)',
      charterBtn: 'Heeraa fi Qajeelfama Hundeeffamaa (Charter)',
      offlineReadyNotice: 'Intarneetii Malees Hojjeta (Offline Ready)',
      founderNotice: 'Hundeeffamaa: Zabbana Asfaayee (2026)'
    },
    drawer: {
      searchPlaceholder: 'Manneen maqaa ykn lakkoofsaan barbaadaa (1-15)...',
      housesHeading: 'Manoolee Gurguddoo 15n Tartiibaan (Houses 1-15)',
      profile: 'Piroofaayilii',
      tags: {
        h1: 'Banaadha',
        h2: 'Dhalata',
        h3: 'Goggansaa',
        h4: 'Icciitii',
        h5: 'Cidha',
        h6: 'Amantaa',
        h7: 'Nageenya',
        h8: 'Dandeettii',
        h9: 'Gabaa',
        h10: 'Barumsa',
        h11: 'Leenjii',
        h12: 'Saayikooloojii',
        h13: 'Dilaalaa',
        h14: 'Murtii',
        h15: 'Kaffaltii'
      }
    },
    houses: {
      h1: { title: '1. Mana Waloo Hunda', desc: 'Namni kamiyyuu bilbilaa fi jecha darbiin galmaa\'ee mari\'atu', roles: ['Miseensa Waloo', 'Gaggeessaa Marii', 'Dubbataa Olaanaa', 'Kabajamaa Dhaggeeffataa'] },
      h2: { title: '2. Mana Fira Dhiigaa', desc: 'Firoonni dhiigaa walitti qabamanii hidda dhalataa isaanii cimsu', roles: ['Abbaa Warraa', 'Eegaa Galmee Hidda Dhalataa', 'Miseensa Fira Dhiigaa', 'Jaarsa Biyyaa'] },
      h3: { title: '3. Mana Abbootii Taayitaa', desc: 'Hoggantoonni guddina fi nageenya biyyaa irratti mari\'atu', roles: ['Bakka Bu\'aa Uummataa / Ministira', 'Gorsaa Nageenyaa fi Misoomaa', 'Ergamaa Dippiloomaasii', 'Qorataa Imaammataa'] },
      h4: { title: '4. Mana Icciitii', desc: 'Qophii gaa\'elaa fi gorsawwan icciitii eegaman', roles: ['Qooda Fudhattoota Gaa\'elaa', 'Gorsaa Icciitii Jireenyaa', 'Miseensa Icciitii', 'Jaarsa Maatii'] },
      h5: { title: '5. Mana Cidhaa (Virtual Wedding)', desc: 'Sirna cidha toora interneetii, miseensota, jaarsolii fi sanada heeraa', roles: ['Misirroo / Misirrittii', 'Mizee', 'Jaarsa Bultii', 'Ragaa Cidhaa', 'Keessummaa Kabajaa'] },
      h6: { title: '6. Mana Amantaa', desc: 'Amantaan hundi akka amantii isaaniitti wal hubatanii fi wal barsiisan', roles: ['Barsiisaa Amantaa', 'Miseensa Barumsaa', 'Ergamaa Nageenyaa', 'Barataa'] },
      h7: { title: '7. Mana Nageenya Eegsisuu', desc: 'Poolisoonni nageenyaa fi qaamoleen tasgabbii sochiiwwan nagaa booressan hordofan', roles: ['Hoggana Nageenyaa', 'To\'ataa Nageenya Saayibarii', 'Miseensa Poolisii', 'Eegduu Hawaasaa'] },
      h8: { title: '8. Mana Agarsiisa Dandeettii', desc: 'Kalaqa teeknooloojii, uumamawwan muuziqaa fi dandeettiiwwan addunyaan dorgomu', roles: ['Dorgomaa Dandeettii', 'Abbaa Murtii Olaanaa', 'Leenjisaa Ogummaa', 'Sagalee Kennituu'] },
      h9: { title: '9. Mana Beeksisaa fi Gabaa', desc: 'Oomishtonni fi daldaltoonni viidiyoo fi sagaleen oomisha isaanii dhiyeessan', roles: ['Oomishaa Olaanaa', 'Daldalaa', 'Bitaa / Fayyadamaa', 'Qindeessaa Daldalaa'] },
      h10: { title: '10. Mana Barumsaa', desc: 'Barnoota gabaabaa afaanii, AI, teeknooloojii, shallaggii fi fayyaa', roles: ['Piroofeesara / Barsiisaa', 'Leenjisaa AI & Teeknooloojii', 'Qorataa / Barataa', 'Ogeessa Ogummaa'] },
      h11: { title: '11. Galma Leenjii Dhaabbilee', desc: 'Leenjii viidiyoo dhaabbilee mootummaa fi dhuunfaa addunyaatiif', roles: ['Hoggana Dhaabbataa', 'Daarektara Leenjii', 'Hojjetaa Leenji\'aa', 'Ogeessa Dandeettii'] },
      h12: { title: '12. Mana Yaala Saayikooloojii fi Gorsaa', desc: 'Tajaajila yaala sammuu fi gorsaa ogeessota waliin kallattiin', roles: ['Saayikooloojistii Kiliinikaa', 'Gorsaa Fayyaa Sammuu', 'Fayyadamaa / Dhukkubsataa', 'Qindeessaa Haaromsaa'] },
      h13: { title: '13. Mana Dilaalaa fi Barbaaddotaa', desc: 'Dilaalotaa fi maamiltoota walqunnamsiisuun dhimmoota isaanii raawwachiisan', roles: ['Dilaalaa Qabeenyaa Seeraa', 'Dhiyeessaa Qabeenyaa', 'Bitaa Kallattii', 'Gorsaa Daldalaa'] },
      h14: { title: '14. Mana Komii fi Murtii Seeraa', desc: 'Abbootiin seeraa komii dhiyaate dhaggeeffatanii murtii itti kennan', roles: ['Abbaa Murtii Seeraa', 'Abukaatoo Seeraa', 'Komii Dhiyeessaa', 'Himatamaa'] },
      h15: { title: '15. Mana Kaffaltii Tajaajilaa', desc: 'Kaffaltii ibsaa, bishaanii, geejjibaa fi tajaajila adda addaa', roles: ['Fayyadamaa Ibsaa fi Bishaanii', 'Ofiisara Kaffaltii', 'Qindeessaa Baankii', 'Fayyadamaa Telekoomii'] }
    }
  },
  ti: {
    appName: 'Oneworld',
    appSubtitle: 'ናይ ዓለምና ህዝብታት ሓባራዊ 15 ዓበይቲ ኣባይትን መድረኽ ፍልጠትን',
    dashboard: 'ዋና ዳሽቦርድ',
    installApp: 'ናብ ሞባይል ጽዓን (Install App)',
    installedNotice: 'እቲ ኣፕሊኬሽን ኣብ ሞባይልኩም ተጻዒኑ ኣሎ',
    signIn: 'እቶ (Sign In)',
    signUp: 'ተመዝገብ (Sign Up)',
    signOut: 'ውጻእ (Sign Out)',
    phoneNumber: 'ቁጽሪ ስልኪ',
    password: 'መሕለፊ ቃል (Password)',
    fullName: 'ምሉእ ስም',
    gender: 'ጾታ',
    age: 'ዕድመ',
    nationality: 'ዜግነት',
    address: 'ኣድራሻ / ከተማ',
    idNumber: 'ቁጽሪ መታወቒ / ፓስፖርት',
    roleTitle: 'ናይ ስልጣን መዓርግ / ሓላፍነት',
    photo: 'ናይ ገጽ ፎቶ',
    balance: 'ናይ ሕሳብ ተረፍ',
    royaltyPoints: 'ናይ ምንቅስቓስ ሮያሊቲ',
    reserveRule: '60% ንኣባላት · 10% ንባንክ · 10% ንመሃዚ (ዘበነ አስፍዬ) · 20% ንማሕበረሰብ',
    builderVaultTitle: 'ምስጢራዊ ካዝና መሃዚ (PIN 2026)',
    builderVaultDesc: 'ብዋና ዘበነ አስፍዬ ብኮድ 2026 ጥራሕ ዝኽፈት መዝገብ እቶት',
    enterPin: 'ናይ 2026 ምስጢር ቁጽሪ የእትዉ',
    unlock: 'ክፈት (Unlock)',
    locked: 'ብኮድ 2026 ዝተዓሸገ',
    offlineReady: 'ካብ ኢንተርኔት ወጻኢ ይሰርሕ (Offline Ready)',
    online: 'ቀጥታ ብመስመር (Online)',
    foundingManifesto: 'መትከልን ሕግን መምርሒ ምምስራት መድረኽ',
    founderName: 'ዘበነ አስፍዬ (Zebene Asfaye)',
    foundingDate: 'ጥቅምቲ 2026',
    nav: {
      h1: '1. ናይ ሓባር ቤት',
      h2: '2. ናይ ስጋ ዘመድ',
      h3: '3. ናይ መራሕቲ ቤት',
      h4: '4. ናይ ምስጢር ቤት',
      h5: '5. ናይ መርዓ ቤት',
      h6: '6. ናይ እምነት ቤት',
      h7: '7. ናይ ጸጥታ ቤት',
      h8: '8. ናይ ተውህቦ ምርኢት',
      h9: '9. ምልክታን ዕዳጋን',
      h10: '10. ቤት ትምህርቲ',
      h11: '11. ትካላዊ ስልጠና',
      h12: '12. ሳይኮሎጂን ምኽርን',
      h13: '13. ድላላን ፈላጊን',
      h14: '14. ጥርዓንን ፍርድን',
      h15: '15. ክፍሊት ኣገልግሎት',
      equb: 'ዲጂታል ዕቁብን ሎተሪን',
      games: 'ጸወታታት (ገበጣ)',
      bank: 'ባንክን ሮያሊቲን'
    },
    header: {
      live: 'ቀጥታ (Live)',
      installApp: 'ናብ ሞባይል ጽዓን',
      vault: 'ካዝና (2026)',
      profile: 'መገለጺ',
      openDashboard: 'ዳሽቦርድ ክፈት',
      selectLanguage: 'ቋንቋ ምረጹ'
    },
    banner: {
      title: 'Oneworld ኣፕሊኬሽን ኣብ ሞባይልኩም ጽዓኑ',
      subtitle: 'ኔትወርክ ኣብ ዘይብሉን ድኹም ኣብ ዝኾነሉን እዋን ብቐሊሉ ንኽሰርሕ ናብ ስክሪንኩም ጽዓኑ',
      badge: 'ቅልጡፍ & ኦፍላይን',
      button: 'ሕጂ ጽዓን (Install App)'
    },
    stageMedia: {
      regRequired: 'ናይቲ ቤት ኣባልነት ምዝገባ ግዴታ',
      joinPromptPrefix: 'ናብ',
      joinPromptSuffix: 'ንምእታው ኣባል ኩኑ',
      gateDesc: 'ናብዚ ቤት ኣቲኹም መንበር ንምሓዝ፣ ብቪድዮን ድምጽን ንምምይያጥ ኣባልነትኩም ኣረጋግጹ።',
      selectRole: 'እትውክልዎ ናይ ስራሕ ወይ ሓላፍነት ግደ',
      agreeBylaws: 'ሕግን ስርዓትን እቲ ቤት ኣኽቢረ ክሳተፍ ተሰማሚዐ ኣለኹ',
      registerBtn: 'ኣባል ኩን እሞ እቶ',
      liveHall: 'ናይ ቀጥታ ቪድዮን ድምጽን መድረኽ',
      active: 'ንጡፍ',
      seatsTitle: 'ናይቲ ቤት መቐመጢ መናብርቲ',
      seatsCount: 'ዝተታሕዙ',
      yourSeat: 'ንስኹም',
      occupied: 'ዝተታሕዘ',
      openSeat: 'ክፉት መንበር',
      takeSeat: 'መንበር ሓዙ',
      leaveSeat: 'መንበር ልቐቑ',
      micOn: 'ማይክ ዕጾ',
      micOff: 'ማይክ ክፈት',
      camOn: 'ቪድዮ ዕጾ',
      camOff: 'ቪድዮ ክፈት',
      sendGift: 'ህያብ ስደድ',
      speaking: 'ይዛረቡ ኣለዉ...'
    },
    roomStage: {
      allHalls: 'ኩሎም ኣዳራሻት',
      philosophy: 'ጽቡቕ ኣተሓሳስባ',
      tech: 'ቴክኖሎጂን AIን',
      politics: 'ፖለቲካን ኢኮኖሚን',
      charity: 'በጎ ኣድራጎት',
      community: 'ናይ ኣባላት ውልቀ ኣባይቲ',
      openSubHall: 'ውልቀ ኣዳራሽ ክፈት',
      numberedChairs: 'ናይቲ ኣዳራሽ ቁጽሪ ዘለዎም መናብርቲ',
      takeASeat: 'መንበር ሓዙ',
      leaveTheSeat: 'መንበር ልቐቑ',
      micMute: 'ማይክ ዕጾ',
      micUnmute: 'ማይክ ክፈት',
      camClose: 'ካሜራ ዕጾ',
      camOpen: 'ካሜራ ክፈት',
      sendGift: 'ህያብ ስደድ',
      inputPlaceholder: 'ብቋንቋኹም ሓሳብኩም ጽሓፉ...',
      send: 'ስደድ',
      liveBadge: 'ቀጥታ (Live)'
    },
    chairs: {
      seatPrefix: 'ኮረሻ #',
      occupiedChairs: 'ዝተታሕዙ ኮረሻታት፡',
      openSeat: 'ክፉት ኮረሻ',
      takeSeat: 'ኮረሻ ሓዝ',
      leaveSeat: 'ኮረሻ ሕደግ',
      you: 'ንስኻ',
      youOnSeat: 'ንስኻ ኣብ ኮረሻ #',
      youParticipant: 'ንስኻ (ተሳታፋይ)',
      host: 'መራሒ መድረኽ',
      leadSpeaker: 'ቀንዲ ተዛራባይ',
      activeMember: 'ተሳታፋይ ኣባል',
      speakingNow: 'ይዛረብ ኣሎ',
      micLive: 'ማይክራፎን በርሀ',
      micMuted: 'ድምጺ ተዓጽዩ',
      camOff: 'ካሜራ ተዓጽዩ',
      toggleWebcam: 'ቀጥታዊ ዌብካም',
      avatarMode: 'HD ኣቫታር',
      raiseHand: 'ኢድ ኣውጽእ',
      lowerHand: 'ኢድ ኣውርድ',
      audienceCount: 'ተሳተፍቲ',
      hostLabel: 'መራሒ፡',
      liveBadge: 'ቀጥታ (Live)'
    },
    charterModal: {
      title: 'ምምስራት፣ ሕግን መምርሕን መድረኽ «OneWorld» (Official Charter)',
      founderLabel: 'መስራቲ፡ ዘበነ አስፍዬ (Zebene Asfaye) · ጥቅምቲ 2026 ፈ',
      section1Title: 'ክፍሊ ፩፡ ኣዋጅ ምምስራትን ራእይን',
      section1Text1: 'እዚ «OneWorld» ዝተሰምየ ናይ 15 ኣባይቲ ሓባራዊ መድረኽ ደቂ ሰባት ብኢትዮጵያዊ መራሒ ራእይ ዘበነ አስፍዬ (Zebene Asfaye) ኣብ 2026 ዝተመስረተ ሉኣላዊ መድረኽ እዩ።',
      section1Text2: 'ቀንዲ ዕላማኡ ንህዝቢ ዓለም ብጽቡቕ ኣተሓሳስባ፣ ብቴክኖሎጂ፣ ብፖለቲካዊን ቁጠባዊን ሓሳባት ንምቅርራብን ሓድነት ንምህናጽን እዩ።',
      section2Title: 'ክፍሊ ፪፡ ሓለዋን ምፍላይን ሓበሬታ 15ቱ ኣባይቲ (Data Isolation)',
      section2Rule1: 'ምስጢራዊነት ሓበሬታ፡ ሓደ ቤት ካብ ካልእ ቤት ዝኾነ ሓበሬታ ክረክብ ኣይክእልን። ኩሉ ዘተታት ኣብቲ ቤቱ ጥራይ ዝተሓጽረ እዩ።',
      section2Rule2: 'ውዕል መርዓን ፍርድን፡ ኣብ ቤተ መርዓን ቤተ ፍርድን ዝግበር ውዕል ብዓለምለኸ ሕጊ ፍትሓብሄር ተመዝጊቡ ሕጋዊ ማሕተም ይወሃቦ።',
      section3Title: 'ክፍሊ ፫፡ ኣከፋፍላ ኣታዊ፣ ባንክን ኮሚሽን መሃዚን (60% / 10% / 10% / 20%)',
      section3Rule1: 'ቀጥታዊ ኣታዊ ንተሳተፍትን ኣባላትን (60%)፡ ኣባላት ብተሳትፎን ኣባላት ብምፍራይን ዘርክብዎ ኣታዊ 60% ቀጥታ ይኽፈል።',
      section3Rule2: 'መጠባበቒ ባንኪ (10%)፡ ብመምርሒ ንግዲ ባንኪ ኢትዮጵያን ብሄራዊ ባንክን ውሕስነት ዝኸውን 10% ይቕመጥ።',
      section3Rule3: 'ቀዋሚ ኣታዊ መሃዚ 10% (ምስጢራዊ ኮድ 2026)፡ ንመስራቲ ዘበነ አስፍዬ ኣብ ንግዲ ባንኪ ኢትዮጵያ (CBE) 1000167413618 ብኮድ 2026 ተሓልዩ ብቐጥታ ይውሕዝ።',
      section3Rule4: 'ዕቁብን ገበርቲ ሰናይን ማሕበረሰብ (20%)፡ ንሓባራዊ ፈንድ ማሕበረሰብ፣ ንድኻታትን ዕቁብ ንምሕያልን 20% ይውዕል።',
      understoodBtn: 'መምርሒ ተረዲአዮ ኣለኹ'
    },
    announcements: {
      liveTranslatorTitle: 'ኣውቶማቲክ ናይ ቀጥታ ተርጓሚ ድምጺ (Live Speech Translation)',
      liveTranslatorSubtitle: 'ዝኾነ ሰብ ብቋንቋኡ ክዛረብ ከሎ ብቋንቋኹም ብኡንብኡ ትሰምዑ',
      liveTranslationTo: 'ቀጥታዊ ትርጉም (ናብ ትግርኛ)፡',
      originalSpeech: 'መበቆል ዘረባ',
      speakTranslation: 'ብድምጺ ስምዑ',
      seatClaimed: 'ኮረሻ ብዓወት ተታሒዙ! ማይክራፎንን ቪድዮን ተኸፊቱ ኣሎ።',
      seatLeft: 'ኮረሻ ሓዲግኩም ናብ ተዓዛቢነት ተመሊስኩም።',
      insufficientFunds: 'ይቕሬታ፣ እኹል ሕሳብ የብልኩምን።',
      giftSent: 'ህያብ ብዓወት ተላኢኹ!',
      profileSaved: 'ናይ ኣባልነት ፕሮፋይልኩምን ፎቶኹምን ጸዲቑ ኣሎ!',
      vaultBtn: 'ምስጢራዊ ካዝና መሃዚ (PIN 2026)',
      charterBtn: 'ሕግን መምርሕን መድረኽ (Charter)',
      offlineReadyNotice: 'ብዘይ ኢንተርነት ይሰርሕ (Offline Ready)',
      founderNotice: 'መስራቲ፡ ዘበነ አስፍዬ (2026)'
    },
    drawer: {
      searchPlaceholder: 'ኣባይቲ ብስም ወይ ቁጽሪ ድለዩ (1-15)...',
      housesHeading: '15 ዓበይቲ ኣባይቲ ብቅደም ተኸተል (Houses 1-15)',
      profile: 'መገለጺ',
      tags: {
        h1: 'ክፉት',
        h2: 'ውልድና',
        h3: 'መሪሕነት',
        h4: 'ምስጢር',
        h5: 'መርዓ',
        h6: 'እምነት',
        h7: 'ጸጥታ',
        h8: 'ተውህቦ',
        h9: 'ዕዳጋ',
        h10: 'ትምህርቲ',
        h11: 'ስልጠና',
        h12: 'ሳይኮሎጂ',
        h13: 'ድላላ',
        h14: 'ፍርዲ',
        h15: 'ክፍሊት'
      }
    },
    houses: {
      h1: { title: '1. ናይ ሓባር ቤት', desc: 'ዝኾነ ሰብ ብስልክን ፓስዋርድን ተመዝጊቡ ዝመያየጠሉ ክፉት መድረኽ', roles: ['ናይ ሓባር ኣባል', 'መራሒ ምይይጥ', 'ዋና ተዛራባይ', 'ክቡር ተዓዛቢ'] },
      h2: { title: '2. ናይ ስጋ ዘመድ ቤት', desc: 'ናይ ስጋ ዝምድና ዘለዎም ተኣኪቦም ዝመያየጡሉን ዝተሓጋገዙሉን', roles: ['መራሒ ስድራ', 'ሓላዊ መዛግብቲ ወለዶ', 'ናይ ስጋ ዘመድ ኣባል', 'ሽማግለ'] },
      h3: { title: '3. ናይ መራሕቲ ቤት', desc: 'መራሕትን ሰበስልጣናትን ብዛዕባ ሃገር ምዕባለን ድሕንነትን ዝመያየጡሉ', roles: ['ተወካሊ ህዝቢ / ሚኒስተር', 'ኣማኻሪ ድሕንነትን ልምዓትን', 'ዲፕሎማት', 'ተንታኒ ፖሊሲ'] },
      h4: { title: '4. ናይ ምስጢር ቤት', desc: 'መርዓ ዝደልዩ ጽምዲታትን ምስጢረኛታትን ብተኣማንነት ዝመኽሩሉ', roles: ['ሓዳር ፈላጊ ጽምዲ', 'ኣማኻሪ ምስጢር ሂወት', 'ምስጢራዊ ተመኻኻሪ', 'ሽማግለ ስድራ'] },
      h5: { title: '5. ናይ መርዓ ቤት', desc: 'ቀጥታ ቪድዮ መርዓ፣ ሚዜታት፣ ሽማግለታት፣ ጥሎሽን ሕጋዊ ውዕል ሰነድን', roles: ['መርዓዊ / መርዓት', 'ሚዜ', 'ኣመርዓዊ ሽማግለ', 'መስኻሪ መርዓ', 'ክቡር ዕዱም'] },
      h6: { title: '6. ናይ እምነት ቤት', desc: 'ኩሎም እምነታት ከከም እምነቶም ተመዝጊቦም ዝመሃሃሩሉ መንፈሳዊ ማእከል', roles: ['መምህር ሃይማኖት', 'ተመራማሪ ኣባል', 'ኣምባሳደር ሰላም', 'ተምሃራይ'] },
      h7: { title: '7. ናይ ጸጥታ ቤት', desc: 'ፖሊስን ሓይልታት ጸጥታን ሰላም ንምሕላው ዝመያየጡሉ', roles: ['ሓላፊ ጸጥታ', 'ተቆጻጻሪ ሳይበር ድሕንነት', 'ኦፊሰር ፖሊስ', 'ሓላዊ ማሕበረሰብ'] },
      h8: { title: '8. ናይ ተውህቦ ምርኢት', desc: 'ቴክኖሎጂ፣ ሙዚቃ፣ ኮሜዲን ካልኦት ተውህቦታትን ዝወዳደሩሉ', roles: ['ተወዳዳሪ ተውህቦ', 'ዋና ዳኛ', 'ኣሰልጣኒ ጥበብ', 'ድምጺ ወሃቢ'] },
      h9: { title: '9. ምልክታን ዕዳጋን', desc: 'ኣፍረይትን ነጋዶን ፍርያቶም ብቪድዮን ድምጽን ዘፋልጡሉን ዝሸጡሉን', roles: ['ዋና ኣፍራዪ', 'ነጋዳይ', 'ዓዳጊ', 'ኣተሓባባሪ ንግዲ'] },
      h10: { title: '10. ቤት ትምህርቲ', desc: 'ቋንቋ፣ AI፣ ቴክኖሎጂ፣ ሕሳብን ጥዕናን ሓጸርቲ ትምህርትታት ዝወሃበሉ', roles: ['ፕሮፌሰር / መምህር', 'ኣሰልጣኒ AIን ቴክኖሎጂን', 'ተመራማሪ / ተምሃራይ', 'ክኢላ ጥበብ'] },
      h11: { title: '11. ትካላዊ ስልጠና መስጪ ኣዳራሽ', desc: 'ንመንግስታውን ዘይመንግስታውን ትካላት ናይ ቪድዮ ስልጠና', roles: ['ዋና ፈጻሚ ስራሕ', 'ዳይሬክተር ስልጠና', 'ሰልጣኒ ሰራሕተኛ', 'ክኢላ ዓቕሚ ህንጸት'] },
      h12: { title: '12. ሳይኮሎጂን ምኽርን ቤት', desc: 'ናይ ኣእምሮ ሕክምናን ምኽርን ብቀጥታ ቪድዮን ድምጽን', roles: ['ክሊኒካል ሳይኮሎጂስት', 'ኣማኻሪ ጥዕና ኣእምሮ', 'ተጠቃሚ / ተሓካሚ', 'ኣተሓባባሪ ምሕዋይ'] },
      h13: { title: '13. ድላላን ፈላጊን ቤት', desc: 'ደላሎን ተገልገልትን ብቀጥታ ተራኺቦም ጉዳዮም ዝፍጽሙሉ', roles: ['ሕጋዊ ደላሊ ንብረት', 'ኣቕራቢ ንብረት', 'ቀጥታ ዓዳጊ', 'ኣማኻሪ ንግዲ'] },
      h14: { title: '14. ጥርዓንን ፍርድን ቤት', desc: 'ዳያኑን ጥርዓን ዘለዎምን ተራኺቦም ፍርዲ ብሰነድ ዝረኽቡሉ', roles: ['ዳኛ ዕርቂ', 'ጠበቓን ኣማኻሪ ሕግን', 'ጥርዓን ኣቕራቢ', 'ተኸሳሲ'] },
      h15: { title: '15. ክፍሊት ኣገልግሎት ቤት', desc: 'ናይ መብራህቲ፣ ማይ፣ መጓዓዝያን ካልኦትን ክፍሊት', roles: ['ተጠቃሚ መብራህትን ማይን', 'ኦፊሰር ክፍሊት', 'ኣተሓባባሪ ባንክ', 'ተጠቃሚ ቴሌኮም'] }
    }
  },
  en: {
    appName: 'Oneworld',
    appSubtitle: 'Global 15 Sovereign Houses & Universal Knowledge Agora',
    dashboard: 'Main Dashboard',
    installApp: 'Install App on Phone',
    installedNotice: 'Application is installed on your device',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    phoneNumber: 'Phone Number',
    password: 'Password',
    fullName: 'Full Name',
    gender: 'Gender',
    age: 'Age',
    nationality: 'Nationality',
    address: 'Address / City',
    idNumber: 'National ID / Passport',
    roleTitle: 'Title / Responsibility',
    photo: 'Profile Photo',
    balance: 'Account Balance',
    royaltyPoints: 'Activity Royalties',
    reserveRule: '60% Members · 10% Bank · 10% Founder/Developer (Zebene Asfaye) · 20% Community',
    builderVaultTitle: 'Builder Sovereign Vault (PIN 2026)',
    builderVaultDesc: 'Founder Zebene Asfaye revenue record unlocked only with PIN 2026',
    enterPin: 'Enter PIN Code 2026',
    unlock: 'Unlock Vault',
    locked: 'Locked with PIN 2026',
    offlineReady: 'Offline Ready (Works without internet)',
    online: 'Live Stream Online',
    foundingManifesto: 'Founding Charter and Constitutional Bylaws',
    founderName: 'Zebene Asfaye (Founder)',
    foundingDate: 'October 2026',
    nav: {
      h1: '1. Universal Agora',
      h2: '2. Family Kinship',
      h3: '3. Sovereign Leadership',
      h4: '4. Confidential Sanctuary',
      h5: '5. Wedding & Matrimony',
      h6: '6. Faith & Wisdom',
      h7: '7. Security Chamber',
      h8: '8. Talent Arena',
      h9: '9. Global Marketplace',
      h10: '10. Academy & Education',
      h11: '11. Institutional Training',
      h12: '12. Mental Health & Clinic',
      h13: '13. Brokerage & Exchange',
      h14: '14. Judicial Tribunal',
      h15: '15. Utility Payments',
      equb: 'Digital Equb & Lottery',
      games: 'Games Arena (Gebeta)',
      bank: 'Bank & Royalties'
    },
    header: {
      live: 'Live Online',
      installApp: 'Install App',
      vault: 'Vault (2026)',
      profile: 'Profile',
      openDashboard: 'Open Dashboard',
      selectLanguage: 'Select Language'
    },
    banner: {
      title: 'Install Oneworld App On Your Device',
      subtitle: 'Works lightning-fast and offline even during poor network or disconnection',
      badge: 'Fast & Offline',
      button: 'Install App Now'
    },
    stageMedia: {
      regRequired: 'House Membership Registration Required',
      joinPromptPrefix: 'To enter',
      joinPromptSuffix: 'please register as an official member',
      gateDesc: 'To take a numbered seat, speak via high-definition microphone, and broadcast video in this house, verify your membership.',
      selectRole: 'Select Your Official Role / Capacity',
      agreeBylaws: 'I agree to uphold the rules, decorum, and bylaws of this house',
      registerBtn: 'Confirm Membership & Enter',
      liveHall: 'Live HD Video & Audio Assembly Stage',
      active: 'Active',
      seatsTitle: 'Numbered Assembly Seats',
      seatsCount: 'Claimed',
      yourSeat: 'You',
      occupied: 'Occupied',
      openSeat: 'Open Seat',
      takeSeat: 'Take a Seat',
      leaveSeat: 'Leave Seat',
      micOn: 'Mute Mic',
      micOff: 'Unmute Mic',
      camOn: 'Turn Video Off',
      camOff: 'Turn Video On',
      sendGift: 'Send Gift',
      speaking: 'Speaking now...'
    },
    roomStage: {
      allHalls: 'All Halls',
      philosophy: 'Good Philosophy',
      tech: 'Tech & AI',
      politics: 'Politics & Economy',
      charity: 'Charity & Relief',
      community: 'Member Private Halls',
      openSubHall: 'Open Sub-Hall',
      numberedChairs: 'Hall Numbered Chairs',
      takeASeat: 'Take a Seat',
      leaveTheSeat: 'Leave Seat',
      micMute: 'Mute Mic',
      micUnmute: 'Unmute Mic',
      camClose: 'Turn Video Off',
      camOpen: 'Turn Video On',
      sendGift: 'Send Gift',
      inputPlaceholder: 'Type in your language to speak...',
      send: 'Send',
      liveBadge: 'Live'
    },
    chairs: {
      seatPrefix: 'Seat #',
      occupiedChairs: 'Occupied Seats:',
      openSeat: 'Open Seat',
      takeSeat: 'Take Seat',
      leaveSeat: 'Leave Seat',
      you: 'You',
      youOnSeat: 'You on Seat #',
      youParticipant: 'You (Participant)',
      host: 'Stage Host',
      leadSpeaker: 'Lead Speaker',
      activeMember: 'Active Member',
      speakingNow: 'Speaking now',
      micLive: 'Mic Live',
      micMuted: 'Mic Muted',
      camOff: 'Camera Off',
      toggleWebcam: 'Live Webcam',
      avatarMode: 'HD Avatar',
      raiseHand: 'Raise Hand',
      lowerHand: 'Lower Hand',
      audienceCount: 'participants',
      hostLabel: 'Host:',
      liveBadge: 'Live'
    },
    charterModal: {
      title: 'OneWorld Founding Charter, Governance & Official Guidelines',
      founderLabel: 'Founder: Zebene Asfaye · October 2026',
      section1Title: 'Part I: Proclamation of Foundation & Vision',
      section1Text1: 'The OneWorld 15 Sovereign Houses platform was established in 2026 by visionary founder Zebene Asfaye as a sovereign global digital commons.',
      section1Text2: 'Its purpose is to unite the peoples of the world in goodwill, technological knowledge, civic consciousness, philanthropy, and mutual prosperity.',
      section2Title: 'Part II: Data Isolation & Sovereign Privacy of the 15 Houses',
      section2Rule1: 'Data Privacy: Complete isolation between houses. Deliberations and records in each house remain strictly bounded to that house.',
      section2Rule2: 'Civil Treaties & Arbitration: Marriages and adjudications carry international civil law codes and official judicial certification.',
      section3Title: 'Part III: Revenue Distribution, Banking & Builder Commission (60% / 10% / 10% / 20%)',
      section3Rule1: 'Direct Payout to Active Members (60%): Members receive 60% of revenues earned through participation, contributions, and community growth.',
      section3Rule2: 'Bank Reserve & Liquidity Guarantee (10%): 10% is held according to Commercial Bank of Ethiopia (CBE) and NBE directives.',
      section3Rule3: 'Builder Sovereign Revenue 10% (Code 2026): A permanent 10% royalty to Founder Zebene Asfaye transferred directly to CBE account 1000167413618 via protected 2026 key.',
      section3Rule4: 'Community Equb & Mutual Aid (20%): 20% dedicated to community equb pools, hardship relief, and philanthropic solidarity.',
      understoodBtn: 'I Understand & Agree to Guidelines'
    },
    announcements: {
      liveTranslatorTitle: 'Automatic Live Speech Translation',
      liveTranslatorSubtitle: 'Real-time two-way voice and text translation in your chosen language',
      liveTranslationTo: 'Live Translation (to English):',
      originalSpeech: 'Original Speech',
      speakTranslation: 'Listen to Voice',
      seatClaimed: 'Seat successfully claimed! Mic and camera are active.',
      seatLeft: 'You left the seat and returned to audience mode.',
      insufficientFunds: 'Sorry, insufficient balance in your wallet.',
      giftSent: 'Gift sent successfully!',
      profileSaved: 'Membership profile and photo successfully verified!',
      vaultBtn: 'Builder Sovereign Vault (PIN 2026)',
      charterBtn: 'Founding Charter & Guidelines',
      offlineReadyNotice: 'Works Offline (Offline Ready)',
      founderNotice: 'Founder: Zebene Asfaye (2026)'
    },
    drawer: {
      searchPlaceholder: 'Search houses by title or number (1-15)...',
      housesHeading: '15 Sovereign Houses in Order (Houses 1-15)',
      profile: 'Profile',
      tags: {
        h1: 'Open',
        h2: 'Kinship',
        h3: 'Leadership',
        h4: 'Sanctuary',
        h5: 'Wedding',
        h6: 'Faith',
        h7: 'Security',
        h8: 'Talent',
        h9: 'Market',
        h10: 'Academy',
        h11: 'Training',
        h12: 'Clinic',
        h13: 'Brokerage',
        h14: 'Tribunal',
        h15: 'Payments'
      }
    },
    houses: {
      h1: { title: '1. Universal Public Agora', desc: 'Open world assembly where registered global citizens gather to deliberate and connect', roles: ['Agora Citizen', 'Discussion Moderator', 'Keynote Speaker', 'Honored Audience'] },
      h2: { title: '2. House of Blood Kinship', desc: 'Genealogy, family lineage exploration, and kinship strengthening for related bloodlines', roles: ['Family Head', 'Genealogy Registrar', 'Kinship Member', 'Council Elder'] },
      h3: { title: '3. Chamber of Sovereign Leadership', desc: 'High council where world leaders, ministers, and diplomats converse on security and progress', roles: ['Public Minister / Envoy', 'Strategic Advisor', 'Diplomatic Ambassador', 'Policy Analyst'] },
      h4: { title: '4. Sanctuary of Confidential Courtship', desc: 'Confidential courtship, matrimony preparation, and discreet personal consultations', roles: ['Courtship Candidate', 'Matrimony Counselor', 'Confidential Confidant', 'Family Elder'] },
      h5: { title: '5. Virtual Wedding & Legal Matrimony Hall', desc: 'Live virtual weddings with bridal party, elders, dowry, and internationally valid marriage contracts', roles: ['Bride / Groom', 'Bridal Party Member', 'Presiding Elder', 'Marriage Witness', 'Guest of Honor'] },
      h6: { title: '6. House of Faith & Wisdom', desc: 'Spiritual fellowship and harmonious interfaith knowledge exchange in dedicated chapels', roles: ['Faith Leader / Priest', 'Scholar / Researcher', 'Peace Ambassador', 'Student of Faith'] },
      h7: { title: '7. Cyber Security & Peacekeeping Chamber', desc: 'Coordinated chamber for security police, peacekeepers, and moderators to maintain order', roles: ['Security Commander', 'Cyber Security Warden', 'Law Enforcement Officer', 'Community Guardian'] },
      h8: { title: '8. Global Talent Arena', desc: 'Live stage for technology innovation, leadership, vocal performance, comedy, and arts', roles: ['Talent Competitor', 'Head Judge', 'Artistic Mentor', 'Voting Audience'] },
      h9: { title: '9. World Expo & Marketplace', desc: 'High-definition video product showcase, direct manufacturer negotiation, and commerce', roles: ['Manufacturer / Exporter', 'Merchant / Retailer', 'Direct Buyer', 'Trade Coordinator'] },
      h10: { title: '10. Global Academy of Knowledge', desc: 'Intensive courses in languages, AI, computing, mathematics, health, and ancient sciences', roles: ['University Professor', 'AI & Tech Instructor', 'Researcher / Scholar', 'Student'] },
      h11: { title: '11. Institutional Training Hall', desc: 'Certified video training programs for public, private, and international institutions', roles: ['Executive Director', 'Training Coordinator', 'Professional Trainee', 'Capacity Specialist'] },
      h12: { title: '12. Clinic of Psychology & Treatment', desc: 'Licensed psychological counseling, mental wellness, and therapeutic video sessions', roles: ['Clinical Psychologist', 'Mental Health Counselor', 'Client / Patient', 'Recovery Coordinator'] },
      h13: { title: '13. Brokerage & Direct Matching Exchange', desc: 'Certified real estate, auto, and commodity brokers linking buyers and sellers seamlessly', roles: ['Licensed Broker', 'Asset Provider', 'Direct Buyer / Tenant', 'Trade Consultant'] },
      h14: { title: '14. High Judicial & Arbitration Tribunal', desc: 'Official arbiters and certified judges resolving claims with binding audio-visual decrees', roles: ['Senior Arbitrator / Judge', 'Legal Advocate', 'Claimant / Complainant', 'Respondent'] },
      h15: { title: '15. Global Utility Payment Hub', desc: 'Instant settlement for power, water, telecom, and transit via CBE and Telebirr', roles: ['Utility Subscriber', 'Payment Desk Officer', 'Bank Coordinator', 'Telecom User'] }
    }
  },
  fr: {
    appName: 'Oneworld',
    appSubtitle: 'Les 15 Maisons Souveraines et l\'Agora Universelle du Savoir',
    dashboard: 'Tableau de Bord',
    installApp: 'Installer l\'Application',
    installedNotice: 'L\'application est installée sur votre appareil',
    signIn: 'Connexion',
    signUp: 'S\'inscrire',
    signOut: 'Déconnexion',
    phoneNumber: 'Numéro de Téléphone',
    password: 'Mot de Passe',
    fullName: 'Nom Complet',
    gender: 'Genre',
    age: 'Âge',
    nationality: 'Nationalité',
    address: 'Adresse / Ville',
    idNumber: 'Numéro d\'Identité / Passeport',
    roleTitle: 'Titre / Responsabilité',
    photo: 'Photo de Profil',
    balance: 'Solde du Compte',
    royaltyPoints: 'Points de Redevance',
    reserveRule: '60% Membres · 10% Banque · 10% Fondateur (Zebene Asfaye) · 20% Communauté',
    builderVaultTitle: 'Coffre Souverain du Créateur (PIN 2026)',
    builderVaultDesc: 'Registre de revenus du fondateur Zebene Asfaye protégé par le PIN 2026',
    enterPin: 'Entrez le code PIN 2026',
    unlock: 'Déverrouiller',
    locked: 'Verrouillé avec le code 2026',
    offlineReady: 'Prêt hors ligne (sans Internet)',
    online: 'En direct sur le web',
    foundingManifesto: 'Charte Fondatrice et Statuts Constitutionnels',
    founderName: 'Zebene Asfaye (Fondateur)',
    foundingDate: 'Octobre 2026',
    nav: {
      h1: '1. Agora Universelle',
      h2: '2. Lignée & Famille',
      h3: '3. Haute Gouvernance',
      h4: '4. Sanctuaire Secret',
      h5: '5. Mariage Virtuel',
      h6: '6. Foi & Spiritualité',
      h7: '7. Sécurité & Paix',
      h8: '8. Scène des Talents',
      h9: '9. Marché Mondial',
      h10: '10. Académie Globale',
      h11: '11. Formation d\'Élite',
      h12: '12. Thérapie & Conseil',
      h13: '13. Courtage & Échange',
      h14: '14. Tribunal & Justice',
      h15: '15. Paiement de Services',
      equb: 'Tontine & Loterie',
      games: 'Arène de Jeux',
      bank: 'Banque & Droits'
    },
    header: {
      live: 'En Direct',
      installApp: 'Installer',
      vault: 'Coffre (2026)',
      profile: 'Profil',
      openDashboard: 'Ouvrir le Tableau de Bord',
      selectLanguage: 'Choisir la Langue'
    },
    banner: {
      title: 'Installez l\'Application Oneworld sur votre Téléphone',
      subtitle: 'Fonctionne à la vitesse de l\'éclair même sans connexion ou avec un réseau faible',
      badge: 'Rapide & Hors-Ligne',
      button: 'Installer Maintenant'
    },
    stageMedia: {
      regRequired: 'Adhésion Obligatoire à cette Maison',
      joinPromptPrefix: 'Pour entrer dans',
      joinPromptSuffix: 'veuillez vous inscrire en tant que membre',
      gateDesc: 'Pour occuper un siège numéroté, activer le microphone et diffuser en vidéo, confirmez votre adhésion.',
      selectRole: 'Sélectionnez Votre Rôle / Fonction',
      agreeBylaws: 'J\'accepte de respecter les statuts et règlements de cette maison',
      registerBtn: 'Confirmer l\'Adhésion & Entrer',
      liveHall: 'Scène Vidéo HD et Audio en Direct',
      active: 'Actif',
      seatsTitle: 'Sièges Numérotés de l\'Assemblée',
      seatsCount: 'Occupés',
      yourSeat: 'Vous',
      occupied: 'Occupé',
      openSeat: 'Siège Libre',
      takeSeat: 'Prendre un Siège',
      leaveSeat: 'Quitter le Siège',
      micOn: 'Couper Micro',
      micOff: 'Activer Micro',
      camOn: 'Couper Caméra',
      camOff: 'Activer Caméra',
      sendGift: 'Offrir un Cadeau',
      speaking: 'Prend la parole...'
    },
    roomStage: {
      allHalls: 'Toutes les Salles',
      philosophy: 'Philosophie & Pensée',
      tech: 'Technologie & IA',
      politics: 'Politique & Économie',
      charity: 'Bienfaisance',
      community: 'Salles Privées des Membres',
      openSubHall: 'Créer une Sous-Salle',
      numberedChairs: 'Chaises Numérotées de l\'Agora',
      takeASeat: 'Prendre Place',
      leaveTheSeat: 'Libérer le Siège',
      micMute: 'Couper Micro',
      micUnmute: 'Activer Micro',
      camClose: 'Fermer Caméra',
      camOpen: 'Ouvrir Caméra',
      sendGift: 'Envoyer Cadeau',
      inputPlaceholder: 'Écrivez dans votre langue pour vous exprimer...',
      send: 'Envoyer',
      liveBadge: 'En Direct'
    },
    chairs: {
      seatPrefix: 'Siège #',
      occupiedChairs: 'Sièges occupés :',
      openSeat: 'Siège libre',
      takeSeat: 'Prendre un siège',
      leaveSeat: 'Quitter le siège',
      you: 'Vous',
      youOnSeat: 'Vous au siège #',
      youParticipant: 'Vous (Participant)',
      host: 'Hôte de scène',
      leadSpeaker: 'Intervenant principal',
      activeMember: 'Membre actif',
      speakingNow: 'En train de parler',
      micLive: 'Micro actif',
      micMuted: 'Micro muet',
      camOff: 'Caméra éteinte',
      toggleWebcam: 'Webcam directe',
      avatarMode: 'Avatar HD',
      raiseHand: 'Lever la main',
      lowerHand: 'Baisser la main',
      audienceCount: 'participants',
      hostLabel: 'Hôte :',
      liveBadge: 'En direct (Live)'
    },
    charterModal: {
      title: 'Charte constitutive, gouvernance et directives officielles de OneWorld',
      founderLabel: 'Fondateur : Zebene Asfaye · Octobre 2026',
      section1Title: 'Partie I : Proclamation constitutive et vision',
      section1Text1: 'La plateforme des 15 Maisons Souveraines OneWorld a été fondée en 2026 par le visionnaire éthiopien Zebene Asfaye.',
      section1Text2: 'Son but est d\'unir les peuples dans la bienveillance, la technologie, la conscience civique et la solidarité.',
      section2Title: 'Partie II : Isolation des données et souveraineté des 15 Maisons',
      section2Rule1: 'Confidentialité : Aucune maison ne peut accéder aux données des autres. Toutes les délibérations restent strictement isolées.',
      section2Rule2: 'Actes civils et arbitrage : Les mariages et jugements portent des numéros du droit civil international certifiés.',
      section3Title: 'Partie III : Répartition des revenus (60% / 10% / 10% / 20%)',
      section3Rule1: 'Revenus directs aux membres (60%) : Les membres perçoivent 60% des gains issus de leur participation et expansion.',
      section3Rule2: 'Réserve bancaire de garantie (10%) : Conforme aux directives de la CBE et de la Banque Nationale.',
      section3Rule3: 'Revenu du fondateur 10% (Code 2026) : Reversé à Zebene Asfaye sur le compte CBE 1000167413618 sécurisé par le code 2026.',
      section3Rule4: 'Equb et solidarité communautaire (20%) : Dédié aux fonds d\'entraide mutuelle et de bienfaisance.',
      understoodBtn: 'J\'ai compris les directives'
    },
    announcements: {
      liveTranslatorTitle: 'Traduction vocale en direct automatique',
      liveTranslatorSubtitle: 'Chacun parle sa langue et vous l\'entendez instantanément dans la vôtre',
      liveTranslationTo: 'Traduction en direct (en français) :',
      originalSpeech: 'Discours original',
      speakTranslation: 'Écouter la voix',
      seatClaimed: 'Siège occupé avec succès ! Micro et caméra activés.',
      seatLeft: 'Vous avez libéré votre siège et êtes en mode auditeur.',
      insufficientFunds: 'Désolé, solde insuffisant dans votre portefeuille.',
      giftSent: 'Cadeau virtuel envoyé avec succès !',
      profileSaved: 'Profil et photo de membre vérifiés avec succès !',
      vaultBtn: 'Coffre souverain du créateur (PIN 2026)',
      charterBtn: 'Charte et règlement officiel',
      offlineReadyNotice: 'Fonctionne hors-ligne (Offline Ready)',
      founderNotice: 'Fondateur : Zebene Asfaye (2026)'
    },
    drawer: {
      searchPlaceholder: 'Rechercher une maison par nom ou numéro (1-15)...',
      housesHeading: 'Les 15 Maisons Souveraines dans l\'Ordre (1-15)',
      profile: 'Profil',
      tags: {
        h1: 'Ouvert',
        h2: 'Famille',
        h3: 'Pouvoir',
        h4: 'Secret',
        h5: 'Mariage',
        h6: 'Foi',
        h7: 'Sécurité',
        h8: 'Talents',
        h9: 'Marché',
        h10: 'Études',
        h11: 'Formation',
        h12: 'Thérapie',
        h13: 'Courtage',
        h14: 'Justice',
        h15: 'Paiement'
      }
    },
    houses: {
      h1: { title: '1. Agora Universelle Publique', desc: 'Assemblée mondiale ouverte à tous les citoyens après inscription téléphonique', roles: ['Citoyen de l\'Agora', 'Modérateur', 'Orateur Principal', 'Auditeur d\'Honneur'] },
      h2: { title: '2. Maison de la Lignée Familiale', desc: 'Généalogie et renforcement des liens de parenté et du patrimoine familial', roles: ['Chef de Famille', 'Archiviste de Lignée', 'Membre de la Parenté', 'Ancien du Conseil'] },
      h3: { title: '3. Conseil Souverain des Dirigeants', desc: 'Haut sommet des hommes d\'État, diplomates et ministres pour la paix et le progrès', roles: ['Ministre d\'État', 'Conseiller Stratégique', 'Ambassadeur Diplomatique', 'Analyste Politique'] },
      h4: { title: '4. Sanctuaire Secret de Rencontre', desc: 'Lieu confidentiel pour les prétendants au mariage et consultations discrètes', roles: ['Candidat au Mariage', 'Conseiller Conjugal', 'Confident Protégé', 'Ancien de la Famille'] },
      h5: { title: '5. Salle de Mariage Virtuel et Contrat Légal', desc: 'Cérémonie de mariage en direct avec témoins, dot et contrat juridique international', roles: ['Marié / Mariée', 'Témoin de Mariage', 'Doyen Célébrant', 'Témoin Légal', 'Invité d\'Honneur'] },
      h6: { title: '6. Maison de la Foi et de la Paix', desc: 'Études spirituelles et dialogue interreligieux pacifique pour toutes les croyances', roles: ['Guide Spirituel', 'Chercheur en Théologie', 'Ambassadeur de la Paix', 'Disciple'] },
      h7: { title: '7. Chambre de Sécurité et de Paix Cybernétique', desc: 'Forces de l\'ordre et policiers pour préserver l\'harmonie et la tranquillité publique', roles: ['Commandant de la Sécurité', 'Inspecteur Cybersécurité', 'Officier de Police', 'Gardien Communautaire'] },
      h8: { title: '8. Scène des Talents Mondiaux', desc: 'Compétition en direct d\'inventions technologiques, de musique, de leadership et d\'art', roles: ['Candidat Talentueux', 'Juge Principal', 'Mentor Artistique', 'Membre du Vote'] },
      h9: { title: '9. Foire Commerciale et Marché Mondial', desc: 'Présentation de produits en vidéo haute définition et transactions directes', roles: ['Producteur Exportateur', 'Commerçant Détaillant', 'Acheteur Direct', 'Négociateur Commercial'] },
      h10: { title: '10. Académie Globale du Savoir', desc: 'Formations intensives en IA, langues, sciences, mathématiques et médecine', roles: ['Professeur d\'Université', 'Instructeur IA & Tech', 'Chercheur / Étudiant', 'Maître Artisan'] },
      h11: { title: '11. Salle de Formation Institutionnelle', desc: 'Séances de perfectionnement vidéo pour entreprises et institutions d\'État', roles: ['Directeur Général', 'Directeur de Formation', 'Cadre en Stage', 'Expert en Capacités'] },
      h12: { title: '12. Clinique de Psychologie et Soins Mentaux', desc: 'Consultations thérapeutiques vidéo certifiées pour la santé mentale et le bien-être', roles: ['Psychologue Clinicien', 'Conseiller en Santé Mentale', 'Patient / Bénéficiaire', 'Coordinateur Thérapeutique'] },
      h13: { title: '13. Bourse de Courtage et Mise en Relation', desc: 'Courtiers certifiés facilitant les transactions immobilières, automobiles et commerciales', roles: ['Courtier Agréé', 'Fournisseur de Biens', 'Acheteur Direct', 'Conseiller d\'Affaires'] },
      h14: { title: '14. Tribunal Judiciaire et Arbitrage', desc: 'Magistrats et arbitres rendant des jugements légaux équitables sur documents et vidéo', roles: ['Juge Arbitre', 'Avocat Conseil', 'Plaignant', 'Défendeur'] },
      h15: { title: '15. Centre de Paiement des Services Publics', desc: 'Règlement instantané des factures d\'eau, d\'électricité et de transport via les banques', roles: ['Abonné Eau & Électricité', 'Agent de Caisse', 'Coordinateur Bancaire', 'Client Télécom'] }
    }
  },
  zh: {
    appName: 'Oneworld',
    appSubtitle: '世界人民共同的15大支柱大厅与全球知识大会堂',
    dashboard: '主控制台',
    installApp: '安装到手机 (Install App)',
    installedNotice: '应用已成功安装在您的设备上',
    signIn: '登录',
    signUp: '注册',
    signOut: '退出',
    phoneNumber: '手机号码',
    password: '密码',
    fullName: '真实姓名',
    gender: '性别',
    age: '年龄',
    nationality: '国籍',
    address: '地址 / 所在城市',
    idNumber: '身份证 / 护照号码',
    roleTitle: '职务 / 头衔',
    photo: '个人照片',
    balance: '账户余额',
    royaltyPoints: '活跃收益积分',
    reserveRule: '60% 归会员 · 10% 归银行 · 10% 归创始人(Zebene Asfaye) · 20% 归公共发展',
    builderVaultTitle: '创建者主权金库 (PIN 2026)',
    builderVaultDesc: '创始人 Zebene Asfaye 的主权金库，仅凭 2026 密码开启',
    enterPin: '请输入 2026 密钥',
    unlock: '开启金库',
    locked: '已由 2026 密码锁定',
    offlineReady: '离线就绪 (无网络亦可秒开)',
    online: '实时在线网络',
    foundingManifesto: '平台宪章与组织基本法',
    founderName: 'Zebene Asfaye (创始人)',
    foundingDate: '2026年10月',
    nav: {
      h1: '1. 全球议会中心',
      h2: '2. 家族血缘之家',
      h3: '3. 国家领袖峰会',
      h4: '4. 秘密咨询圣所',
      h5: '5. 线上婚礼大殿',
      h6: '6. 信仰与灵性之庭',
      h7: '7. 全球安全理事室',
      h8: '8. 世界达人秀场',
      h9: '9. 国际商业博览',
      h10: '10. 全球知识学院',
      h11: '11. 组织机构研训院',
      h12: '12. 心理咨询诊所',
      h13: '13. 商业撮合与中介',
      h14: '14. 司法仲裁法庭',
      h15: '15. 公共事业账单支付',
      equb: '数字互助基金与彩票',
      games: '智慧游戏竞技场',
      bank: '银行与分成金库'
    },
    header: {
      live: '实时在线',
      installApp: '安装应用',
      vault: '金库 (2026)',
      profile: '个人主页',
      openDashboard: '打开控制台',
      selectLanguage: '选择语言'
    },
    banner: {
      title: '将 Oneworld 应用安装到您的手机',
      subtitle: '在网络薄弱或完全离线时也能零延迟极速开启',
      badge: '极速 & 离线可用',
      button: '立即安装应用'
    },
    stageMedia: {
      regRequired: '必须登记该大厅专属会员资格',
      joinPromptPrefix: '若要进入',
      joinPromptSuffix: '，请先登记为正式会员',
      gateDesc: '登记专属席位后，即可入座编号席、开启高清麦克风并进行音视频现场交流。',
      selectRole: '请选择您在大厅的职务与代表身份',
      agreeBylaws: '我同意遵守本大厅的规则、纪律与国际行为准则',
      registerBtn: '确认会员身份并进入',
      liveHall: '实时高清音视频在线议政大殿',
      active: '运行中',
      seatsTitle: '大殿专属编号席位',
      seatsCount: '已就座',
      yourSeat: '您本人',
      occupied: '已有代表',
      openSeat: '空席',
      takeSeat: '申请入座',
      leaveSeat: '离开席位',
      micOn: '关闭麦克风',
      micOff: '开启麦克风',
      camOn: '关闭摄像头',
      camOff: '开启摄像头',
      sendGift: '赠送礼物',
      speaking: '正在发言...'
    },
    roomStage: {
      allHalls: '全部大殿',
      philosophy: '崇高思想',
      tech: '科技与AI',
      politics: '政治与经济',
      charity: '公益慈善',
      community: '会员私享大厅',
      openSubHall: '创建个人专属厅',
      numberedChairs: '大厅按序排列专属席位',
      takeASeat: '入座发言',
      leaveTheSeat: '让出席位',
      micMute: '麦克风静音',
      micUnmute: '开启麦克风',
      camClose: '关闭视频',
      camOpen: '开启视频',
      sendGift: '送出礼物',
      inputPlaceholder: '用您熟悉的母语输入发言内容...',
      send: '发送',
      liveBadge: '直播中'
    },
    chairs: {
      seatPrefix: '座位 #',
      occupiedChairs: '已占用座位：',
      openSeat: '空座位',
      takeSeat: '入座',
      leaveSeat: '离座',
      you: '您',
      youOnSeat: '您在座位 #',
      youParticipant: '您（参与者）',
      host: '舞台主持',
      leadSpeaker: '主讲人',
      activeMember: '参会成员',
      speakingNow: '正在发言',
      micLive: '麦克风已开',
      micMuted: '麦克风已静音',
      camOff: '摄像头已关',
      toggleWebcam: '实时摄像头',
      avatarMode: '高清头像',
      raiseHand: '举手',
      lowerHand: '放下手',
      audienceCount: '位参与者',
      hostLabel: '主持人：',
      liveBadge: '直播中'
    },
    charterModal: {
      title: '«OneWorld（世界大同）» 创立宪章、法规与官方指引',
      founderLabel: '创始人：泽贝内·阿斯法耶 (Zebene Asfaye) · 2026年10月',
      section1Title: '第一部分：成立公告与崇高愿景',
      section1Text1: 'OneWorld十五主屋数字平台由埃塞俄比亚远见者泽贝内·阿斯法耶于2026年创立，旨在构建全人类主权社区。',
      section1Text2: '其宗旨是以全方位善念、科技知识、经济协作与慈善互助，凝聚全球各族人民，共建和平与繁荣。',
      section2Title: '第二部分：十五主屋数据完全隔离与主权隐私 (Data Isolation)',
      section2Rule1: '数据隐私：各主屋之间数据完全隔离，绝不互通。各项商议与记录仅限于各自所属空间。',
      section2Rule2: '民事条约与法律仲裁：婚礼堂与仲裁法庭出具的证书具备国际民法规范编号与法律公证效力。',
      section3Title: '第三部分：收益分配、银行准备金与开发者收益 (60% / 10% / 10% / 20%)',
      section3Rule1: '参与成员直接收益 (60%)：平台成员通过参与讨论与社区扩展获得的收益，60%直接结算发放。',
      section3Rule2: '银行保障准备金 (10%)：依埃塞俄比亚商业银行及国家银行指引，计提10%流动性安全准备金。',
      section3Rule3: '开发者固定收益 10% (保密2026代码)：创始人泽贝内·阿斯法耶于CBE银行账户 1000167413618 直通享有。',
      section3Rule4: '社区互助金与慈善基金 (20%)：用于全人类互助会、扶贫助困与公益事业发展。',
      understoodBtn: '我已清楚理解本指引与章程'
    },
    announcements: {
      liveTranslatorTitle: '实时双向语音与文字自动翻译',
      liveTranslatorSubtitle: '人人可使用母语交流，您将即刻听到和看到已翻译的文字与语音',
      liveTranslationTo: '实时翻译（中文）：',
      originalSpeech: '原始发言',
      speakTranslation: '语音朗读翻译',
      seatClaimed: '已成功入座！麦克风与摄像头已激活。',
      seatLeft: '您已离座，返回听众模式。',
      insufficientFunds: '抱歉，您的账户余额不足。',
      giftSent: '虚拟礼物赠送成功！',
      profileSaved: '会员资料与头像已成功核验保存！',
      vaultBtn: '开发者专属金库 (PIN 2026)',
      charterBtn: '平台宪章与行为准则',
      offlineReadyNotice: '支持完全离线运行 (Offline Ready)',
      founderNotice: '创始人：泽贝内·阿斯法耶 (2026)'
    },
    drawer: {
      searchPlaceholder: '输入大厅名称或编号搜索 (1-15)...',
      housesHeading: '15大主权大殿全景列表 (1-15)',
      profile: '个人信息',
      tags: {
        h1: '开放',
        h2: '血缘',
        h3: '领袖',
        h4: '机密',
        h5: '婚礼',
        h6: '信仰',
        h7: '安全',
        h8: '才艺',
        h9: '贸易',
        h10: '学院',
        h11: '培训',
        h12: '心理',
        h13: '中介',
        h14: '仲裁',
        h15: '缴费'
      }
    },
    houses: {
      h1: { title: '1. 全球议会中心', desc: '全世界人民凭手机号与密码即可进入的开放式公共交流大殿', roles: ['议会公民代表', '讨论主持人', '主旨演讲代表', '列席贵宾'] },
      h2: { title: '2. 家族血缘之家', desc: '宗族血亲相聚、家谱编撰与宗族纽带建设', roles: ['家族长辈', '族谱档案主管', '家族直系成员', '宗族长老'] },
      h3: { title: '3. 国家领袖峰会', desc: '各国领袖、政府政要与战略家共同研讨国家治理与和平发展的高级殿堂', roles: ['政府部长 / 特使', '国家发展战略顾问', '外交使节', '政策分析首席'] },
      h4: { title: '4. 秘密咨询圣所', desc: '寻觅良缘的伴侣与重要咨询者保密沟通的庇护所', roles: ['婚恋候选人', '婚姻心理导师', '受保护咨询者', '德高望重的长辈'] },
      h5: { title: '5. 线上婚礼大殿', desc: '多国亲友实时视频观礼，具国际法律效力的婚约缔结圣殿', roles: ['新郎 / 新娘', '伴郎 / 伴娘', '主婚长老', '法定结婚证人', '特邀嘉宾'] },
      h6: { title: '6. 信仰与灵性之庭', desc: '各宗教信仰相互尊重，深入研习经训的精神文化中心', roles: ['宗教导师 / 祭司', '神学研究学者', '世界和平使者', '修学者'] },
      h7: { title: '7. 全球安全理事室', desc: '各国维和警察与安全官员协同维持网络秩序与和平安宁', roles: ['维和安全司令', '网络秩序监督官', '执法警官', '社区守护代表'] },
      h8: { title: '8. 世界达人秀场', desc: '科技创新、领袖魅力、音乐、喜剧与艺术达人实时竞赛舞台', roles: ['参赛达人', '主评审', '艺术指导导师', '大众投票代表'] },
      h9: { title: '9. 国际商业博览', desc: '高清视频展示商品，生产商与全球买家直接洽谈交易的大市场', roles: ['生产制造商 / 出口商', '批发零售商', '直接采购商', '商贸谈判主管'] },
      h10: { title: '10. 全球知识学院', desc: '密集传授多国语言、人工智能、计算机、数学与医疗短期课程', roles: ['大学教授', 'AI与前沿科技导师', '研究员 / 学员', '名匠大师'] },
      h11: { title: '11. 组织机构研训院', desc: '面向政府与跨国企业机构的高清视频专业能力培训中心', roles: ['机构首席执行官', '培训发展总监', '参训骨干', '能力建设专家'] },
      h12: { title: '12. 心理咨询诊所', desc: '资深心理医生与心理咨询师一对一视频疏导与治疗', roles: ['临床心理医生', '心理健康顾问', '求助来访者', '心理康复专员'] },
      h13: { title: '13. 商业撮合与中介', desc: '持牌房地产、汽车及大宗物资经纪人高效匹配买卖双方', roles: ['持牌专业经纪人', '货源及资产方', '直接买方 / 承租人', '商业撮合顾问'] },
      h14: { title: '14. 司法仲裁法庭', desc: '权威法官与仲裁员为纠纷出具具法律约束力的视听判决书', roles: ['首席仲裁法官', '出庭律师', '申诉原告', '答辩被告'] },
      h15: { title: '15. 公共事业账单支付', desc: '快捷缴纳水、电、通信及交通费用，直通商业银行与Telebirr', roles: ['公用事业用户', '缴费窗口主管', '银行协同员', '通信网络用户'] }
    }
  },
  ar: {
    appName: 'Oneworld',
    appSubtitle: 'المنازل السيادية الخمسة عشر وصرح المعرفة الشامل لشعوب العالم',
    dashboard: 'لوحة التحكم الرئيسية',
    installApp: 'تثبيت التطبيق على الهاتف',
    installedNotice: 'التطبيق مثبت بنجاح على جهازك',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب جديد',
    signOut: 'تسجيل الخروج',
    phoneNumber: 'رقم الهاتف',
    password: 'كلمة المرور',
    fullName: 'الاسم الكامل',
    gender: 'الجنس',
    age: 'العمر',
    nationality: 'الجنسية',
    address: 'العنوان / المدينة',
    idNumber: 'رقم الهوية الوطنية / جواز السفر',
    roleTitle: 'المسمى الوظيفي / المسؤولية',
    photo: 'الصورة الشخصية',
    balance: 'الرصيد المتاح',
    royaltyPoints: 'نقاط النشاط والأرباح',
    reserveRule: '60% للأعضاء · 10% للبنك · 10% للمؤسس (Zebene Asfaye) · 20% لتنمية المجتمع',
    builderVaultTitle: 'الخزينة السيادية للمؤسس (رمز 2026)',
    builderVaultDesc: 'سجل العوائد المالية الخاص بالمؤسس Zebene Asfaye المحمي برمز 2026',
    enterPin: 'أدخل الرمز السري 2026',
    unlock: 'فتح الخزينة',
    locked: 'مقفل برمز الأمان 2026',
    offlineReady: 'يعمل دون إنترنت (Offline Ready)',
    online: 'متصل بالبث المباشر',
    foundingManifesto: 'ميثاق التأسيس والمبادئ الدستورية',
    founderName: 'Zebene Asfaye (المؤسس)',
    foundingDate: 'أكتوبر 2026',
    nav: {
      h1: '1. الساحة العامة',
      h2: '2. مجلس الأنساب والعائلة',
      h3: '3. ديوان القيادة والحكم',
      h4: '4. بيت المشورة والأسرار',
      h5: '5. قاعة الزفاف وعقد القران',
      h6: '6. صرح الإيمان والحكمة',
      h7: '7. غرفة الأمن والسلامة',
      h8: '8. مسرح المواهب العالمية',
      h9: '9. السوق التجاري العالمي',
      h10: '10. الأكاديمية وصرح العلم',
      h11: '11. قاعة التدريب المؤسسي',
      h12: '12. عيادة العلاج النفسي',
      h13: '13. بورصة الوساطة والتبادل',
      h14: '14. محكمة العدل والتحكيم',
      h15: '15. سداد الفواتير والخدمات',
      equb: 'الإكوب الرقمي واليانصيب',
      games: 'ألعاب الذكاء (الجبطة)',
      bank: 'البنك وصندوق الإيرادات'
    },
    header: {
      live: 'مباشر (Live)',
      installApp: 'تثبيت التطبيق',
      vault: 'الخزينة (2026)',
      profile: 'الملف الشخصي',
      openDashboard: 'فتح لوحة التحكم',
      selectLanguage: 'اختر اللغة'
    },
    banner: {
      title: 'قم بتثبيت تطبيق Oneworld على هاتفك الآن',
      subtitle: 'يعمل بسرعة فائقة وبدون اتصال بالإنترنت في حالات ضعف التغطية',
      badge: 'سريع & دون إنترنت',
      button: 'تثبيت التطبيق الآن'
    },
    stageMedia: {
      regRequired: 'تسجيل العضوية الرسمية لهذا المجلس إلزامي',
      joinPromptPrefix: 'للدخول إلى',
      joinPromptSuffix: 'يرجى تأكيد عضويتك الرسمية',
      gateDesc: 'لحجز مقعد مرقم والتحدث عبر الميكروفون عالي النقاوة وبث الفيديو المباشر، وثّق عضويتك.',
      selectRole: 'حدد صفتك ومسؤوليتك الرسمية في هذا المجلس',
      agreeBylaws: 'أوافق على الالتزام بجميع القوانين والآداب والأعراف الخاصة بهذا المجلس',
      registerBtn: 'تأكيد العضوية والدخول فوراً',
      liveHall: 'منصة الحوار المباشر بالفيديو عالي الدقة والصوت',
      active: 'نشط الآن',
      seatsTitle: 'المقاعد المخصصة للحوار',
      seatsCount: 'المحجوزة',
      yourSeat: 'أنت',
      occupied: 'محجوز',
      openSeat: 'مقعد شاغر',
      takeSeat: 'احجز مقعداً',
      leaveSeat: 'مغادرة المقعد',
      micOn: 'كتم الميكروفون',
      micOff: 'تشغيل الميكروفون',
      camOn: 'إيقاف الكاميرا',
      camOff: 'تشغيل الكاميرا',
      sendGift: 'إرسال هدية',
      speaking: 'يتحدث الآن...'
    },
    roomStage: {
      allHalls: 'جميع القاعات',
      philosophy: 'الفكر السديد',
      tech: 'التكنولوجيا والذكاء الاصطناعي',
      politics: 'السياسة والاقتصاد',
      charity: 'العمل الخيري',
      community: 'القاعات الخاصة بالأعضاء',
      openSubHall: 'افتتاح قاعة فرعية خاصة',
      numberedChairs: 'المقاعد المرقمة للمجلس',
      takeASeat: 'تفضل بالجلوس',
      leaveTheSeat: 'إخلاء المقعد',
      micMute: 'كتم الميكروفون',
      micUnmute: 'تشغيل الميكروفون',
      camClose: 'إغلاق الكاميرا',
      camOpen: 'فتح الكاميرا',
      sendGift: 'إرسال هدية للمضيف',
      inputPlaceholder: 'اكتب بلغتك الأم وسيتم التحدث والترجمة آلياً...',
      send: 'إرسال',
      liveBadge: 'بث مباشر'
    },
    chairs: {
      seatPrefix: 'المقعد #',
      occupiedChairs: 'المقاعد المحجوزة:',
      openSeat: 'مقعد شاغر',
      takeSeat: 'احجز مقعداً',
      leaveSeat: 'مغادرة المقعد',
      you: 'أنت',
      youOnSeat: 'أنت في المقعد #',
      youParticipant: 'أنت (مشارك)',
      host: 'مضيف المنصة',
      leadSpeaker: 'المتحدث الرئيسي',
      activeMember: 'عضو مشارك',
      speakingNow: 'يتحدث الآن',
      micLive: 'الميكروفون مفعّل',
      micMuted: 'كتم الصوت',
      camOff: 'الكاميرا متوقفة',
      toggleWebcam: 'كاميرا حية',
      avatarMode: 'أفاتار عالي الدقة',
      raiseHand: 'رفع اليد',
      lowerHand: 'خفض اليد',
      audienceCount: 'مشارك',
      hostLabel: 'المضيف:',
      liveBadge: 'مباشر'
    },
    charterModal: {
      title: 'ميثاق التأسيس والحوكمة واللوائح الرسمية لمنصة «OneWorld»',
      founderLabel: 'المؤسس: زيبيني أسفاي (Zebene Asfaye) · أكتوبر 2026م',
      section1Title: 'الباب الأول: إعلان التأسيس والرؤية العالمية',
      section1Text1: 'تأسست منصة «OneWorld» للبيوت الخمسة عشر السيادية في عام 2026م على يد القائد الإثيوبي صاحب الرؤية زيبيني أسفاي.',
      section1Text2: 'الهدف الأساسي هو توحيد شعوب العالم على التفكير الإيجابي والمعرفة التكنولوجية والوعي السياسي والعدالة الإنسانية.',
      section2Title: 'الباب الثاني: عزل البيانات والخصوصية السيادية للبيوت الـ 15 (Data Isolation)',
      section2Rule1: 'سرية البيانات: لا يمكن لأي بيت الوصول إلى بيانات بيت آخر مطلقاً، وكل المداولات تبقى حصراً داخل بيتها.',
      section2Rule2: 'عقود الزواج والتحكيم: تحمل عقود الزواج والقضاء أرقام القانون المدني الدولي وتوثق رسمياً.',
      section3Title: 'الباب الثالث: توزيع الإيرادات والاحتياطي البنكي وعائد المطور (60% / 10% / 10% / 20%)',
      section3Rule1: 'العائد المباشر للأعضاء المشاركين (60%): يحصل الأعضاء على 60% من الإيرادات المتأتية من مشاركتهم.',
      section3Rule2: 'الاحتياطي المصرفي والسيولة (10%): يودع 10% وفقاً لتوجيهات البنك التجاري الإثيوبي والبنك المركزي.',
      section3Rule3: 'عائد المطور السيادي 10% (رمز 2026): مخصص للمؤسس زيبيني أسفاي على حسابه في البنك التجاري CBE 1000167413618.',
      section3Rule4: 'صندوق التكافل الخيري والجماليات (20%): يخصص لصناديق التكافل الشعبي ومساعدة المحتاجين.',
      understoodBtn: 'فهمت اللائحة وأوافق على الإرشادات'
    },
    announcements: {
      liveTranslatorTitle: 'ترجمة فورية آلية للمحادثات الصوتية',
      liveTranslatorSubtitle: 'تحدث بلغتك واستمع للآخرين فورياً بلغتك المفضلة وبدقة عالية',
      liveTranslationTo: 'ترجمة مباشرة (إلى العربية):',
      originalSpeech: 'الحديث الأصلي',
      speakTranslation: 'الاستماع بالصوت',
      seatClaimed: 'تم حجز المقعد بنجاح! تم تفعيل الميكروفون والكاميرا.',
      seatLeft: 'غادرت المقعد وعدت إلى وضع المستمع.',
      insufficientFunds: 'عذراً، رصيدك غير كافٍ لإتمام العملية.',
      giftSent: 'تم إرسال الهدية بنجاح!',
      profileSaved: 'تم التحقق من بيانات الملف الشخصي والصورة بنجاح!',
      vaultBtn: 'خزنة المطور السرية السيادية (PIN 2026)',
      charterBtn: 'ميثاق المنصة واللوائح',
      offlineReadyNotice: 'يعمل بدون اتصال بالإنترنت (Offline Ready)',
      founderNotice: 'المؤسس: زيبيني أسفاي (2026)'
    },
    drawer: {
      searchPlaceholder: 'ابحث عن المجالس بالاسم أو الرقم (1-15)...',
      housesHeading: 'المنازل السيادية الخمسة عشر بالترتيب (1-15)',
      profile: 'الملف الشخصي',
      tags: {
        h1: 'مفتوح',
        h2: 'الأنساب',
        h3: 'القيادة',
        h4: 'الأسرار',
        h5: 'الزفاف',
        h6: 'الإيمان',
        h7: 'الأمن',
        h8: 'المواهب',
        h9: 'السوق',
        h10: 'التعليم',
        h11: 'التدريب',
        h12: 'العلاج',
        h13: 'الوساطة',
        h14: 'القضاء',
        h15: 'السداد'
      }
    },
    houses: {
      h1: { title: '1. الساحة العامة المشتركة', desc: 'قاعة مفتوحة لجميع شعوب العالم بعد التسجيل بالهاتف للتلاقي والتشاور الأخوي', roles: ['مواطن الساحة العامة', 'مدير الحوار', 'متحدث رسمي', 'عضو مستمع شرفي'] },
      h2: { title: '2. قاعة الأنساب والروابط الأسرية', desc: 'تجمع أفراد العائلة والنسب لتوثيق شجرة العائلة والترابط وصلة الرحم', roles: ['كبير العائلة', 'أمين سجل الأنساب', 'فرد من شجرة النسب', 'حكيم العائلة'] },
      h3: { title: '3. ديوان القادة ورجال الدولة', desc: 'مجلس استراتيجي رفيع لبحث تنمية الوطن والأمن القومي والدبلوماسية', roles: ['وزير / ممثل دولة', 'مستشار الأمن والتنمية', 'سفير دبلوماسي', 'محلل سياسي'] },
      h4: { title: '4. بيت الأسرار والمشورة الخاصة', desc: 'ملاذ آمن للراغبين في الزواج والاستشارات الأسرية والسرية المصونة', roles: ['راغب في الزواج', 'مستشار العلاقات الأسرية', 'مستشير محفوظ السر', 'شيخ مصلح'] },
      h5: { title: '5. قاعة الزفاف وعقد القران القانوني', desc: 'مراسم زفاف افتراضية مباشرة مع الشهود والمهور وعقد زواج قانوني معتمد دولياً', roles: ['العريس / العروس', 'الوصيف / الإشبين', 'الشيخ العاقد', 'شاهد النكاح', 'ضيف شرف'] },
      h6: { title: '6. صرح الإيمان والعلوم الدينية', desc: 'غرف روحانية لجميع الأديان للتعلم ونشر السلام والتعايش السلمي', roles: ['عالم دين / إمام', 'باحث في الفكر الروحي', 'سفير السلام', 'طالب علم'] },
      h7: { title: '7. غرفة الأمن والسكينة السيبرانية', desc: 'رجال الأمن ورجال الضبط لحفظ النظام ومكافحة الشغب الرقمي وحماية المنصة', roles: ['قائد الأمن وحفظ النظام', 'مراقب الأمن السيبراني', 'ضابط إنفاذ القانون', 'حارس المجتمع'] },
      h8: { title: '8. مسرح المواهب العالمية', desc: 'منافسة حية في الابتكار التكنولوجي، القيادة، والموسيقى والفنون أمام الحكام', roles: ['متسابق موهوب', 'رئيس لجنة التحكيم', 'مدرب الفنون', 'مصوت من الجمهور'] },
      h9: { title: '9. المعرض التجاري والسوق العالمي', desc: 'عرض المنتجات بالفيديو والصوت والبيع والشراء الفوري بين المنتجين والمستهلكين', roles: ['مُنتج ومصدر رئيسي', 'تاجر وموزع', 'مشترٍ مباشر', 'منسق صفقات تجارية'] },
      h10: { title: '10. الأكاديمية وصرح المعرفة', desc: 'دورات مكثفة في اللغات، الذكاء الاصطناعي، والعلوم والتكنولوجيا والصحة', roles: ['أستاذ جامعي', 'مدرب ذكاء اصطناعي وتكنولوجيا', 'باحث / طالب علم', 'خبير معرفي'] },
      h11: { title: '11. قاعة التدريب المؤسسي', desc: 'ورش عمل وتدريب معتمد للمنظمات والمؤسسات الحكومية والخاصة', roles: ['رئيس تنفيذي', 'مدير التدريب والتطوير', 'متدرب مهني', 'أخصائي بناء القدرات'] },
      h12: { title: '12. عيادة العلاج والاستشارات النفسية', desc: 'جلسات استشارية وعلاج نفسي معتمد بالصوت والفيديو لتعزيز الصحة النفسية', roles: ['طبيب نفسي إكلينيكي', 'مستشار الصحة النفسية', 'مراجع / مستفيد', 'منسق التأهيل النفسي'] },
      h13: { title: '13. بورصة الوساطة والوساطة المباشرة', desc: 'الوسطاء والمستثمرون لعقد الصفقات العقارية والتجارية المباشرة بكل ثقة', roles: ['وسيط عقاري وتجاري معتمد', 'مزود أصول وبضائع', 'مشترٍ مباشر', 'مستشار استثماري'] },
      h14: { title: '14. محكمة التظلمات والتحكيم القضائي', desc: 'قضاة معتمدون لإصدار أحكام ملزمة قانونياً للمتظلمين عبر جلسات موثقة', roles: ['قاضي تحكيم معتمد', 'محامٍ ومستشار قانوني', 'صاحب مظلمة', 'مدعى عليه'] },
      h15: { title: '15. قاعة دفع الفواتير والخدمات', desc: 'سداد فواتير الكهرباء، المياه والمواصلات عبر البنوك المعتمدة وTelebirr', roles: ['مستهلك مياه وكهرباء', 'موظف نافذة الدفع', 'منسق بنكي', 'مستخدم الاتصالات'] }
    }
  },
  de: {
    appName: 'Oneworld',
    appSubtitle: 'Die 15 Haupthallen und Wissens-Agora der Welt',
    dashboard: 'Haupt-Dashboard',
    installApp: 'Oneworld App installieren',
    installedNotice: 'App ist auf Ihrem Gerät installiert',
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    signOut: 'Abmelden',
    phoneNumber: 'Telefonnummer',
    password: 'Passwort',
    fullName: 'Vollständiger Name',
    gender: 'Geschlecht',
    age: 'Alter',
    nationality: 'Staatsangehörigkeit',
    address: 'Adresse / Stadt',
    idNumber: 'Ausweisnummer / Pass',
    roleTitle: 'Titel / Position',
    photo: 'Profilbild',
    balance: 'Kontostand',
    royaltyPoints: 'Aktivitäts-Punkte',
    reserveRule: '60% Mitglieder · 10% Bank · 10% Entwickler (Zebene Asfaye) · 20% Gemeinschaft',
    builderVaultTitle: 'Entwickler-Tresor (PIN 2026)',
    builderVaultDesc: 'Souveränes Provisionsbuch des Gründers Zebene Asfaye geschützt durch PIN 2026',
    enterPin: 'Geben Sie den PIN-Code 2026 ein',
    unlock: 'Tresor Entsperren',
    locked: 'Gesperrt mit Code 2026',
    offlineReady: 'Offline Bereit (Ohne Internet nutzbar)',
    online: 'Live Online-Stream',
    foundingManifesto: 'Gründungscharta und Verfassungsrichtlinien',
    founderName: 'Zebene Asfaye (Gründer)',
    foundingDate: 'Oktober 2026',
    nav: {
      h1: '1. Universelle Agora',
      h2: '2. Haus der Sippe',
      h3: '3. Staatsführung & Rat',
      h4: '4. Geheimes Heiligtum',
      h5: '5. Virtuelle Hochzeit',
      h6: '6. Glaube & Weisheit',
      h7: '7. Sicherheitskammer',
      h8: '8. Talent-Bühne',
      h9: '9. Weltausstellung',
      h10: '10. Akademie der Bildung',
      h11: '11. Institutionelles Training',
      h12: '12. Psychologische Beratung',
      h13: '13. Makler & Vermittlung',
      h14: '14. Justiz & Schiedsgericht',
      h15: '15. Versorgungs-Zahlungen',
      equb: 'Digitaler Equb & Lotterie',
      games: 'Spiele-Arena (Gebeta)',
      bank: 'Bank & Tantiemen'
    },
    header: {
      live: 'Live Online',
      installApp: 'App installieren',
      vault: 'Tresor (2026)',
      profile: 'Profil',
      openDashboard: 'Dashboard öffnen',
      selectLanguage: 'Sprache wählen'
    },
    banner: {
      title: 'Oneworld App auf Ihrem Telefon installieren',
      subtitle: 'Öffnet blitzschnell und offline auch bei schwachem Netz oder ohne Verbindung',
      badge: 'Schnell & Offline',
      button: 'Jetzt Installieren'
    },
    stageMedia: {
      regRequired: 'Mitgliedschaft für diese Halle erforderlich',
      joinPromptPrefix: 'Um',
      joinPromptSuffix: 'beizutreten, registrieren Sie sich bitte als Mitglied',
      gateDesc: 'Um einen nummerierten Sitzplatz zu belegen, per Mikrofon zu sprechen und Video zu übertragen, bestätigen Sie Ihre Mitgliedschaft.',
      selectRole: 'Wählen Sie Ihre offizielle Rolle / Funktion',
      agreeBylaws: 'Ich verpflichte mich, die Statuten und Regeln dieser Halle zu wahren',
      registerBtn: 'Mitgliedschaft bestätigen & Eintreten',
      liveHall: 'Live HD-Video- & Audio-Bühne',
      active: 'Aktiv',
      seatsTitle: 'Nummerierte Versammlungs-Sitze',
      seatsCount: 'Belegt',
      yourSeat: 'Sie',
      occupied: 'Besetzt',
      openSeat: 'Freier Sitzplatz',
      takeSeat: 'Platz nehmen',
      leaveSeat: 'Platz freigeben',
      micOn: 'Mikrofon stummschalten',
      micOff: 'Mikrofon einschalten',
      camOn: 'Kamera ausschalten',
      camOff: 'Kamera einschalten',
      sendGift: 'Geschenk senden',
      speaking: 'Spricht gerade...'
    },
    roomStage: {
      allHalls: 'Alle Hallen',
      philosophy: 'Gutes Gedankengut',
      tech: 'Technologie & KI',
      politics: 'Politik & Wirtschaft',
      charity: 'Gemeinnützigkeit',
      community: 'Private Säle der Mitglieder',
      openSubHall: 'Eigenen Saal eröffnen',
      numberedChairs: 'Nummerierte Stühle des Saals',
      takeASeat: 'Platz nehmen',
      leaveTheSeat: 'Platz freigeben',
      micMute: 'Mikro stumm',
      micUnmute: 'Mikro an',
      camClose: 'Kamera aus',
      camOpen: 'Kamera an',
      sendGift: 'Geschenk senden',
      inputPlaceholder: 'In Ihrer Muttersprache schreiben...',
      send: 'Senden',
      liveBadge: 'Live'
    },
    chairs: {
      seatPrefix: 'Sitzplatz #',
      occupiedChairs: 'Belegte Plätze:',
      openSeat: 'Freier Sitz',
      takeSeat: 'Platz nehmen',
      leaveSeat: 'Platz verlassen',
      you: 'Sie',
      youOnSeat: 'Sie auf Platz #',
      youParticipant: 'Sie (Teilnehmer)',
      host: 'Bühnen-Host',
      leadSpeaker: 'Hauptsprecher',
      activeMember: 'Aktives Mitglied',
      speakingNow: 'Spricht gerade',
      micLive: 'Mikrofon aktiv',
      micMuted: 'Mikrofon stumm',
      camOff: 'Kamera aus',
      toggleWebcam: 'Live-Webcam',
      avatarMode: 'HD-Avatar',
      raiseHand: 'Hand heben',
      lowerHand: 'Hand senken',
      audienceCount: 'Teilnehmer',
      hostLabel: 'Host:',
      liveBadge: 'Live'
    },
    charterModal: {
      title: 'Gründungscharta, Satzung & offizielle Richtlinien von OneWorld',
      founderLabel: 'Gründer: Zebene Asfaye · Oktober 2026',
      section1Title: 'Teil I: Gründungserlass und globale Vision',
      section1Text1: 'Die Plattform der 15 souveränen Häuser OneWorld wurde 2026 vom äthiopischen Visionär Zebene Asfaye ins Leben gerufen.',
      section1Text2: 'Ihr Ziel ist es, die Menschen der Welt in Wohlwollen, technologischer Bildung, bürgerschaftlichem Bewusstsein und Wohltätigkeit zu vereinen.',
      section2Title: 'Teil II: Datenisolation & souveräne Privatsphäre der 15 Häuser',
      section2Rule1: 'Datenschutz: Vollständige Trennung zwischen den Häusern. Beratungen und Dokumente verbleiben ausschließlich im jeweiligen Haus.',
      section2Rule2: 'Zivilrechtliche Verträge & Schlichtung: Trauungen und Schiedssprüche tragen internationale zivilrechtliche Zertifizierungen.',
      section3Title: 'Teil III: Erlösverteilung, Bankreserve & Entwickler-Tantieme (60% / 10% / 10% / 20%)',
      section3Rule1: 'Direktauszahlung an aktive Mitglieder (60%): Mitglieder erhalten 60% der durch Beteiligung und Wachstum erwirtschafteten Erlöse.',
      section3Rule2: 'Bankreserve & Liquiditätssicherung (10%): 10% gemäß den Richtlinien der Commercial Bank of Ethiopia und der Nationalbank.',
      section3Rule3: 'Feste Entwickler-Tantieme 10% (Code 2026): Für Gründer Zebene Asfaye auf das CBE-Konto 1000167413618 geschützt mit PIN 2026.',
      section3Rule4: 'Gemeinschafts-Equb & Wohltätigkeit (20%): 20% für gegenseitige Unterstützung, Härtefallhilfe und Solidaritätsfonds.',
      understoodBtn: 'Ich habe die Richtlinien verstanden'
    },
    announcements: {
      liveTranslatorTitle: 'Automatische Live-Sprachübersetzung',
      liveTranslatorSubtitle: 'Jeder spricht in seiner Sprache und Sie hören es sofort in Ihrer bevorzugten Sprache',
      liveTranslationTo: 'Live-Übersetzung (auf Deutsch):',
      originalSpeech: 'Ursprüngliche Rede',
      speakTranslation: 'Mit Sprachausgabe anhören',
      seatClaimed: 'Sitzplatz erfolgreich eingenommen! Mikrofon und Kamera aktiviert.',
      seatLeft: 'Sie haben den Platz verlassen und sind im Zuhörermodus.',
      insufficientFunds: 'Entschuldigung, unzureichendes Guthaben in der Wallet.',
      giftSent: 'Virtuelles Geschenk erfolgreich gesendet!',
      profileSaved: 'Mitgliedsprofil und Foto erfolgreich verifiziert!',
      vaultBtn: 'Geheimer Entwickler-Tresor (PIN 2026)',
      charterBtn: 'Gründungscharta & Richtlinien',
      offlineReadyNotice: 'Funktioniert offline (Offline Ready)',
      founderNotice: 'Gründer: Zebene Asfaye (2026)'
    },
    drawer: {
      searchPlaceholder: 'Halle nach Name oder Nummer suchen (1-15)...',
      housesHeading: 'Die 15 Haupthallen nach Reihenfolge (1-15)',
      profile: 'Profil',
      tags: {
        h1: 'Offen',
        h2: 'Sippe',
        h3: 'Führung',
        h4: 'Diskret',
        h5: 'Hochzeit',
        h6: 'Glaube',
        h7: 'Sicherheit',
        h8: 'Talent',
        h9: 'Markt',
        h10: 'Bildung',
        h11: 'Training',
        h12: 'Klinik',
        h13: 'Makler',
        h14: 'Justiz',
        h15: 'Zahlung'
      }
    },
    houses: {
      h1: { title: '1. Universelle Allgemeine Agora', desc: 'Offene Versammlung für alle Bürger nach Telefon-Registrierung', roles: ['Agora-Bürger', 'Diskussionsleiter', 'Hauptredner', 'Ehrengast'] },
      h2: { title: '2. Haus der Blutsverwandtschaft', desc: 'Stammbaum- und Ahnenforschung zur Stärkung der Familienbande', roles: ['Familienoberhaupt', 'Stammbaum-Archivar', 'Sippenmitglied', 'Familienältester'] },
      h3: { title: '3. Staatsführung & Souveräner Rat', desc: 'Rat für Staatsmänner zu Entwicklung, Sicherheit und Diplomatie', roles: ['Staatsminister', 'Strategischer Berater', 'Botschafter', 'Politischer Analyst'] },
      h4: { title: '4. Vertrauliches Beratungs-Heiligtum', desc: 'Geschützter Raum für Heiratssuchende und diskrete Beratungen', roles: ['Heiratssuchender', 'Eheberater', 'Vertraulicher Ratsuchender', 'Familienältester'] },
      h5: { title: '5. Virtuelle Hochzeit & Rechtsverbindliche Ehe', desc: 'Online-Hochzeitszeremonie mit Trauzeugen, Ältesten und rechtsgültigem Ehevertrag', roles: ['Brautpaar', 'Trauzeuge', 'Trauredner', 'Rechtszeuge', 'Ehrengast'] },
      h6: { title: '6. Haus des Glaubens & Spirituelle Studien', desc: 'Gemeinsames friedliches Lernen aller Glaubensrichtungen', roles: ['Geistlicher Leiter', 'Theologe / Forscher', 'Friedensbotschafter', 'Schüler'] },
      h7: { title: '7. Sicherheits- und Cyber-Friedenskammer', desc: 'Sicherheitskräfte zur Wahrung von Ordnung und Ruhe', roles: ['Sicherheitskommandant', 'Cyber-Sicherheitsbeauftragter', 'Polizeibeamter', 'Gemeindeschützer'] },
      h8: { title: '8. Globale Talent-Arena', desc: 'Technikinnovationen, Führung, Musik und Comedy im Live-Wettbewerb', roles: ['Talent-Kandidat', 'Hauptjuror', 'Künstlerischer Mentor', 'Abstimmender Zuschauer'] },
      h9: { title: '9. Weltausstellung & Handelsmarktplatz', desc: 'Präsentation von Waren per Video und direkter Online-Verkauf', roles: ['Haupthersteller / Exporteur', 'Händler', 'Direktkäufer', 'Handelsvermittler'] },
      h10: { title: '10. Globale Akademie & Wissenszentrum', desc: 'Kompakte Kurse in KI, Sprachen, Mathematik und Wissenschaften', roles: ['Universitätsprofessor', 'KI & Tech-Dozent', 'Forscher / Student', 'Meister'] },
      h11: { title: '11. Institutionelle Trainingshalle', desc: 'Zertifizierte Videoschulungen für Behörden und Organisationen', roles: ['Generaldirektor', 'Ausbildungsleiter', 'Fachschüler', 'Kapazitätsexperte'] },
      h12: { title: '12. Psychologische Behandlung & Beratung', desc: 'Therapie und mentale Beratung per Video und Audio', roles: ['Klinischer Psychologe', 'Mental Health Berater', 'Klient / Patient', 'Genesungskoordinator'] },
      h13: { title: '13. Globale Makler- und Vermittlungsbörse', desc: 'Direkter Handel von Immobilien, Waren und Dienstleistungen', roles: ['Zugelassener Makler', 'Warenanbieter', 'Direktkäufer / Mieter', 'Unternehmensberater'] },
      h14: { title: '14. Schiedsgericht & Justizkammer', desc: 'Offizielle Richter zur Urteilsfindung bei Beschwerden', roles: ['Schiedsrichter / Richter', 'Rechtsbeistand', 'Kläger', 'Beklagter'] },
      h15: { title: '15. Rechnungszahlung & Finanzdrehscheibe', desc: 'Bezahlung von Strom, Wasser und Transport über Banken und Telebirr', roles: ['Versorgungsabonnent', 'Zahlungsschalter-Beauftragter', 'Bankkoordinator', 'Telekom-Kunde'] }
    }
  }
};
