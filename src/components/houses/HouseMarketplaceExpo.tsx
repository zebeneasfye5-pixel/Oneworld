import React, { useState } from 'react';
import { Store, Video, Volume2, ShoppingBag, Plus, Tag, CheckCircle2, X } from 'lucide-react';
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

interface HouseMarketplaceExpoProps {
  userBalanceETB: number;
  onPurchase: (amount: number, productTitle: string) => boolean;
}

export const HouseMarketplaceExpo: React.FC<HouseMarketplaceExpoProps> = ({
  userBalanceETB,
  onPurchase
}) => {
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

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('የቴክኖሎጂ ቁሳቁስ');
  const [newPrice, setNewPrice] = useState(2500);
  const [newDesc, setNewDesc] = useState('');

  const handleBuyNow = (product: ProductItem) => {
    if (userBalanceETB < product.priceETB) {
      alert(`ይቅርታ፣ በቂ ሂሳብ የለዎትም። የሚያስፈልገው፡ ${product.priceETB.toLocaleString()} ብር`);
      return;
    }

    const success = onPurchase(product.priceETB, `የምርት ግዢ (${product.title})`);
    if (!success) return;

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    alert(`የ"${product.title}" ግዢዎ በ${product.priceETB.toLocaleString()} ብር በተሳካ ሁኔታ ተፈፅሟል!\nደረሰኝ ተዘጋጅቷል፤ ሻጩ እቃውን ወዲያውኑ ይልካል።`);
  };

  const handleAddProduct = (e: React.FormEvent) => {
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
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
            9
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              የማስታወቂያ ቤትና የገበያ አዳራሽ (Global Expo & Marketplace)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              አምራቾች፣ ነጋዴዎች፣ ቴክኖሎጂዎችና አልባሳት በቪዲዮ፣ በምስልና በድምፅ የሚተዋወቁበትና ቀጥታ የመስመር ላይ ሽያጭ የሚፈፀምበት
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddProductOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-950 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ምርትዎን ያስተዋውቁ (Add Product)</span>
        </button>
      </div>

      {/* Products Grid */}
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
                  <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    ቪዲዮ ማሳያ
                  </span>
                )}
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-sm font-extrabold text-white leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {p.description}
                </p>
                <div className="text-[11px] text-slate-500">
                  ሻጭ፡ <strong className="text-slate-300">{p.seller}</strong>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2">
              <div>
                <span className="text-[10px] text-slate-400 block">ዋጋ፡</span>
                <span className="text-base font-black text-emerald-400">
                  {p.priceETB.toLocaleString()} ብር
                </span>
              </div>

              <button
                onClick={() => handleBuyNow(p)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>አሁን ግዛ (Buy)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#101524] border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">አዲስ ምርት ወይም ማስታወቂያ ማስተዋወቂያ</h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">የምርቱ ስም *</label>
                <input
                  type="text"
                  required
                  placeholder="የምርቱ ሙሉ ስም..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ዘርፍ</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="የቴክኖሎጂ ቁሳቁስ">የቴክኖሎጂ ቁሳቁስ</option>
                  <option value="የአልባሳትና ፋሽን">የአልባሳትና ፋሽን</option>
                  <option value="የምግብና መጠጥ">የምግብና መጠጥ (ቡና፣ ሰብል)</option>
                  <option value="ኢንዱስትሪና ኮንስትራክሽን">ኢንዱስትሪና ኮንስትራክሽን</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ዋጋ (በብር) *</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">የምርቱ መግለጫ</label>
                <textarea
                  rows={2}
                  placeholder="ዝርዝር መግለጫ..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ተመለስ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                >
                  ምርቱን ለጥፍ (Publish)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
