import React from 'react';
import { Guest, Budget } from '../types';
import { MEAL_CONFIG } from '../constants';
import { Utensils, Coffee, Sun, Moon, Beer, GlassWater, Wine } from 'lucide-react';

interface MealPlanProps {
  guests: Guest[];
  budget: Budget;
  onUpdate: (id: string, updates: Partial<Guest>) => void;
  isPlanner: boolean;
}

const MealPlan: React.FC<MealPlanProps> = ({ guests, budget, onUpdate, isPlanner }) => {
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

  return (
    <div className="space-y-16 pb-32 animate-in fade-in duration-700">
      <div className="px-1">
        <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight tracking-tight">Catering <br/><span className="text-[#B8860B]">Manifest</span></h2>
        <p className="text-stone-500 text-lg italic mt-3">Production totals for {confirmedGuests.length} confirmed guests.</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {(Object.keys(mealLabels) as Array<keyof typeof mealLabels>).map((mealKey) => {
          const config = mealLabels[mealKey];
          const stats = breakdown[mealKey];
          const Icon = config.icon;

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
                <div className="text-right">
                   <p className="text-[9px] font-black uppercase text-stone-400 mb-1">Total Plates</p>
                   <p className="text-xl font-bold text-stone-900">{stats.adultVeg + stats.kidVeg + stats.adultNonVeg + stats.kidNonVeg}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50/50 p-6 rounded-[2.5rem] border border-green-100/50 text-center">
                  <p className="text-[10px] font-black uppercase text-green-700 mb-2">Pure Veg</p>
                  <p className="text-3xl font-serif font-bold text-stone-900">{stats.adultVeg + stats.kidVeg}</p>
                  <p className="text-[8px] text-stone-400 mt-1 uppercase font-bold">{stats.adultVeg} Adult + {stats.kidVeg} Kid</p>
                </div>
                <div className="bg-red-50/30 p-6 rounded-[2.5rem] border border-red-50 text-center">
                  <p className="text-[10px] font-black uppercase text-red-700 mb-2">Non-Veg</p>
                  <p className="text-3xl font-serif font-bold text-stone-900">{stats.adultNonVeg + stats.kidNonVeg}</p>
                  <p className="text-[8px] text-red-400 mt-1 uppercase font-bold">{stats.adultNonVeg} Adult + {stats.kidNonVeg} Kid</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlan;