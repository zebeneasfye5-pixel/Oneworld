import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Video, 
  Mic, 
  Heart, 
  MessageSquare, 
  Radio, 
  CheckCircle2, 
  Bookmark,
  Share2,
  Calendar,
  Award
} from 'lucide-react';
import { speakText } from '../../services/speechService';

interface FaithChamber {
  id: string;
  faithNameAm: string;
  faithNameEn: string;
  symbol: string;
  themeColor: string;
  bgGradient: string;
  borderAccent: string;
  leaderName: string;
  leaderTitle: string;
  leaderAvatar: string;
  membersCount: number;
  liveViewersCount: number;
  currentServiceTitle: string;
  scriptureRef: string;
  scriptureText: string;
  scriptureExplanation: string;
  audioRecitationText: string;
  dailyHymnTitle: string;
  prayersList: { author: string; intent: string; time: string; amens: number }[];
}

export const HouseFaith: React.FC = () => {
  const faithChambers: FaithChamber[] = [
    {
      id: 'orthodox',
      faithNameAm: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ሉዓላዊ አዳራሽ',
      faithNameEn: 'Ethiopian Orthodox Tewahedo Sacred Sanctuary',
      symbol: '☦️',
      themeColor: 'amber',
      bgGradient: 'from-amber-950/60 via-slate-900 to-amber-950/30',
      borderAccent: 'border-amber-500/50',
      leaderName: 'ሊቀ ማእምራን ቀሲስ ዘበነ ተክለማርያም',
      leaderTitle: 'የነገረ መለኮት መምህርና የሃይማኖት አባት',
      leaderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      membersCount: 148500,
      liveViewersCount: 3420,
      currentServiceTitle: 'ስለ ቅድስና፣ ፍቅርና የትዕግስት በረከት በኦርቶዶክሳዊ አስተምህሮ',
      scriptureRef: '፩ኛ ቆሮንቶስ 13:4-8',
      scriptureText: '«ፍቅር ይታገሣል፥ ቸርነትንም ያደርጋል፤ ፍቅር አይቀናም፥ ፍቅር አይመካም፥ አይታበይም፤ የማይገባውን አያደርግም፥ የራሱንም አይፈልግም፥ አይበሳጭም፥ በደልንም አይቆጥርም፤ ከእውነት ጋር ደስ ይለዋል እንጂ ስለ ዓመፃ ደስ አይለውም፤ ሁሉን ይታገሣል፥ ሁሉን ያምናል፥ ሁሉን ተስፋ ያደርጋል፥ በሁሉ ይጸናል። ፍቅር ለዘወትር አይወድቅም።»',
      scriptureExplanation: 'በዚህ የቅዱስ ጳውሎስ መልእክት ውስጥ የተገለጸው እውነተኛ ፍቅር የሰው ልጅ ከፈጣሪው እና ከባልንጀራው ጋር ሊኖረው የሚገባውን የጸና የህይወት መመሪያ ያሳያል። ትዕግስትና ይቅርታ የማንኛውም መንፈሳዊ እድገት መሰረት ናቸው።',
      audioRecitationText: 'ፍቅር ይታገሳል፣ ቸርነትንም ያደርጋል። ፍቅር አይቀናም፣ ፍቅር አይመካም፣ አይታበይም። የማይገባውን አያደርግም፣ የራሱንም አይፈልግም፣ አይበሳጭም፣ በደልንም አይቆጥርም። ከእውነት ጋር ደስ ይለዋል እንጂ ስለ አመፃ ደስ አይለውም።',
      dailyHymnTitle: 'የማኅሌትና የምስጋና ዝማሬ (ያሬዳዊ ዜማ)',
      prayersList: [
        { author: 'ዮሐንስ ተስፋዬ', intent: 'ለሀገራችን ኢትዮጵያና ለመላው አለም ሰላምና ፍቅር ይሁንልን', time: 'ከ 5 ደቂቃ በፊት', amens: 184 },
        { author: 'ወለተ ማርያም', intent: 'በህመም ላይ ላሉ ወንድምና እህቶች ፈውስና ጤና እንዲሰጣቸው', time: 'ከ 12 ደቂቃ በፊት', amens: 240 },
        { author: 'ቀሲስ አስራት', intent: 'ለተማሪዎችና ወጣቶች የመልካም ስነምግባር ጥበብ እንዲበዛላቸው', time: 'ከ 25 ደቂቃ በፊት', amens: 312 }
      ]
    },
    {
      id: 'islam',
      faithNameAm: 'የእስልምና ዑለማእ እና ቅዱስ ቁርዓን ማዕከል',
      faithNameEn: 'Islamic Wisdom, Sunnah & Quranic Study Sanctuary',
      symbol: '☪️',
      themeColor: 'emerald',
      bgGradient: 'from-emerald-950/60 via-slate-900 to-emerald-950/30',
      borderAccent: 'border-emerald-500/50',
      leaderName: 'ሼክ ዶ/ር መሐመድ አል-አሚን',
      leaderTitle: 'የቁርዓን ተፍሲርና የኢስላሚክ ሸሪዓ ተመራማሪ',
      leaderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      membersCount: 139200,
      liveViewersCount: 2950,
      currentServiceTitle: 'የሰው ልጆች እኩልነት፣ ሰላም፣ ራህመትና ለድሆች አዛኝ መሆን በኢስላም',
      scriptureRef: 'ሱረቱ አን-ናሕል (16:90)',
      scriptureText: '«إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَالْبَغْيِ ۚ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ»\n\nትርጉም፡ «አላህ ፍትሕን፣ በጎ ሥራን፣ ለዝምድና ባለቤቶችም መስጠትን ያዛል፤ ከመጥፎ ነገርም፣ ከሚጠላም፣ ከመበደልም ይከለክላል፤ ትገሰጹ ዘንድ ይገስጻችኋል።»',
      scriptureExplanation: 'ይህ ታላቅ የአላህ ቃል የፍትህ፣ የመልካምነትና የዝምድና መብትን ያዛል። ማንኛውም አማኝ በአካባቢው ላሉ ሰዎች በሙሉ እኩልነትንና ቸርነትን ማሳየት ግዴታው መሆኑን ያስተምራል።',
      audioRecitationText: 'አላህ ፍትህን፣ በጎ ስራን፣ ለዝምድና ባለቤቶችም መስጠትን ያዛል። ከመጥፎ ነገርም፣ ከሚጠላም፣ ከመበደልም ይከለክላል። ትገሰፁ ዘንድ ይገስጻችኋል።',
      dailyHymnTitle: 'የተጅዊድ የቁርዓን ንባብ እና ዚክር (Recitation & Dhikr)',
      prayersList: [
        { author: 'አብዱራህማን ዑመር', intent: 'ለመላው የሰው ዘር ሰላም፣ መረጋጋትና የእዝነት በረከት ይወርድ ዘንድ (ዱዓ)', time: 'ከ 7 ደቂቃ በፊት', amens: 295 },
        { author: 'ፋጢማ ሃሰን', intent: 'ለተቸገሩና ለስደተኞች አላህ እፎይታን እንዲሰጥ', time: 'ከ 15 ደቂቃ በፊት', amens: 360 },
        { author: 'ቢላል ኑሩ', intent: 'ለቤተሰቦቻችንና ለልጆቻችን የቀናውን መንገድ እንዲመራቸው', time: 'ከ 30 ደቂቃ በፊት', amens: 410 }
      ]
    },
    {
      id: 'protestant',
      faithNameAm: 'የወንጌላውያን አብያተ ክርስቲያናት ህብረት አዳራሽ',
      faithNameEn: 'Evangelical & Protestant Fellowship of Faith',
      symbol: '✝️',
      themeColor: 'blue',
      bgGradient: 'from-blue-950/60 via-slate-900 to-indigo-950/30',
      borderAccent: 'border-blue-500/50',
      leaderName: 'ፓስተር ዶ/ር ዳንኤል ከበደ',
      leaderTitle: 'የወንጌል ሰባኪና የቤተሰብ ህይወት አማካሪ',
      leaderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      membersCount: 112400,
      liveViewersCount: 2210,
      currentServiceTitle: 'በጸጋ የዳነ ህይወት፡ እምነት በተግባርና ማህበረሰብን በመልካም ስራ ማገልገል',
      scriptureRef: 'ማቴዎስ 5:14-16',
      scriptureText: '«እናንተ የዓለም ብርሃን ናችሁ፤ በተራራ ላይ ያለች ከተማ ልትሰወር አይቻላትም። መብራትንም አብርተው ከዕንቅብ በታች አይደለም እንጂ በቤት ላሉት ሁሉ እንዲያበራ በመቅረዝ ላይ ያኖሩታል። መልካሙን ሥራችሁን አይተው በሰማያት ያለውን አባታችሁን እንዲያከብሩ ብርሃናችሁ እንዲሁ በሰው ፊት ይብራ።»',
      scriptureExplanation: 'የክርስቲያን ህይወት በተግባር የሚታይ ብርሃን ነው። ቃሉን መስማት ብቻ ሳይሆን በጎ ስራ በመስራት፣ የተራቡትን በማብላትና የተቸገሩትን በመርዳት የእግዚአብሔርን ፍቅር ለዓለም ማሳየት ይገባናል።',
      audioRecitationText: 'እናንተ የአለም ብርሃን ናችሁ። በተራራ ላይ ያለች ከተማ ልትሰወር አይቻላትም። መልካሙን ስራችሁን አይተው በሰማያት ያለውን አባታችሁን እንዲያከብሩ ብርሃናችሁ እንዲሁ በሰው ፊት ይብራ።',
      dailyHymnTitle: 'የአምልኮና የምስጋና መዝሙር (Worship & Praise Hymns)',
      prayersList: [
        { author: 'ሳሙኤል በቀለ', intent: 'ለሀገራችን ህዝብ መፈወስ፣ አንድነትና መንፈሳዊ መነቃቃት ጸሎት', time: 'ከ 8 ደቂቃ በፊት', amens: 198 },
        { author: 'ሩት ታደሰ', intent: 'ስራ ለሚፈልጉ ወጣቶች የበረከት በር እንዲከፈትላቸው', time: 'ከ 18 ደቂቃ በፊት', amens: 275 },
        { author: 'እያሱ ተፈራ', intent: 'በተለያዩ ፈተናዎች ውስጥ ላሉ ወገኖች የእግዚአብሔር ብርታት ይሁንላቸው', time: 'ከ 35 ደቂቃ በፊት', amens: 320 }
      ]
    },
    {
      id: 'catholic',
      faithNameAm: 'የካቶሊክ ቤተክርስቲያን እና የጋራ ሰላም ማዕከል',
      faithNameEn: 'Catholic Cathedral & Universal Interfaith Peace Agora',
      symbol: '🕊️',
      themeColor: 'purple',
      bgGradient: 'from-purple-950/60 via-slate-900 to-purple-950/30',
      borderAccent: 'border-purple-500/50',
      leaderName: 'አባ ዮሴፍ ተክሌ (Father Joseph)',
      leaderTitle: 'የካቶሊክ ቄስና የአለም አቀፍ የሰላም ውይይት አስተባባሪ',
      leaderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      membersCount: 84300,
      liveViewersCount: 1640,
      currentServiceTitle: 'የዓለም አቀፍ የሰው ልጆች ወንድማማችነት፣ ይቅርታና የጋራ ሰላም ግንባታ',
      scriptureRef: 'ሉቃስ 6:36-38',
      scriptureText: '«አባታችሁ ርኅሩኅ እንደ ሆነ ርኅሩሦች ሁኑ። አትፍረዱ አይፈረድባችሁምም፤ አትኰንኑ አትኰነኑምም። ይቅር በሉ ይቅርም ትባላላችሁ። ስጡ ይሰጣችሁማል፤ በምትሰፍሩበት መስፈሪያ ተመልሶ ይሰፈርላችኋልና።»',
      scriptureExplanation: 'ርህራሄና የይቅርታ ልብ የክርስቲያናዊ ስነምግባር ማዕከል ናቸው። ሌሎችን ያለፍርድ በፍቅር መቀበል የዓለማችንን ግጭት የሚያስወግድ ኃይል ነው።',
      audioRecitationText: 'አባታችሁ ርህሩህ እንደሆነ ርህሩሆች ሁኑ። አትፍረዱ አይፈረድባችሁምም። ይቅር በሉ ይቅርም ትባላላችሁ። ስጡ ይሰጣችሁማል። በምትሰፍሩበት መስፈሪያ ተመልሶ ይሰፈርላችኋል።',
      dailyHymnTitle: 'የቅዳሴ ጸሎትና የመላዕክት ምስጋና (Gregorian & Ethiopian Liturgy)',
      prayersList: [
        { author: 'በርናባስ ገብሬ', intent: 'በዓለም ዙሪያ በጦርነትና ረሃብ ለሚሰቃዩ ህፃናትና እናቶች ሰላም', time: 'ከ 10 ደቂቃ በፊት', amens: 160 },
        { author: 'ቴሬዛ ክፍሌ', intent: 'በአረጋውያንና አቅመ ደካሞች ላይ የእግዚአብሔር እዝነት እንዲበዛ', time: 'ከ 22 ደቂቃ በፊት', amens: 215 },
        { author: 'ማርቆስ ወልዴ', intent: 'የተለያዩ እምነቶች ተከባብረው በሰላም አብረው እንዲኖሩ', time: 'ከ 40 ደቂቃ በፊት', amens: 290 }
      ]
    }
  ];

  const [activeChamberId, setActiveChamberId] = useState<string>('orthodox');
  const [prayersState, setPrayersState] = useState<Record<string, { author: string; intent: string; time: string; amens: number }[]>>({
    orthodox: faithChambers[0].prayersList,
    islam: faithChambers[1].prayersList,
    protestant: faithChambers[2].prayersList,
    catholic: faithChambers[3].prayersList
  });
  const [newPrayerIntent, setNewPrayerIntent] = useState('');
  const [prayerSubmittedNotice, setPrayerSubmittedNotice] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const selectedChamber = faithChambers.find(c => c.id === activeChamberId) || faithChambers[0];

  const handleReciteScripture = () => {
    setIsAudioPlaying(true);
    speakText(selectedChamber.audioRecitationText, 'am');
    setTimeout(() => setIsAudioPlaying(false), 8000);
  };

  const handleAmenPrayer = (index: number) => {
    setPrayersState(prev => {
      const list = [...(prev[selectedChamber.id] || [])];
      if (list[index]) {
        list[index] = { ...list[index], amens: list[index].amens + 1 };
      }
      return { ...prev, [selectedChamber.id]: list };
    });
  };

  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerIntent.trim()) return;

    const newEntry = {
      author: 'እርስዎ (የአዳራሹ አባል)',
      intent: newPrayerIntent.trim(),
      time: 'አሁን',
      amens: 1
    };

    setPrayersState(prev => ({
      ...prev,
      [selectedChamber.id]: [newEntry, ...(prev[selectedChamber.id] || [])]
    }));

    setNewPrayerIntent('');
    setPrayerSubmittedNotice('የጸሎት/የዱዓ ጥያቄዎ በአዳራሹ ቀጥታ ተመዝግቧል! አባላት በጋራ አሜን እያሉ ይጸልያሉ።');
    setTimeout(() => setPrayerSubmittedNotice(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* House 6 Master Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/50 via-slate-900 to-emerald-950/50 border border-amber-500/30 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl">
            6
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                የእምነት ቤት (Faith, Sacred Scripture & Interfaith Agora)
              </h2>
              <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                4 ራሳቸውን የቻሉ ሉዓላዊ አዳራሾች
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              ሁሉም እምነቶች እንደየ እምነታቸው ተመዝግበው በየራሳቸው ሉዓላዊ አዳራሽ የሚማማሩበት፣ ቅዱሳት መጻሕፍትን በድምፅ የሚያዳምጡበትና የጋራ ሰላምን የሚገነቡበት መንፈሳዊ ማዕከል
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 px-4 py-2 rounded-2xl text-xs text-emerald-400 font-bold shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>የእምነት ነጻነትና ክብር 100% የተጠበቀ</span>
        </div>
      </div>

      {/* 4 Sovereign Autonomous Faith Sub-Houses Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {faithChambers.map((chamber) => {
          const isActive = chamber.id === activeChamberId;
          return (
            <button
              key={chamber.id}
              onClick={() => setActiveChamberId(chamber.id)}
              className={`p-4 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group shadow-lg ${
                isActive
                  ? `bg-slate-900/90 ${chamber.borderAccent} ring-2 ring-amber-500/50 scale-[1.02]`
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl filter drop-shadow">{chamber.symbol}</span>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {chamber.membersCount.toLocaleString()} አባላት
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-white leading-snug group-hover:text-amber-300 transition-colors">
                  {chamber.faithNameAm}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {chamber.faithNameEn}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {chamber.liveViewersCount.toLocaleString()} በቀጥታ
                </span>
                <span className="text-slate-400 text-[10px]">{isActive ? '✓ የተመረጠ አዳራሽ' : 'ወደ አዳራሽ ግባ →'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE SUB-HOUSE STAGE: Dedicated Pulpit, Spiritual Leader, Scripture Exegesis, Live Discussion */}
      <div className={`bg-[#0d111d] border-2 ${selectedChamber.borderAccent} rounded-3xl p-6 shadow-2xl space-y-6 animate-fadeIn`}>
        {/* Sub-House Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <span className="text-4xl p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              {selectedChamber.symbol}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-extrabold text-white">
                  {selectedChamber.faithNameAm}
                </h3>
                <span className="bg-red-600/90 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Radio className="w-3 h-3" />
                  ቀጥታ ጉባኤ (LIVE)
                </span>
              </div>
              <p className="text-xs text-amber-400 font-medium mt-1">
                የአዳራሹ መሪ፡ <strong className="text-white">{selectedChamber.leaderName}</strong> ({selectedChamber.leaderTitle})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleReciteScripture}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg cursor-pointer transition-transform hover:scale-105"
            >
              <Volume2 className={`w-4 h-4 ${isAudioPlaying ? 'animate-bounce' : ''}`} />
              <span>{isAudioPlaying ? 'ድምፅ እየተደመጠ ነው...' : 'የቅዱስ ቃል ንባብ በድምፅ ያዳምጡ'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout: Left = Live Spiritual Pulpit / Video Stream; Right = Scripture & Prayers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Live Broadcast Video Pulpit */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border-2 border-slate-800 shadow-2xl flex flex-col justify-between p-4 group">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${selectedChamber.leaderAvatar}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

              {/* Stream Top Floating Meta */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-black/60 backdrop-blur-md text-amber-400 border border-amber-400/30 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {selectedChamber.dailyHymnTitle}
                </span>
                <span className="bg-red-600/90 text-white font-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {selectedChamber.liveViewersCount.toLocaleString()} ተሳታፊዎች
                </span>
              </div>

              {/* Stream Bottom Meta */}
              <div className="relative z-10 space-y-2">
                <div className="bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                    የዛሬው የቀጥታ ትምህርት ርዕስ
                  </span>
                  <h4 className="text-white font-bold text-sm sm:text-base leading-tight mt-0.5">
                    {selectedChamber.currentServiceTitle}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    አስተማሪ፡ {selectedChamber.leaderName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleReciteScripture}
                    className="flex-1 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ድምፁን ክፈት (Audio)</span>
                  </button>
                  <button 
                    onClick={() => {
                      setPrayerSubmittedNotice(`ወደ ${selectedChamber.faithNameAm} የቀጥታ መድረክ ወንበር ተቀላቅለዋል!`);
                      setTimeout(() => setPrayerSubmittedNotice(null), 4000);
                    }}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>ወንበር ያዝ / ተሳተፍ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sacred Scripture Exegesis Card */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  የቅዱስ ቃል ምንባብ፡ {selectedChamber.scriptureRef}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  የዛሬው ጥቅስ
                </span>
              </div>

              <blockquote className="p-4 rounded-xl bg-slate-950/80 border-l-4 border-amber-500 text-sm text-slate-100 italic leading-relaxed whitespace-pre-line">
                {selectedChamber.scriptureText}
              </blockquote>

              <div className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-slate-800">
                <strong className="text-amber-300">የአስተምህሮ ማብራሪያ፡ </strong>
                {selectedChamber.scriptureExplanation}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Community Prayers, Intercession & Live Du'a / Prayer Board */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    የምዕመናን የጸሎትና የምስጋና ጥያቄዎች
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400">
                  {prayersState[selectedChamber.id]?.length || 0} ጥያቄዎች
                </span>
              </div>

              {/* Submit Prayer/Dua Form */}
              <form onSubmit={handleAddPrayer} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPrayerIntent}
                    onChange={(e) => setNewPrayerIntent(e.target.value)}
                    placeholder="የጸሎት/የዱዓ ሃሳብዎን እዚህ ይጻፉ..."
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md flex-shrink-0"
                  >
                    ላክ
                  </button>
                </div>
                {prayerSubmittedNotice && (
                  <p className="text-[11px] text-emerald-400 font-bold animate-fadeIn">
                    ✓ {prayerSubmittedNotice}
                  </p>
                )}
              </form>

              {/* Prayers Scrollable Feed */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {(prayersState[selectedChamber.id] || []).map((prayer, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 space-y-1.5 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-amber-300">{prayer.author}</span>
                      <span className="text-slate-500 text-[10px]">{prayer.time}</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-snug">
                      «{prayer.intent}»
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleAmenPrayer(idx)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 cursor-pointer transition-colors"
                      >
                        <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                        <span>አሜን / ዱዓ አድርግ ({prayer.amens})</span>
                      </button>
                      <span className="text-[10px] text-slate-500">በጋራ ጸሎት</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
