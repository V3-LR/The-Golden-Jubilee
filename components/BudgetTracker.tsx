
import React, { useState } from 'react';
import { Budget, Guest, Quotation } from '../types';
import { QUOTATIONS } from '../constants';
import { 
  TrendingDown, 
  TrendingUp, 
  CheckCircle, 
  Calculator, 
  AlertCircle, 
  ThumbsUp, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Music,
  Camera,
  Home,
  Wine,
  Table,
  Sparkles,
  UserCheck,
  Edit2,
  Save,
  Phone,
  User,
  UtensilsCrossed,
  ChefHat,
  Lock,
  Unlock,
  Sun,
  Trees
} from 'lucide-react';

interface BudgetTrackerProps {
  budget: Budget;
  guests: Guest[];
  onUpdateBudget: (updates: Partial<Budget>) => void;
  isPlanner: boolean;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budget, guests, onUpdateBudget, isPlanner }) => {
  const [selectedQuoteIdx, setSelectedQuoteIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showCateringDetail, setShowCateringDetail] = useState(false);
  const [isCateringLocked, setIsCateringLocked] = useState(false);
  
  const quote = QUOTATIONS[selectedQuoteIdx];
  const pax = budget.finalCateringPax;

  const calculateCateringDetails = (q: Quotation) => {
    const breakfastTotal = q.breakfast * 2 * pax;
    const lunchTotal = q.lunch * 2 * pax;
    const dinnerTotal = q.dinner * 1 * pax;
    const galaTotal = q.galaDinner * pax;
    return {
      breakfastTotal,
      lunchTotal,
      dinnerTotal,
      galaTotal,
      grandTotal: breakfastTotal + lunchTotal + dinnerTotal + galaTotal
    };
  };

  const catering = calculateCateringDetails(quote);
  const resortGuestCount = guests.filter(g => g.property === 'Resort' || g.property === 'TreeHouse').length;
  const roomCostTotal = quote.roomRate * (resortGuestCount / 2) * 2; 
  
  const villaTotal = budget.villaRate * budget.villaNights;
  const djTotal = budget.djRate * budget.djNights;
  const fixedCostsTotal = villaTotal + djTotal + budget.photoRate + budget.decorRate + budget.furnitureRate + budget.bartenderRate + budget.accessoriesRate;
  
  const totalProjected = catering.grandTotal + roomCostTotal + quote.venueRental + fixedCostsTotal;
  const isOverBudget = totalProjected > budget.totalBudget;

  const eventEssentials = [
    { key: 'villaRate', label: "2 Villa Stay Cost", value: villaTotal, icon: Home, detail: `₹${budget.villaRate.toLocaleString()} x ${budget.villaNights}`, editKey: 'villaRate', multiplier: budget.villaNights, multiplierKey: 'villaNights' },
    { key: 'djRate', label: "DJ Savio", value: djTotal, icon: Music, detail: `₹${budget.djRate.toLocaleString()} x ${budget.djNights}`, editKey: 'djRate', multiplier: budget.djNights, multiplierKey: 'djNights' },
    { key: 'photoRate', label: "Photo (4hrs)", value: budget.photoRate, icon: Camera, detail: "Fixed Rate", editKey: 'photoRate' },
    { key: 'decorRate', label: "Decoration", value: budget.decorRate, icon: Sparkles, detail: "Theme Setup", editKey: 'decorRate' },
    { key: 'furnitureRate', label: "Chair and Table", value: budget.furnitureRate, icon: Table, detail: "Seating Rental", editKey: 'furnitureRate' },
    { key: 'bartenderRate', label: "Bar Tender", value: budget.bartenderRate, icon: Wine, detail: "Service Fee", editKey: 'bartenderRate' },
    { key: 'accessoriesRate', label: "Accessories", value: budget.accessoriesRate, icon: Sparkles, detail: "Props", editKey: 'accessoriesRate' }
  ];

  return (
    <div className="space-y-8 md:space-y-10 pb-12 md:pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="px-1">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">Golden Jubilee <br/><span className="text-[#B8860B]">Financial Dashboard</span></h2>
          <p className="text-stone-500 text-sm italic mt-2">Harmonizing the ₹{budget.totalBudget.toLocaleString()} legacy celebration.</p>
        </div>
        <div className="flex flex-col items-stretch md:items-end gap-4 w-full md:w-auto">
          <div className="flex bg-[#D4AF37]/10 p-1 rounded-2xl border border-[#D4AF37]/20 overflow-x-auto no-scrollbar scroll-smooth">
            {QUOTATIONS.map((q, i) => (
              <button
                key={q.vendorName}
                onClick={() => setSelectedQuoteIdx(i)}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedQuoteIdx === i ? 'bg-[#D4AF37] text-stone-900 shadow-md scale-105' : 'text-[#B8860B] hover:bg-white/50'
                }`}
              >
                {q.vendorName.includes('Divyanshi') ? 'Divyanshi' : q.vendorName.includes('Marinha') ? 'Resort' : 'TreeHouse'}
              </button>
            ))}
          </div>
          {isPlanner && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                isEditing ? 'bg-[#B8860B] text-white shadow-xl' : 'bg-stone-900 text-white hover:bg-stone-800 shadow-md'
              }`}
            >
              {isEditing ? <Save size={14} /> : <Edit2 size={14} />}
              {isEditing ? 'Save Financials' : 'Modify Line Items'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl relative overflow-hidden transition-all duration-700 border-t border-white/20 ${isOverBudget ? 'bg-[#1a1a1a] text-white' : 'gold-shimmer text-stone-900'}`}>
          <Sun className="absolute -top-10 -right-10 opacity-10" size={150} />
          <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-4 ${isOverBudget ? 'text-stone-400' : 'text-stone-900/60'}`}>Grand Jubilee Estimate</p>
          <p className="text-3xl md:text-6xl font-serif font-bold">₹{totalProjected.toLocaleString()}</p>
          <div className="mt-6 md:mt-8">
            {isOverBudget ? (
              <span className="flex items-center gap-2 text-red-400 text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-full w-fit border border-red-400/20 uppercase tracking-widest">
                <TrendingUp size={12} /> ₹{(totalProjected - budget.totalBudget).toLocaleString()} Above
              </span>
            ) : (
              <span className="flex items-center gap-2 text-stone-900 text-[10px] font-bold bg-white/30 backdrop-blur px-3 py-1.5 rounded-full w-fit border border-white/20 uppercase tracking-widest">
                <TrendingDown size={12} /> ₹{(budget.totalBudget - totalProjected).toLocaleString()} Within
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-[#D4AF37]/20 shadow-lg flex flex-col justify-between relative group">
          <div className="absolute top-0 right-0 p-6 md:p-8 text-[#D4AF37]/10 transition-colors hidden md:block">
            <Home size={60} />
          </div>
          <div>
            <p className="text-[#B8860B] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-4">Captivated Fixed Costs</p>
            <p className="text-3xl md:text-5xl font-serif font-bold text-stone-900">₹{fixedCostsTotal.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2 mt-6 md:mt-8 text-[9px] text-[#B8860B] font-black uppercase tracking-widest">
            <UserCheck size={12} />
            <span>Villa & Entertainment Locked</span>
          </div>
        </div>

        <button 
          onClick={() => setShowCateringDetail(!showCateringDetail)}
          className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border transition-all duration-500 flex flex-col justify-between text-left group relative overflow-hidden ${showCateringDetail ? 'bg-[#1a1a1a] border-stone-800 shadow-xl' : 'bg-white border-[#D4AF37]/20 hover:border-[#D4AF37] shadow-lg'}`}
        >
          {showCateringDetail && <Sun className="absolute -bottom-6 -left-6 text-white/5" size={100} />}
          <div>
            <div className="flex justify-between items-center mb-2 md:mb-4">
              <p className={`${showCateringDetail ? 'text-stone-500' : 'text-[#B8860B]'} text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]`}>Catering ({pax} Pax)</p>
              <div className={`p-2 rounded-full transition-colors ${showCateringDetail ? 'bg-[#D4AF37] text-[#1a1a1a]' : 'bg-[#FEF9E7] text-[#B8860B]'}`}>
                {showCateringDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </div>
            <p className={`text-3xl md:text-5xl font-serif font-bold transition-colors ${showCateringDetail ? 'text-white' : 'text-stone-900'}`}>₹{catering.grandTotal.toLocaleString()}</p>
          </div>
          <p className={`text-[9px] mt-6 md:mt-8 font-black uppercase tracking-widest transition-colors ${showCateringDetail ? 'text-[#D4AF37]' : 'text-stone-400 group-hover:text-[#B8860B]'}`}>
            {showCateringDetail ? 'Close Details' : 'Interactive Quote Suite'}
          </p>
        </button>
      </div>

      {showCateringDetail && (
        <div className="bg-[#1a1a1a] rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 border border-[#D4AF37]/10 animate-in slide-in-from-top-4 duration-700 shadow-2xl relative overflow-hidden">
          <UtensilsCrossed className="absolute top-0 right-0 p-6 md:p-12 opacity-5 pointer-events-none text-[#D4AF37]" size={200} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 relative z-10">
            <div className="space-y-8 md:space-y-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[#D4AF37] font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-2 md:mb-4 block">Selected Culinary Partner</span>
                  <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 md:mb-8">{quote.vendorName}</h3>
                </div>
                {isPlanner && (
                  <button 
                    onClick={() => setIsCateringLocked(!isCateringLocked)}
                    className={`p-4 md:p-5 rounded-full border transition-all duration-500 ${isCateringLocked ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1a1a1a]' : 'bg-stone-800 border-stone-700 text-stone-500 hover:text-[#D4AF37]'}`}
                  >
                    {isCateringLocked ? <Lock size={20} /> : <Unlock size={20} />}
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <a href={`tel:${quote.phoneNumber}`} className="bg-white/5 backdrop-blur p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 hover:border-[#D4AF37]/30 transition-all">
                  <div className="flex items-center gap-3 mb-2 text-[#D4AF37]">
                    <User size={16} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-stone-500">Liaison</span>
                  </div>
                  <p className="text-xl md:text-2xl font-serif font-bold text-white">{quote.contactPerson}</p>
                </a>
                <a href={`tel:${quote.phoneNumber}`} className="bg-white/5 backdrop-blur p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 hover:border-[#D4AF37]/30 transition-all">
                  <div className="flex items-center gap-3 mb-2 text-[#D4AF37]">
                    <Phone size={16} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-stone-500">Call Now</span>
                  </div>
                  <p className="text-xl md:text-2xl font-serif font-bold text-white">{quote.phoneNumber}</p>
                </a>
              </div>

              <div>
                <span className="text-[#D4AF37] font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-4 md:mb-6 block">Menu Highlights</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {quote.menuHighlights?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/5 p-4 md:p-5 rounded-2xl border border-white/5">
                      <ChefHat size={16} className="text-[#D4AF37] shrink-0" />
                      <span className="text-stone-300 font-bold text-xs md:text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-inner flex flex-col justify-between">
              <div>
                <h4 className="text-xl md:text-3xl font-serif font-bold text-stone-900 mb-6 md:mb-10">Jubilee Numbers</h4>

                <div className="space-y-6 md:space-y-8">
                  <div className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all ${isPlanner && !isCateringLocked ? 'bg-[#FEF9E7]/50 border-[#D4AF37]/30 shadow-lg' : 'bg-stone-50 border-stone-100'}`}>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#B8860B] mb-4 block">Total Confirmed Guests</label>
                    <div className="flex flex-col gap-4">
                      {isPlanner && !isCateringLocked ? (
                        <>
                          <input 
                            type="range" 
                            min="20" 
                            max="100" 
                            value={pax}
                            onChange={(e) => onUpdateBudget({ finalCateringPax: Number(e.target.value) })}
                            className="flex-grow accent-[#D4AF37] h-2 bg-stone-200 rounded-full"
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-serif font-bold text-stone-900">{pax}</span>
                            <span className="text-[9px] text-[#B8860B] font-black bg-white px-3 py-1 rounded-full border border-[#D4AF37]/20 uppercase">Drag to Adjust</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-end gap-2">
                          <p className="text-4xl md:text-6xl font-serif font-bold text-stone-900">{pax}</p>
                          <span className="text-[9px] text-stone-400 font-black uppercase mb-2 md:mb-3">Guests</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    {[
                      { l: 'Boutique Breakfast (2d)', v: catering.breakfastTotal },
                      { l: 'Goan Coastal Lunch (2d)', v: catering.lunchTotal },
                      { l: 'Estate Standard Dinner', v: catering.dinnerTotal },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-stone-500 font-medium">{row.l}</span>
                        <span className="text-stone-900 font-bold">₹{row.v.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-stone-900 font-bold border-t border-[#D4AF37]/10 pt-4 mt-2">
                      <span className="text-base font-serif">Culinary Total</span>
                      <span className="text-xl md:text-3xl font-serif text-[#B8860B]">₹{catering.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-12 flex items-start md:items-center gap-3 p-4 bg-[#FEF9E7] rounded-2xl text-[#B8860B] border border-[#D4AF37]/20">
                <Info size={16} className="shrink-0 mt-0.5 md:mt-0" />
                <p className="font-bold uppercase tracking-widest text-[8px] md:text-[9px] leading-relaxed">
                  Status: {isCateringLocked ? "CONTRACT SUBMISSION LOCKED" : "OPEN FOR FINAL REFINEMENT"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-[#D4AF37]/20 shadow-xl overflow-hidden">
        <div className="p-6 md:p-10 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl md:text-3xl font-serif font-bold text-stone-900">Captured Expenses</h3>
          <div className="flex items-center gap-2 bg-[#FEF9E7] px-4 py-1.5 rounded-full border border-[#D4AF37]/20 w-fit">
            <CheckCircle className="text-[#D4AF37]" size={14} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#B8860B]">
              Verified Gold-Tier Costs
            </span>
          </div>
        </div>
        <div className="p-6 md:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {eventEssentials.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-500 flex flex-col gap-4 group ${isEditing ? 'border-[#D4AF37] bg-[#FEF9E7]/30 shadow-inner' : 'bg-[#FEF9E7]/10 border-[#D4AF37]/10'}`}>
                <div className="flex justify-between items-start">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${isEditing ? 'bg-[#D4AF37] text-stone-900' : 'bg-white text-[#B8860B]'}`}>
                    <Icon size={20} />
                  </div>
                  {!isEditing ? (
                    <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-stone-100">{item.detail}</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={item.multiplier || 1}
                        onChange={(e) => item.multiplierKey && onUpdateBudget({ [item.multiplierKey]: Number(e.target.value) })}
                        className="w-10 text-center bg-white border border-[#D4AF37]/30 rounded-lg text-[10px] py-1 font-bold outline-none"
                        disabled={!item.multiplierKey}
                      />
                      <span className="text-[8px] text-[#B8860B] font-black">QTY</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-stone-400 text-[8px] md:text-[9px] uppercase font-black tracking-[0.2em] mb-1">{item.label}</h4>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[#B8860B] font-black text-xs">₹</span>
                      <input 
                        type="number" 
                        value={budget[item.editKey as keyof Budget]}
                        onChange={(e) => onUpdateBudget({ [item.editKey]: Number(e.target.value) })}
                        className="w-full bg-white border border-[#D4AF37]/30 rounded-lg px-3 py-1.5 text-base font-serif font-bold focus:border-[#D4AF37] outline-none transition-all"
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-serif font-bold text-stone-900">₹{item.value.toLocaleString()}</p>
                  )}
                </div>
              </div>
            );
          })}
          
          <div className="p-8 md:p-10 gold-shimmer text-stone-900 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-center items-center text-center shadow-xl transition-all hover:scale-[1.03] group relative overflow-hidden">
            <Sun className="absolute -top-6 -right-6 opacity-10" size={100} />
            <p className="text-[8px] md:text-[9px] uppercase font-black tracking-[0.3em] opacity-60 mb-1">Fixed Cost Subtotal</p>
            <p className="text-2xl md:text-4xl font-serif font-bold tracking-tight">₹{fixedCostsTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-stone-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 border border-[#D4AF37]/30 flex flex-col md:flex-row gap-8 md:gap-12 items-center relative overflow-hidden shadow-2xl">
        <Trees className="absolute -bottom-10 -right-10 text-white/5" size={200} />
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/10 w-full md:w-auto text-center shrink-0">
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-1">Jubilee Coverage</p>
          <div className="text-4xl md:text-5xl font-serif font-bold text-white">
            {Math.round((totalProjected / budget.totalBudget) * 100)}%
          </div>
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-[#D4AF37] mb-3 tracking-tight">Financial Legacy Verification</h3>
          <p className="text-sm md:text-lg text-stone-300 leading-relaxed italic font-light">
            "Mapped heritage stay, secured talent, and balanced the catering. Liquidity remaining: ₹{(budget.totalBudget - totalProjected).toLocaleString()}."
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
