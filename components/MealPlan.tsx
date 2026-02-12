
import React, { useState } from 'react';
import { Guest, Budget } from '../types';
import { MEAL_CONFIG } from '../constants';
import { Utensils, Coffee, Sun, Moon, Beer, GlassWater, Wine, User, ChevronDown, ChevronUp } from 'lucide-react';

interface MealPlanProps {
  guests: Guest[];
  budget: Budget;
  onUpdate: (id: string, updates: Partial<Guest>) => void;
  isPlanner: boolean;
}

const MealPlan: React.FC<MealPlanProps> = ({ guests, budget, onUpdate, isPlanner }) => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const confirmedGuests = guests.filter(g => g.status === 'Confirmed');
  
  const breakdown = budget.cateringBreakdown || {
    lunch17: { adultVeg: 0, adultNonVeg: 0, kidVeg: 0, kidNonVeg: 0 },
    dinner17: { adultVeg: 0, adultNonVeg: 0, kidVeg: 0, kidNonVeg: 0 },
    lunch18: { adultVeg: 0, adultNonVeg: 0, kidVeg: 0, kidNonVeg: 0 },
    gala18: { adultVeg: 0, adultNonVeg: 0, kidVeg: 0, kidNonVeg: 0 }
  };

  const mealLabels = {
    lunch17: { label: MEAL_CONFIG.lunch17, icon: Coffee, date: 'April 17' },
    dinner17: { label: MEAL_CONFIG.dinner17, icon: Moon, date: 'April 17' },
    lunch18: { label: MEAL_CONFIG.lunch18, icon: Sun, date: 'April 18' },
    gala18: { label: MEAL_CONFIG.gala18, icon: Utensils, date: 'April 18' }
  };

  const bar = budget.barInventory || { urakLitres: 0, beerCases: 0, mixersCrates: 0 };

  const getGuestsForMeal = (mealKey: string) => {
    return confirmedGuests.filter(g => {
      const pref = g.mealPlan[mealKey as keyof typeof g.mealPlan];
      return pref === 'Veg' || pref === 'Non-Veg';
    });
  };

  return (
    <div className="space-y-16 pb-32 animate-in fade-in duration-700">
      <div className="px-1">
        <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight tracking-tight">Catering <br/><span className="text-[#B8860B]">Manifest</span></h2>
        <p className="text-stone-500 text-lg italic mt-3">Replicating data for {confirmedGuests.length} confirmed guests from Master List.</p>
      </div>

      {/* Bar Inventory Section */}
      <section className="space-y-8">
         <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
            <Beer className="text-[#D4AF37]" size={32} />
            <h3 className="text-3xl font-serif font-bold text-stone-900">Welcome Bar Station</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
               { icon: Wine, label: 'Urak (Fresh Litres)', val: bar.urakLitres, desc: 'Calculated from preferences' },
               { icon: Beer, label: 'Beer (Pint Cases)', val: bar.beerCases, desc: '8-10 cases recommended' },
               { icon: GlassWater, label: 'Mixers & Soda', val: bar.mixersCrates, desc: 'Small glass bottles' }
            ].map((item, i) => (
               <div key={i} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900 shadow-sm">
                     <item.icon size={28} />
                  </div>
                  <div>
                     <p className="text-3xl font-serif font-bold text-stone-900">{item.val}</p>
                     <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">{item.label}</p>
                  </div>
                  <p className="text-[9px] text-stone-300 italic uppercase font-bold tracking-tighter">{item.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Meal Production Totals */}
      <div className="grid grid-cols-1 gap-8">
        {(Object.keys(mealLabels) as Array<keyof typeof mealLabels>).map((mealKey) => {
          const config = mealLabels[mealKey];
          const Icon = config.icon;
          const mealGuests = getGuestsForMeal(mealKey);
          const isExpanded = expandedMeal === mealKey;

          return (
            <div key={mealKey} className="bg-white p-8 rounded-[3.5rem] border border-stone-100 shadow-xl space-y-6 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center justify-between border-b border-stone-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#FEF9E7] rounded-2xl flex items-center justify-center text-[#B8860B] shadow-sm">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-900">{config.label}</h3>
                    <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest">{config.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                     <p className="text-[9px] font-black uppercase text-stone-400 mb-1">Total Plates</p>
                     <p className="text-xl font-bold text-stone-900">{mealGuests.length}</p>
                  </div>
                  <button 
                    onClick={() => setExpandedMeal(isExpanded ? null : mealKey)}
                    className="p-3 bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50/50 p-6 rounded-[2.5rem] border border-green-100/50 text-center">
                  <p className="text-[10px] font-black uppercase text-green-700 mb-2">Veg Plates</p>
                  <p className="text-3xl font-serif font-bold text-stone-900">
                    {mealGuests.filter(g => g.mealPlan[mealKey as keyof typeof g.mealPlan] === 'Veg').length}
                  </p>
                </div>
                <div className="bg-red-50/50 p-6 rounded-[2.5rem] border border-red-100/50 text-center">
                  <p className="text-[10px] font-black uppercase text-red-700 mb-2">Non-Veg Plates</p>
                  <p className="text-3xl font-serif font-bold text-stone-900">
                    {mealGuests.filter(g => g.mealPlan[mealKey as keyof typeof g.mealPlan] === 'Non-Veg').length}
                  </p>
                </div>
              </div>

              {isExpanded && (
                <div className="pt-8 space-y-4 animate-in slide-in-from-top-4 duration-300">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Guest Breakdown</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {mealGuests.map(g => (
                         <div key={g.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                            <span className="text-xs font-bold text-stone-900">{g.name}</span>
                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${g.mealPlan[mealKey as keyof typeof g.mealPlan] === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                               {g.mealPlan[mealKey as keyof typeof g.mealPlan]}
                            </span>
                         </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlan;
