import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Camera, 
  Heart, 
  Globe2, 
  Award, 
  Plus, 
  Share2, 
  BookOpen, 
  Eye, 
  Search,
  CheckCircle2,
  Landmark
} from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../../i18n/translations';

export interface HeritageSite {
  id: string;
  nameAm: string;
  nameEn: string;
  locationAm: string;
  locationEn: string;
  category: 'cultural' | 'natural' | 'historical' | 'living_culture';
  unescoYear?: number;
  imageUrl: string;
  descriptionAm: string;
  descriptionEn: string;
  curatorName: string;
  curatorRole: 'መንግስታዊ ተወካይ' | 'የቅርስ ተመራማሪ' | 'አካባቢያዊ አስጎብኝ' | 'የዩኔስኮ አጋር';
  likesCount: number;
  viewsCount: number;
  isVerified: boolean;
}

const INITIAL_HERITAGE_SITES: HeritageSite[] = [
  {
    id: 'site-1',
    nameAm: 'የላሊበላ ውቅር አብያተ ክርስቲያናት',
    nameEn: 'Rock-Hewn Churches of Lalibela',
    locationAm: 'ላሊበላ፣ ሰሜን ወሎ፣ ኢትዮጵያ',
    locationEn: 'Lalibela, North Wollo, Ethiopia',
    category: 'cultural',
    unescoYear: 1978,
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
    descriptionAm: 'በ12ኛው መቶ ክፍለ-ዘመን ከአንድ ወጥ አለት ተፈልፍለው የተሰሩ 11 አስደናቂ አብያተ ክርስቲያናት፤ የሰው ልጅ የጥበብና የእምነት ከፍተኛ ማሳያ።',
    descriptionEn: '11 monumental monolithic rock-hewn churches built in the 12th century under King Lalibela, symbolizing the New Jerusalem.',
    curatorName: 'የቅርስ ጥናትና ጥበቃ ባለስልጣን',
    curatorRole: 'መንግስታዊ ተወካይ',
    likesCount: 14200,
    viewsCount: 68000,
    isVerified: true
  },
  {
    id: 'site-2',
    nameAm: 'የአክሱም ሃውልቶችና ጥንታዊ ስልጣኔ',
    nameEn: 'Ancient Obelisks and Civilization of Axum',
    locationAm: 'አክሱም፣ ትግራይ፣ ኢትዮጵያ',
    locationEn: 'Axum, Tigray, Ethiopia',
    category: 'historical',
    unescoYear: 1980,
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    descriptionAm: 'የጥንታዊው የአክሱማውያን ንጉሠ ነገሥት መንግሥት ዋና ከተማ፤ በግዙፍ የድንጋይ ሃውልቶች፣ በሳንቲም ቀረጻ እና በንግድ መስመሮች የታወቀ የታላቅ ስልጣኔ ማዕከል።',
    descriptionEn: 'Ruins of the classical kingdom of Aksum dating from the 1st to the 13th century AD, featuring monumental monolithic stelae.',
    curatorName: 'ዶ/ር አለማየሁ አስፋው',
    curatorRole: 'የቅርስ ተመራማሪ',
    likesCount: 11800,
    viewsCount: 52400,
    isVerified: true
  },
  {
    id: 'site-3',
    nameAm: 'የስሜን ተራሮች ብሔራዊ ፓርክና ዋልያ',
    nameEn: 'Simien Mountains National Park & Walia Ibex',
    locationAm: 'ጎንደር፣ ሰሜን ጎንደር፣ ኢትዮጵያ',
    locationEn: 'Gondar, Simien Highlands, Ethiopia',
    category: 'natural',
    unescoYear: 1978,
    imageUrl: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=800&q=80',
    descriptionAm: 'አስደናቂ የተራራ ሰንሰለቶች፣ ጥልቅ ገደሎችና በኢትዮጵያ ብቻ የሚገኙ ብርቅዬ እንስሳት (ዋልያ አይቤክስ፣ ጭላዳ ዝንጀሮ እና ቀይ ቀበሮ) መገኛ።',
    descriptionEn: 'Massive erosion over millions of years has created one of the most spectacular mountain landscapes in the world, home to rare endemic wildlife.',
    curatorName: 'የኢትዮጵያ የዱር አራዊት ጥበቃ ባለስልጣን',
    curatorRole: 'መንግስታዊ ተወካይ',
    likesCount: 9800,
    viewsCount: 43200,
    isVerified: true
  },
  {
    id: 'site-4',
    nameAm: 'ፋሲል ግቢ (የጎንደር ግንቦች)',
    nameEn: 'Fasil Ghebbi, Gondar Castles',
    locationAm: 'ጎንደር ከተማ፣ ኢትዮጵያ',
    locationEn: 'Gondar City, Ethiopia',
    category: 'historical',
    unescoYear: 1979,
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    descriptionAm: 'በ17ኛውና በ18ኛው መቶ ክፍለ ዘመን የተገነቡ የነገሥታት አብያተ መንግሥታት፣ የጥበብ ውህዶችና የመዋኛ ገንዳዎች ያሉበት የኢትዮጵያ ካሜሎት።',
    descriptionEn: 'The residence of the Ethiopian emperor Fasilides and his successors in the 16th and 17th centuries, showcasing unique Afro-European architecture.',
    curatorName: 'ጎንደር የቅርስ አስጎብኝዎች ማህበር',
    curatorRole: 'አካባቢያዊ አስጎብኝ',
    likesCount: 8400,
    viewsCount: 39100,
    isVerified: true
  },
  {
    id: 'site-5',
    nameAm: 'የሐረር ጁጎል ታሪካዊ ግንብ ከተማ',
    nameEn: 'Harar Jugol, Historic Fortified Town',
    locationAm: 'ሐረር፣ ምስራቅ ኢትዮጵያ',
    locationEn: 'Harar, Eastern Ethiopia',
    category: 'cultural',
    unescoYear: 2006,
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    descriptionAm: 'በ16ኛው መቶ ክፍለ-ዘመን በግንብ የታጠረችው ጥንታዊት ከተማ፤ 82 መስጊዶች፣ 102 የቅዱሳን መካነ መቃብሮችና ልዩ የባህል ተስማሚነት ያለባት የሰላም ምድር።',
    descriptionEn: 'Historic fortified town considered the fourth holy city of Islam, with 82 mosques and unique traditional Harari townhouses.',
    curatorName: 'ሐረሪ የቱሪዝም ቢሮ',
    curatorRole: 'መንግስታዊ ተወካይ',
    likesCount: 7600,
    viewsCount: 35000,
    isVerified: true
  },
  {
    id: 'site-6',
    nameAm: 'የኮንሶ የባህል መልክአ-ምድርና እርከን',
    nameEn: 'Konso Cultural Landscape & Terraces',
    locationAm: 'ኮንሶ፣ ደቡብ ኢትዮጵያ',
    locationEn: 'Konso, Southern Ethiopia',
    category: 'living_culture',
    unescoYear: 2011,
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    descriptionAm: 'ከድንጋይ የተገነቡ ታሪካዊ የእርከን ስራዎች፣ የተቀረጹ የእንጨት ሀውልቶች (ዋቃ) እና ከትውልድ ወደ ትውልድ የተሸጋገረ የተፈጥሮ ጥበቃ ጥበብ።',
    descriptionEn: 'Spectacular dry stone terracing and walled settlements demonstrating a shared cultural engineering adaptation lasting over 400 years.',
    curatorName: 'የኮንሶ ባህል ልማት ማህበር',
    curatorRole: 'የዩኔስኮ አጋር',
    likesCount: 6500,
    viewsCount: 29800,
    isVerified: true
  }
];

