
import React, { useState } from 'react';
import { Guest } from '../types';
import { ChevronRight, ChevronDown, User, MapPin, Coffee, Shirt, Users } from 'lucide-react';

interface TreeViewProps {
  guests: Guest[];
}

const TreeView: React.FC<TreeViewProps> = ({ guests }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Master Interactive Tree</h2>
        <button 
          onClick={() => setExpandedIds(new Set(guests.map(g => g.id)))}
          className="text-amber-600 text-sm font-medium hover:underline"
        >
          Expand All
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {guests.map((guest) => {
          const isExpanded = expandedIds.has(guest.id);
          return (
            <div key={guest.id} className="border-b border-stone-100 last:border-0">
              <button
                onClick={() => toggleExpand(guest.id)}
                className="w-full flex items-center gap-3 px-6 py-4 hover:bg-stone-50 transition-colors text-left"
              >
                {isExpanded ? <ChevronDown size={18} className="text-stone-400" /> : <ChevronRight size={18} className="text-stone-400" />}
                <User size={18} className="text-amber-600" />
                <div className="flex flex-col">
                  <span className="font-semibold text-stone-900">{guest.name}</span>
                  <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest">{guest.side}</span>
                </div>
                <span className="ml-auto text-xs font-bold uppercase px-2 py-1 rounded bg-stone-100 text-stone-500">
                  {guest.category}
                </span>
              </button>
              {isExpanded && (
                <div className="px-14 pb-4 pt-1 space-y-3 bg-stone-50/50">
                  <div className="flex items-start gap-3">
                    <Users size={16} className="text-stone-400 mt-1" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase font-bold">Family Side</p>
                      <p className="text-sm text-stone-800 font-bold">{guest.side}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-stone-400 mt-1" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase font-bold">Room Allocation</p>
                      <p className="text-sm text-stone-800">Villa Room {guest.roomNo}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Coffee size={16} className="text-stone-400 mt-1" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase font-bold">Meal Preference</p>
                      <p className="text-sm text-stone-800">{guest.dietaryNote} — {guest.mealPlan.dinner18}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shirt size={16} className="text-stone-400 mt-1" />
                    <div>
                      <p className="text-xs text-stone-500 uppercase font-bold">Dress Code & Logistics</p>
                      <p className="text-sm text-stone-800">{guest.dressCode} | Pickup: {guest.pickupScheduled ? 'Confirmed' : 'Pending'}</p>
                    </div>
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

export default TreeView;
