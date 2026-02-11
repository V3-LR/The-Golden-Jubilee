import React, { useState } from 'react';
import { Budget, Guest, Quotation, BudgetItem } from '../types';
import { QUOTATIONS } from '../constants';
import { 
  CheckCircle, 
  Edit2, 
  Save, 
  Phone, 
  ChefHat, 
  Wallet, 
  Gauge, 
  AlertCircle,
  Activity,
  Zap,
  Hotel,
  Plus,
  Trash2,
  ShieldCheck,
  Smartphone,
  Info,
  Sparkles,
  ShieldAlert,
  Heart,
  TrendingDown,
  ArrowRight
} from 'lucide-react';

interface BudgetTrackerProps {
  budget: Budget;
  guests: Guest[];
  onUpdateBudget: (updates: Partial<Budget>) => void;
  isPlanner: boolean;
  onFinalizePath: (path: 'Villa' | 'Resort') => void;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budget, guests, onUpdateBudget, isPlanner, onFinalizePath }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const paxCount = guests.filter(g => g.status === 'Confirmed').length;

  const calculateCateringDetails = (q: Quotation) => {
    const breakfastTotal = q.breakfast * 2 * paxCount;
    const lunchTotal = q.lunch * 2 * paxCount;
    const dinnerTotal = q.dinner * 1 * paxCount;
    const galaTotal = q.galaDinner * paxCount;
    return {
      grandTotal: breakfastTotal + lunchTotal + dinnerTotal + galaTotal
    };
  };

  const villaQuote = QUOTATIONS[0];
  const resortQuote = QUOTATIONS[1];

  const villaCatering = calculateCateringDetails(villaQuote).grandTotal;
  const resortCatering = calculateCateringDetails(resortQuote).grandTotal;

  // Static Logic for Variance Report based on Prompt numbers
  const varianceReport = {
    resort: {
      stay: 132000,
      venue: 200000,
      catering: 103500,
      misc: 50000,
      total: 485500
    },
    villa: {
      stay: 120000,
      venue: 40000,
      catering: 90000,
      misc: 60000,
      total: 310000
    }
  };

  const savings = varianceReport.resort.total - varianceReport.villa.total;
  const stressScoreResort = 15;
  const stressScoreVilla = 80;

  const currentSpend = budget.selectedPath === 'Villa' ? varianceReport.villa.total : (budget.selectedPath === 'Resort' ? varianceReport.resort.total : 0);
  const wishlistTotal = budget.wishlistItems?.reduce((acc, curr) => acc + curr.cost, 0) || 0;

  const authorizeWishlistItem = (item: BudgetItem) => {
    const updatedWishlist = budget.wishlistItems.filter(i => i.id !== item.id);
    onUpdateBudget({
      committedSpend: (budget.committedSpend || 0) + item.cost,
      wishlistItems: updatedWishlist
    });
  };

  const deleteWishlistItem = (id: string) => {
    const updatedWishlist = budget.wishlistItems.filter(i => i.id !== id);
    onUpdateBudget({ wishlistItems: updatedWishlist });
  };

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      {/* 1. Organizer Status Bar */}
      <section className="bg-stone-900 text-[#F3E5AB] p-8 md:p-12 rounded-[3rem] shadow-2xl border border-[#D4AF37]/50 relative overflow-hidden">
        <Activity className="absolute -top-10 -right-10 opacity-5" size={300} />
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.5em] mb-2">Organizer Decision Center</p>
              <h2 className="text-2xl md:text-3xl font-serif tracking-widest uppercase font-bold text-white">Path Finalization</h2>
              <div className="flex items-center gap-3 mt-4">
                 <span className={`px-4 py-1.5 rounded-full text-[10px] border font-black uppercase tracking-widest ${budget.selectedPath === 'Villa' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-stone-800 text-stone-500 border-stone-700'}`}>
                    {budget.selectedPath === 'Villa' ? 'Villa Path Committed' : 'Path Undecided'}
                 </span>
                 <p className="text-stone-500 text-xs font-bold uppercase tracking-widest italic">Budget Cap: ₹4,00,000</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10">
               <TrendingDown className="text-green-400" size={32} />
               <div>
                  <p className="text-[9px] font-black uppercase text-stone-500 mb-1">Potential Savings</p>
                  <p className="text-xl font-bold text-white uppercase tracking-widest">₹{savings.toLocaleString()}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Budget Variance Report Table */}
      <section className="bg-white rounded-[4rem] p-10 md:p-16 border border-stone-100 shadow-xl overflow-hidden">
        <div className="mb-12">
          <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4 tracking-tight">Financial Comparison</h3>
          <p className="text-stone-500 italic">"The Villa choice allows reinvestment into premium 'Delhi-Style' experience."</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-[10px] font-black uppercase tracking-widest text-stone-400">
                <th className="px-8 py-6 rounded-tl-3xl">Category</th>
                <th className="px-8 py-6">Resort Path (A)</th>
                <th className="px-8 py-6">Villa Path (B)</th>
                <th className="px-8 py-6 rounded-tr-3xl text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {[
                { label: 'Stay (45 Pax)', r: varianceReport.resort.stay, v: varianceReport.villa.stay, note: 'Villa provides private estate feel.' },
                { label: 'Venue Hire', r: varianceReport.resort.venue, v: varianceReport.villa.venue, note: 'Resort Path includes heavy Hall Rental.' },
                { label: 'Catering (Delhi Std)', r: varianceReport.resort.catering, v: varianceReport.villa.catering, note: 'External catering allows menu control.' },
                { label: 'Misc/Vendors', r: varianceReport.resort.misc, v: varianceReport.villa.misc, note: 'DJ, Decor, Photography Pkg.' },
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-[#FCFAF2]/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-stone-900">{row.label}</p>
                    <p className="text-[9px] text-stone-400 uppercase tracking-widest font-black">{row.note}</p>
                  </td>
                  <td className="px-8 py-6 text-stone-500 font-medium">₹{row.r.toLocaleString()}</td>
                  <td className="px-8 py-6 text-stone-900 font-bold">₹{row.v.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right">
                    <span className={`text-xs font-black uppercase tracking-widest ${row.r - row.v > 0 ? 'text-green-500' : 'text-stone-400'}`}>
                      {row.r - row.v > 0 ? `+ ₹${(row.r - row.v).toLocaleString()}` : `- ₹${Math.abs(row.r - row.v).toLocaleString()}`}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-stone-900 text-white">
                <td className="px-8 py-8 rounded-bl-3xl font-serif text-2xl font-bold">Projected Total</td>
                <td className="px-8 py-8 text-stone-400 font-bold">₹{varianceReport.resort.total.toLocaleString()}</td>
                <td className="px-8 py-8 text-[#D4AF37] font-bold text-2xl">₹{varianceReport.villa.total.toLocaleString()}</td>
                <td className="px-8 py-8 rounded-br-3xl text-right">
                  <span className="text-xl font-black text-green-400">₹{savings.toLocaleString()} Saved</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Savings vs Stress Tax Visualization */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-xl space-y-8">
            <h3 className="text-2xl font-serif font-bold text-stone-900">Stress / Effort Tax</h3>
            <div className="space-y-10 pt-4">
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                     <span>Option A: Resort (Low Stress)</span>
                     <span className="text-green-500">15/100</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 w-[15%] transition-all duration-1000"></div>
                  </div>
                  <p className="text-[10px] text-stone-400 italic">"You are basically a guest. Staff handles everything."</p>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                     <span>Option B: Bespoke Villa (High Stress)</span>
                     <span className="text-red-500">80/100</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                     <div className="h-full bg-red-500 w-[80%] shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all duration-1000"></div>
                  </div>
                  <p className="text-[10px] text-stone-400 italic">"You are the Production Manager. Multiple vendor sync."</p>
               </div>
            </div>
         </div>

         <div className="bg-stone-900 p-12 rounded-[4rem] text-[#F3E5AB] flex flex-col justify-center space-y-8">
            <div className="flex items-center gap-4">
               <ShieldAlert className="text-[#D4AF37]" size={40} />
               <h3 className="text-2xl font-serif font-bold text-white">The Organizer's Strategy</h3>
            </div>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><CheckCircle size={20} className="text-green-400" /></div>
                  <p className="text-sm font-light text-stone-300 leading-relaxed"><strong className="text-white">Reinvest in Service:</strong> Hire a Local Runner for ₹20k to handle the Goa "running around".</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><CheckCircle size={20} className="text-green-400" /></div>
                  <p className="text-sm font-light text-stone-300 leading-relaxed"><strong className="text-white">Upgrade the Vibe:</strong> Use ₹30k for extra Fairy Lights & Edison bulbs for that "Rich" feel.</p>
               </div>
            </div>
            
            <div className="pt-8 border-t border-white/10">
               {budget.selectedPath === 'TBD' ? (
                 <button 
                  onClick={() => onFinalizePath('Villa')}
                  className="w-full bg-[#D4AF37] text-stone-900 py-6 rounded-full font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.03] transition-all flex items-center justify-center gap-3"
                 >
                   Commit to Villa Path & Open Tasks <ArrowRight size={18} />
                 </button>
               ) : (
                 <div className="p-6 bg-white/5 rounded-3xl text-center border border-[#D4AF37]/30">
                    <p className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.4em]">Villa Production Path Activated</p>
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* 4. Wishlist Management */}
      <section className="bg-white rounded-[4rem] p-10 md:p-16 border border-stone-100 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
           <div>
              <p className="text-[#B8860B] font-black text-[10px] uppercase tracking-[0.4em] mb-2">Request Tracking</p>
              <h3 className="text-3xl font-serif font-bold text-stone-900">Wishlist & Upgrades</h3>
              <p className="text-stone-400 text-sm mt-1">Suggested by sisters/family; pending payment authorization.</p>
           </div>
           <div className="bg-stone-50 px-8 py-4 rounded-3xl border border-stone-100 text-center">
              <p className="text-[9px] font-black uppercase text-stone-400 mb-1">Potential Offset</p>
              <p className="text-2xl font-serif font-bold text-stone-900">₹{wishlistTotal.toLocaleString()}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {budget.wishlistItems?.map((item) => (
             <div key={item.id} className="p-8 rounded-[2.5rem] border border-stone-100 bg-[#FCFAF2] group hover:bg-white hover:border-[#D4AF37]/30 transition-all relative">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-400 group-hover:text-[#B8860B] shadow-sm">
                      <Sparkles size={18} />
                   </div>
                   <button onClick={() => deleteWishlistItem(item.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                   </button>
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-stone-900 mb-1">{item.label}</h4>
                <p className="text-2xl font-serif font-bold text-[#B8860B]">₹{item.cost.toLocaleString()}</p>
                <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between">
                   <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Lead: {item.lead}</span>
                   <button 
                     onClick={() => authorizeWishlistItem(item)}
                     className="bg-stone-900 text-white px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#B8860B] transition-all"
                   >
                     Approve
                   </button>
                </div>
             </div>
           ))}
           <button className="p-8 rounded-[2.5rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-3 text-stone-300 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all group">
              <Plus size={32} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Add Proposal</span>
           </button>
        </div>
      </section>

      {/* 5. Asset Unit Control */}
      {isEditing && (
        <section className="bg-[#FEF9E7] p-12 rounded-[4rem] border-4 border-[#D4AF37] grid grid-cols-1 md:grid-cols-3 gap-8 shadow-2xl animate-in slide-in-from-top-4">
          {[
            { k: 'villaRate', l: 'Villa Day Rate' },
            { k: 'djRate', l: 'DJ Savio Pkg' },
            { k: 'decorRate', l: 'Gold Theme Decor' },
            { k: 'photoRate', l: 'Photography Pkg' },
            { k: 'furnitureRate', l: 'Table Rentals' },
            { k: 'bartenderRate', l: 'Bar Staffing' }
          ].map((item, i) => (
            <div key={i} className="space-y-3">
              <label className="text-[10px] font-black uppercase text-[#B8860B] tracking-widest">{item.l}</label>
              <div className="flex items-center gap-2 bg-white px-5 py-4 rounded-2xl border border-[#D4AF37]/20">
                <span className="font-bold text-[#B8860B]">₹</span>
                <input 
                  type="number" 
                  value={budget[item.k as keyof Budget] as number}
                  onChange={(e) => onUpdateBudget({ [item.k]: Number(e.target.value) })}
                  className="w-full bg-transparent font-bold text-stone-900 outline-none"
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {isPlanner && (
        <div className="flex justify-center pt-10">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-3 px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              isEditing ? 'bg-[#B8860B] text-white shadow-xl' : 'bg-stone-100 text-stone-500 border border-stone-200'
            }`}
          >
            {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
            {isEditing ? 'Save Unit Rates' : 'Unlock Financial Controls'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;