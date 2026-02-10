
import React, { useState } from 'react';
import { Guest } from '../types';
import { Edit3, CheckCircle2 } from 'lucide-react';

interface DataTableProps {
  guests: Guest[];
  onUpdate: (id: string, updates: Partial<Guest>) => void;
  columns: {
    key: keyof Guest | string;
    label: string;
    render?: (guest: Guest) => React.ReactNode;
    editable?: boolean;
    type?: 'text' | 'select' | 'checkbox';
    options?: string[];
  }[];
}

const DataTable: React.FC<DataTableProps> = ({ guests, onUpdate, columns }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#D4AF37]/20 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
            <thead className="bg-stone-50 text-stone-600 text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-black">
              <tr>
                {columns.map((col) => (
                  <th key={col.key.toString()} className="px-5 py-4 md:px-6 md:py-5 border-b border-stone-200 whitespace-nowrap text-stone-400">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-stone-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key.toString()} className="px-5 py-3 md:px-6 md:py-4">
                      {col.render ? (
                        col.render(guest)
                      ) : col.editable ? (
                        <div className="relative group/field">
                          {col.type === 'select' ? (
                            <select
                              className="bg-white border border-stone-100 hover:border-[#D4AF37]/40 rounded-lg px-2 py-1 md:py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500 w-full transition-all cursor-pointer font-bold text-stone-900"
                              value={String(guest[col.key as keyof Guest])}
                              onChange={(e) => onUpdate(guest.id, { [col.key]: e.target.value })}
                            >
                              {col.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                className={`bg-white border rounded-lg px-2 py-1 md:py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500 w-full transition-all font-bold text-stone-900 ${
                                  editingId === `${guest.id}-${col.key}` ? 'border-amber-500' : 'border-stone-100'
                                }`}
                                value={String(guest[col.key as keyof Guest])}
                                onFocus={() => setEditingId(`${guest.id}-${col.key}`)}
                                onBlur={() => setEditingId(null)}
                                onChange={(e) => onUpdate(guest.id, { [col.key]: e.target.value })}
                              />
                              {editingId === `${guest.id}-${col.key}` ? (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                </div>
                              ) : (
                                <Edit3 size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none opacity-0 group-hover/field:opacity-100 transition-opacity" />
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-stone-800 whitespace-nowrap">{String(guest[col.key as keyof Guest])}</span>
                          {col.key === 'name' && <div className="w-1 h-1 rounded-full bg-green-400 opacity-40"></div>}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-[#B8860B]/60">
           <CheckCircle2 size={10} />
           <span>Names synced across 4 platforms</span>
        </div>
        <div className="flex md:hidden items-center gap-2 text-[8px] font-black uppercase tracking-widest text-stone-300">
          <span className="animate-pulse">← Swipe Table →</span>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