interface HouseTourismHeritageProps {
  currentLang?: AppLanguage;
}

export const HouseTourismHeritage: React.FC<HouseTourismHeritageProps> = ({
  currentLang = 'am'
}) => {
  const [sites, setSites] = useState<HeritageSite[]>(INITIAL_HERITAGE_SITES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLikedSites, setUserLikedSites] = useState<Set<string>>(new Set());
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form for adding a new heritage/tourism destination
  const [newSite, setNewSite] = useState({
    name: '',
    location: '',
    category: 'cultural' as HeritageSite['category'],
    imageUrl: '',
    description: '',
    curatorName: '',
    curatorRole: 'አካባቢያዊ አስጎብኝ' as HeritageSite['curatorRole']
  });

  const handleLike = (id: string) => {
    setUserLikedSites((prev) => {
      const next = new Set(prev);
      const isLiked = next.has(id);
      if (isLiked) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setSites((sList) =>
        sList.map((s) =>
          s.id === id ? { ...s, likesCount: s.likesCount + (isLiked ? -1 : 1) } : s
        )
      );
      return next;
    });
  };

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite.name || !newSite.description) return;

    const added: HeritageSite = {
      id: `site-${Date.now()}`,
      nameAm: newSite.name,
      nameEn: newSite.name,
      locationAm: newSite.location || 'ኢትዮጵያ / አለም አቀፍ',
      locationEn: newSite.location || 'Ethiopia / Global',
      category: newSite.category,
      imageUrl: newSite.imageUrl || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
      descriptionAm: newSite.description,
      descriptionEn: newSite.description,
      curatorName: newSite.curatorName || 'አካባቢያዊ አስጎብኝ',
      curatorRole: newSite.curatorRole,
      likesCount: 1,
      viewsCount: 1,
      isVerified: false
    };

    setSites([added, ...sites]);
    setIsSubmitModalOpen(false);
    setNewSite({
      name: '',
      location: '',
      category: 'cultural',
      imageUrl: '',
      description: '',
      curatorName: '',
      curatorRole: 'አካባቢያዊ አስጎብኝ'
    });
  };

  const filteredSites = sites.filter((site) => {
    const matchesCat = selectedCategory === 'all' || site.category === selectedCategory;
    const matchesQuery =
      site.nameAm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.locationAm.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Heritage Showcase Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/70 via-emerald-950/40 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Landmark className="w-3.5 h-3.5" />
              <span>የ16ኛው ቤት አለም አቀፍ የቱሪዝም እና የቅርስ ኤክስፖ (Global Heritage Platform)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              የአለማችን ህዝቦች ታሪካዊ፣ ባህላዊና ተፈጥሯዊ ቅርሶች ማዕከል
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ግለሰቦች፣ ማህበራትና መንግስታት የሀገራቸውንና የአለምን ድንቅ ቅርሶች፣ የቱሪዝም መዳረሻዎችና ጥንታዊ ስልጣኔዎችን የሚያስተዋውቁበት፤ በአስጎብኝና በጎብኝ ሚና የሚገናኙበት ዲጂታል አጎራ።
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              <span>አዲስ ቅርስ / መዳረሻ መዝግብ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'all', label: 'ሁሉም ቅርሶች (All)' },
            { id: 'cultural', label: 'ባህላዊ (Cultural)' },
            { id: 'historical', label: 'ታሪካዊ (Historical)' },
            { id: 'natural', label: 'ተፈጥሯዊ (Natural)' },
            { id: 'living_culture', label: 'ህያው ባህል (Living)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ቅርሶችንና መዳረሻዎችን ፈልግ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Heritage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => {
          const isLiked = userLikedSites.has(site.id);

          return (
            <div
              key={site.id}
              className="bg-[#111625] border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 flex flex-col shadow-xl group"
            >
              {/* Image Preview */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={site.imageUrl}
                  alt={site.nameAm}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {site.unescoYear && (
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-900/90 text-indigo-200 border border-indigo-500/40 text-[10px] font-black flex items-center gap-1 shadow-md">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>UNESCO {site.unescoYear}</span>
                    </span>
                  )}
                  {site.isVerified && (
                    <span className="px-2 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>የተረጋገጠ</span>
                    </span>
                  )}
                </div>

                {/* Location at bottom of image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1.5 font-bold truncate max-w-[80%]">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{site.locationAm}</span>
                  </div>
                  <span className="text-[11px] text-slate-300 flex items-center gap-1 shrink-0">
                    <Eye className="w-3 h-3" />
                    <span>{site.viewsCount.toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Site Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                    {site.nameAm}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {site.nameEn}
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {site.descriptionAm}
                  </p>
                </div>

                {/* Curator & Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-semibold">የቅርስ አስጎብኝ / ተቆጣጣሪ፡</span>
                    <span className="font-bold text-amber-300">{site.curatorName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(site.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        isLiked
                          ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                      <span>{site.likesCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Heritage Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#101524] border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                <span>አዲስ የቱሪዝም ወይም የቅርስ መዳረሻ መዝግብ</span>
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSite} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">የቅርስ / የመዳረሻ ስም *</label>
                <input
                  type="text"
                  required
                  placeholder="ምሳሌ፡ የገዳ ስርአት፣ የሰሜን ተራሮች..."
                  value={newSite.name}
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">አድራሻ / ከተማ</label>
                  <input
                    type="text"
                    placeholder="ምሳሌ፡ ሐረር፣ ኦሮሚያ፣ አፋር..."
                    value={newSite.location}
                    onChange={(e) => setNewSite({ ...newSite, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ምድብ</label>
                  <select
                    value={newSite.category}
                    onChange={(e) => setNewSite({ ...newSite, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="cultural">ባህላዊ (Cultural)</option>
                    <option value="historical">ታሪካዊ (Historical)</option>
                    <option value="natural">ተፈጥሯዊ (Natural)</option>
                    <option value="living_culture">ህያው ባህል (Living Culture)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">የፎቶ ማስፈንጠሪያ (Image URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newSite.imageUrl}
                  onChange={(e) => setNewSite({ ...newSite, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">ዝርዝር ታሪካዊ መግለጫ *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="የቅርሱ ታሪክ፣ አመሰራረትና ለአለም ያለው ፋይዳ..."
                  value={newSite.description}
                  onChange={(e) => setNewSite({ ...newSite, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">አስመዝጋቢ አስጎብኝ / ድርጅት</label>
                  <input
                    type="text"
                    placeholder="ስምዎ ወይም የመስሪያ ቤቱ ስም"
                    value={newSite.curatorName}
                    onChange={(e) => setNewSite({ ...newSite, curatorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ሚና</label>
                  <select
                    value={newSite.curatorRole}
                    onChange={(e) => setNewSite({ ...newSite, curatorRole: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="አካባቢያዊ አስጎብኝ">አካባቢያዊ አስጎብኝ</option>
                    <option value="የቅርስ ተመራማሪ">የቅርስ ተመራማሪ</option>
                    <option value="መንግስታዊ ተወካይ">መንግስታዊ ተወካይ</option>
                    <option value="የዩኔስኮ አጋር">የዩኔስኮ አጋር</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl shadow-lg cursor-pointer"
                >
                  በኤክስፖው ላይ መዝግብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
