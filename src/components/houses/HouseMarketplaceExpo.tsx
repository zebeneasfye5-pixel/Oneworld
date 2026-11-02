import React, { useState } from 'react';
import { 
  Store, 
  Video, 
  Volume2, 
  ShoppingBag, 
  Plus, 
  Tag, 
  CheckCircle2, 
  X, 
  FileText, 
  MessageSquare, 
  Phone, 
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductItem {
  id: string;
  title: string;
  category: string;
  seller: string;
  priceETB: number;
  imageUrl: string;
  hasVideoShowcase: boolean;
  description: string;
  stock: number;
}

interface ClassifiedNotice {
  id: string;
  title: string;
  category: 'ስራ' | 'ቤትና ንብረት' | 'ሙያዊ አገልግሎት' | 'ጨረታና ጥሪ' | 'ሌሎች';
  posterName: string;
  phone: string;
  location: string;
  date: string;
  description: string;
  priceText?: string;
}

interface HouseMarketplaceExpoProps {
  userBalanceETB: number;
  onPurchase: (amount: number, productTitle: string) => boolean;
}

export const HouseMarketplaceExpo: React.FC<HouseMarketplaceExpoProps> = ({
  userBalanceETB,
  onPurchase
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'classifieds'>('products');

  // Video/Image Products
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'prod-1',
      title: 'የይርጋጨፌ ፕሪሚየም ኦርጋኒክ ቡና (Yirgacheffe Specialty Coffee)',
      category: 'የምግብና መጠጥ',
      seller: 'አቶ ዘበነ አስፍዬ የቡና ላኪ ድርጅት',
      priceETB: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
      hasVideoShowcase: true,
      description: 'ጥራት ያለው አንደኛ ደረጃ የይርጋጨፌ የተቆላ ቡና፤ በቀጥታ ከአምራቹ ወደ አለም ገበያ።',
      stock: 45
    },
    {
      id: 'prod-2',
      title: 'በእጅ የተጠለፈ የጥበብ ሀበሻ ቀሚስና ጋቢ (Traditional Embroidered Attire)',
      category: 'የአልባሳትና ፋሽን',
      seller: 'ሰባ ደረጃ ባህላዊ አልባሳት',
      priceETB: 8500,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      hasVideoShowcase: true,
      description: 'በጥራት የተሰራ ጥንታዊና ዘመናዊ የጥበብ ስራ ለሰርግና ለክብረ-በዓላት የሚሆን።',
      stock: 12
    },
    {
      id: 'prod-3',
      title: 'የፀሐይ ብርሃን ስማርት ኢንቨርተርና ባትሪ (Solar Smart Inverter 5KW)',
      category: 'የቴክኖሎጂ ቁሳቁስ',
      seller: 'ግሪን ኢነርጂ ሶሉሽንስ',
      priceETB: 42000,
      imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80',
      hasVideoShowcase: true,
      description: 'ለገጠርም ሆነ ለከተማ ቋሚ መብራት የሚያረጋግጥ ዘመናዊ የፀሐይ ሀይል ስርዓት።',
      stock: 8
    }
  ]);

  // Classified Text Notices
  const [classifieds, setClassifieds] = useState<ClassifiedNotice[]>([
    {
      id: 'not-1',
      title: 'የሙሉ ሰዓት ከፍተኛ የሶፍትዌር መሃንዲስ (Senior Fullstack Developer) ይፈለጋል',
      category: 'ስራ',
      posterName: 'አለም አንድ ቴክኖሎጂስ',
      phone: '0911223344',
      location: 'አዲስ አበባ / Remote',
      date: 'ዛሬ',
      description: 'በReact፣ Node.js እና WebSockets ልምድ ያለው ባለሙያ በአስቸኳይ ይፈለጋል። ደመወዝ በስምምነት።',
      priceText: 'ወርሃዊ ደመወዝ፡ 65,000+ ብር'
    },
    {
      id: 'not-2',
      title: 'በቦሌ መድሃኒያለም 3 መኝታ ቪላ ቤት የሚከራይ',
      category: 'ቤትና ንብረት',
      posterName: 'አማካሪ ዳዊት',
      phone: '0922334455',
      location: 'ቦሌ፣ አዲስ አበባ',
      date: 'ትላንት',
      description: 'ዘመናዊ ጥራት ያለው፣ የጥበቃ ካሜራና የውሃ ታንከር ያለው ሰፊ ቪላ ቤት ለረጅም ጊዜ ውል።',
      priceText: 'ዋጋ፡ 45,000 ብር / ወር'
    },
    {
      id: 'not-3',
      title: 'የህግና የውል ማርቀቅ ሙያዊ አማካሪ ድጋፍ',
      category: 'ሙያዊ አገልግሎት',
      posterName: 'ጠበቃ ዮናስ ተክሌ',
      phone: '0933445566',
      location: 'አዲስ አበባ',
      date: 'ከ2 ቀን በፊት',
      description: 'ለንግድ ድርጅቶች፣ ለሰርግ ውል እና ለንብረት ሽያጭ ህጋዊ ሰነዶችን በታማኝነት እናዘጋጃለን።',
      priceText: 'በቀጠሮ'
    }
  ]);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('የቴክኖሎጂ ቁሳቁስ');
  const [newPrice, setNewPrice] = useState(2500);
  const [newDesc, setNewDesc] = useState('');

  // New notice form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<ClassifiedNotice['category']>('ስራ');
  const [noticePhone, setNoticePhone] = useState('');
  const [noticeLocation, setNoticeLocation] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticePrice, setNoticePrice] = useState('');

  const handleBuyNow = (product: ProductItem) => {
    if (userBalanceETB < product.priceETB) {
      alert(`ይቅርታ፣ በቂ ሂሳብ የለዎትም። የሚያስፈልገው፡ ${product.priceETB.toLocaleString()} ብር`);
      return;
    }

    const success = onPurchase(product.priceETB, `የምርት ግዢ (${product.title})`);
    if (!success) return;

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ProductItem = {
      id: `prod-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      seller: 'እርስዎ (You - Merchant)',
      priceETB: Number(newPrice),
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      hasVideoShowcase: true,
      description: newDesc.trim() || 'ጥራት ያለው ምርት በቪዲዮ የቀረበ።',
      stock: 10
    };

    setProducts([newItem, ...products]);
    setIsAddProductOpen(false);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeDesc.trim()) return;

    const newNotice: ClassifiedNotice = {
      id: `not-${Date.now()}`,
      title: noticeTitle.trim(),
      category: noticeCategory,
      posterName: 'እርስዎ (Verified Member)',
      phone: noticePhone.trim() || '0911234567',
      location: noticeLocation.trim() || 'አዲስ አበባ',
      date: 'ዛሬ',
      description: noticeDesc.trim(),
      priceText: noticePrice.trim() || undefined
    };

    setClassifieds([newNotice, ...classifieds]);
    setIsAddNoticeOpen(false);
    setNoticeTitle('');
    setNoticeDesc('');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/50 via-teal-950/30 to-slate-900 border border-emerald-500/30 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
            9
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የማስታወቂያ ቤትና የገበያ አዳራሽ (Global Expo & Classifieds)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              ምርቶችን በቪዲዮና ምስል ማስተዋወቅ፣ ቀጥታ ሽያጭ መፈፀም እንዲሁም የጽሑፍ ዝርዝር ማስታወቂያዎችን መለጠፍ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'products' ? (
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ምርት በቪዲዮ መዝግብ</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddNoticeOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>የጽሑፍ ማስታወቂያ ለጥፍ</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs: Video Showcase vs Classified Text Notices */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'products'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>የቪዲዮና የምስል ምርቶች ማሳያ ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classifieds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'classifieds'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>የጽሑፍ ዝርዝር ማስታወቂያ ሰሌዳ ({classifieds.length})</span>
        </button>
      </div>

      {/* 1. Products Grid View */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-[#101524] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-emerald-500/50 transition-all"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101524] via-transparent to-transparent"></div>
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-amber-300 border border-slate-700">
                    {p.category}
                  </span>
                  {p.hasVideoShowcase && (
                    <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                      <Video className="w-3 h-3" />
                      4K ቪዲዮ ማሳያ
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-sm font-extrabold text-white leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {p.description}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    ሻጭ፡ <strong className="text-amber-400">{p.seller}</strong>
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">ዋጋ (Price)</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {p.priceETB.toLocaleString()} ብር
                  </span>
                </div>

                <button
                  onClick={() => handleBuyNow(p)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>አሁን ግዛ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Classifieds Text Board View */}
      {activeTab === 'classifieds' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classifieds.map((n) => (
              <div
                key={n.id}
                className="bg-[#101524] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {n.category}
                    </span>
                    <span className="text-[10px] text-slate-500">{n.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {n.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {n.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  {n.priceText && (
                    <div className="text-xs font-bold text-emerald-400 font-mono">
                      {n.priceText}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>{n.posterName} · {n.location}</span>
                    <a
                      href={`tel:${n.phone}`}
                      className="flex items-center gap-1 text-amber-400 hover:underline font-bold"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{n.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#101524] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-400" />
                <span>ምርትዎን በቪዲዮ ማሳያ ይመዝግቡ</span>
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">የምርቱ ስም *</label>
                <input
                  type="text"
                  required
                  placeholder="ምሳሌ፡ የኢትዮጵያ ንፁህ ማር..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ምድብ</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="የምግብና መጠጥ">የምግብና መጠጥ</option>
                    <option value="የአልባሳትና ፋሽን">የአልባሳትና ፋሽን</option>
                    <option value="የቴክኖሎጂ ቁሳቁስ">የቴክኖሎጂ ቁሳቁስ</option>
                    <option value="የእደ-ጥበብ ስራ">የእደ-ጥበብ ስራ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ዋጋ (ብር)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">ዝርዝር መግለጫ</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="የምርቱ ጥራት፣ መጠንና የአቅርቦት ሁኔታ..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                በገበያው ላይ ለጥፍ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Classified Notice Modal */}
      {isAddNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#101524] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>የጽሑፍ ማስታወቂያ ለጥፍ (Post Classified)</span>
              </h3>
              <button
                onClick={() => setIsAddNoticeOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">የማስታወቂያው አርዕስት *</label>
                <input
                  type="text"
                  required
                  placeholder="ምሳሌ፡ ልምድ ያለው ሹፌር ይፈለጋል..."
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ምድብ</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="ስራ">ስራ (Jobs)</option>
                    <option value="ቤትና ንብረት">ቤትና ንብረት (Property)</option>
                    <option value="ሙያዊ አገልግሎት">ሙያዊ አገልግሎት (Services)</option>
                    <option value="ጨረታና ጥሪ">ጨረታና ጥሪ (Tenders)</option>
                    <option value="ሌሎች">ሌሎች (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ስልክ ቁጥር</label>
                  <input
                    type="tel"
                    placeholder="09..."
                    value={noticePhone}
                    onChange={(e) => setNoticePhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ቦታ / ከተማ</label>
                  <input
                    type="text"
                    placeholder="ምሳሌ፡ አዲስ አበባ"
                    value={noticeLocation}
                    onChange={(e) => setNoticeLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ዋጋ / በጀት (አማራጭ)</label>
                  <input
                    type="text"
                    placeholder="ምሳሌ፡ 20,000 ብር"
                    value={noticePrice}
                    onChange={(e) => setNoticePrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">ዝርዝር ማብራሪያ *</label>
                <textarea
                  required
                  rows={3}
                  value={noticeDesc}
                  onChange={(e) => setNoticeDesc(e.target.value)}
                  placeholder="የማስታወቂያው ዝርዝር መስፈርቶች..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md"
              >
                በሰሌዳው ላይ ለጥፍ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
