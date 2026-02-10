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

  const getSideColor = (side: string) => {
    if (side === 'Ladkiwale') return 'bg-pink-50 text-pink-600 border-pink-100';
    if (side === 'Ladkewale') return 'bg-blue-50 text-blue-600 border-blue-100';
    return 'bg-stone-50 text-stone-600 border-stone-100';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Confirmed') return 'bg-green-50 text-green-600 border-green-100';
    if (status === 'Declined') return 'bg-red-50 text-red-600 border-red-100';
    return 'bg-amber-50 text-amber-600 border-amber-100';
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="bg-white rounded-[2rem] border border-[#D4AF37]/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#FCFAF2] text-stone-500 text-[10px] uppercase tracking-[0.25em] font-black">
              <tr>
                {columns.map((col) => (
                  <th key={col.key.toString()} className="px-8 py-6 border-b border-[#D4AF37]/10 first:pl-10 last:pr-10">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/5">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-[#FCFAF2]/50 transition-all group">
                  {columns.map((col) => (
                    <td key={col.key.toString()} className="px-8 py-5 first:pl-10 last:pr-10">
                      {col.render ? (
                        col.render(guest)
                      ) : col.editable ? (
                        <div className="relative group/field">
                          {col.type === 'select' ? (
                            <div className="relative">
                              <select
                                className={`appearance-none bg-white border-2 hover:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/10 w-full transition-all cursor-pointer font-bold shadow-sm ${
                                  col.key === 'side' ? getSideColor(String(guest.side)) : 
                                  col.key === 'status' ? getStatusColor(String(guest.status)) : 'text-stone-900 border-stone-100'
                                }`}
                                value={String(guest[col.key as keyof Guest] || '')}
                                onChange={(e) => onUpdate(guest.id, { [col.key]: e.target.value })}
                              >
                                {col.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <Edit3 size={10} />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                className={`bg-white border-2 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/10 w-full transition-all font-bold text-stone-900 shadow-sm ${
                                  editingId === `${guest.id}-${col.key}` ? 'border-[#D4AF37]' : 'border-stone-100'
                                }`}
                                value={String(guest[col.key as keyof Guest] || '')}
                                onFocus={() => setEditingId(`${guest.id}-${col.key}`)}
                                onBlur={() => setEditingId(null)}
                                onChange={(e) => onUpdate(guest.id, { [col.key]: e.target.value })}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-stone-900">
                          {String(guest[col.key as keyof Guest] || '-')}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;