import React from 'react';
import { Guest } from '../types';
import { Utensils, Coffee, Sun, Moon, Info, CheckCircle, Edit3 } from 'lucide-react';

interface MealPlanProps {
  guests: Guest[];
  onUpdate: (id: string, updates: Partial<Guest>) => void;
  isPlanner: boolean;
}

const MealPlan: React.FC<MealPlanProps> = ({ guests, onUpdate, isPlanner }) => {
  const confirmedCount = guests.filter(g => g.status === 'Confirmed').length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">Catering <br/><span className="text-[#B8860B]">Logistics</span></h2>
          <p className="text-stone-500 italic text-sm md:text-lg mt-2">Managing the culinary journey for {confirmedCount} confirmed Pax.</p>
        </div>
        <div className="bg-stone-900 text-white px-8 py-5 rounded-[2rem] border-2 border-[#D4AF37] shadow-xl text-center">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Confirmed Pax</p>
          <p className="text-3xl font-serif font-bold text-[#D4AF37]">{confirmedCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-stone-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#FCFAF2] text-stone-500 text-[10px] uppercase tracking-[0.25em] font-black">
              <tr>
                <th className="px-10 py-8">Guest Name</th>
                <th className="px-10 py-8">Dietary Requirement</th>
                <th className="px-10 py-8">April 17 Dinner</th>
                <th className="px-10 py-8">April 18 Gala</th>
                <th className="px-10 py-8">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-stone-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-stone-900 group-hover:text-[#B8860B] transition-colors">{guest.name}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">{guest.side} Side</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    {isPlanner ? (
                      <input 
                        className="bg-stone-100/50 border-2 border-transparent hover:border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-xs font-bold text-stone-800 outline-none w-full transition-all"
                        value={guest.dietaryNote}
                        onChange={(e) => onUpdate(guest.id, { dietaryNote: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm font-bold text-stone-600">{guest.dietaryNote || 'Standard Veg'}</span>
                    )}
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <Moon size={14} className="text-stone-300" />
                      <span className="text-xs font-bold text-stone-800 italic">{guest.mealPlan.lunch17}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <Sun size={14} className="text-[#D4AF37]" />
                      <span className="text-xs font-bold text-stone-800">{guest.mealPlan.dinner18}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                      guest.status === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-stone-100 text-stone-400 border-stone-200'
                    }`}>
                      {guest.status === 'Confirmed' ? 'Included' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#FEF9E7] p-8 md:p-12 rounded-[3rem] border border-[#D4AF37]/30 flex flex-col md:flex-row items-center gap-8 shadow-lg">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#D4AF37] shadow-xl shrink-0">
          <Info size={36} />
        </div>
        <div>
          <h4 className="text-2xl font-serif font-bold text-stone-900 mb-2 tracking-tight">Catering Summary</h4>
          <p className="text-stone-600 leading-relaxed italic text-sm md:text-base">
            "All dietary restrictions edited here are synced with the Master List and will be shared with the Chef. Total of {guests.filter(g => g.dietaryNote.toLowerCase().includes('vegan')).length} Vegan and {guests.filter(g => g.dietaryNote.toLowerCase().includes('jain')).length} Jain meals noted."
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealPlan;