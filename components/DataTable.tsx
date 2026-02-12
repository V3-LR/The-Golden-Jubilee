
import React, { useState, useEffect } from 'react';
import { Guest } from '../types';
import { Edit3, Lock, CheckCircle } from 'lucide-react';

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

const EditableCell: React.FC<{
  value: string;
  onCommit: (val: string) => void;
  isEditing: boolean;
  onFocus: () => void;
  onBlur: () => void;
}> = ({ value, onCommit, isEditing, onFocus, onBlur }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCommit(localValue);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="relative group/cell">
      <input
        type="text"
        className={`bg-white border-2 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/10 w-full transition-all font-black text-stone-900 shadow-sm ${
          isEditing ? 'border-[#D4AF37] z-20 scale-105' : 'border-stone-100 group-hover/cell:border-[#D4AF37]/30'
        }`}
        value={localValue}
        onFocus={onFocus}
        onBlur={() => {
          onBlur();
          if (localValue !== value) onCommit(localValue);
        }}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {!isEditing && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/cell:opacity-40 pointer-events-none transition-opacity">
          <Edit3 size={12} />
        </div>
      )}
    </div>
  );
};

const DataTable: React.FC<DataTableProps> = ({ guests, onUpdate, columns }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const getSideColor = (side: string) => {
    if (side === 'Ladkiwale') return 'bg-pink-100 text-pink-700 border-pink-200';
    if (side === 'Ladkewale') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-stone-100 text-stone-600 border-stone-200';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Confirmed') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Declined') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="bg-white rounded-[2rem] border border-[#D4AF37]/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#FCFAF2] text-stone-500 text-[10px] uppercase tracking-[0.25em] font-black border-b border-[#D4AF37]/10">
              <tr>
                {columns.map((col) => (
                  <th key={col.key.toString()} className="px-8 py-6 first:pl-10 last:pr-10">
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
                                className={`appearance-none bg-white border-2 hover:border-[#D4AF37] rounded-xl px-4 py-2.5 text-[11px] focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/10 w-full transition-all cursor-pointer font-black tracking-widest uppercase shadow-sm ${
                                  col.key === 'side' ? getSideColor(String(guest.side)) : 
                                  col.key === 'status' ? getStatusColor(String(guest.status)) : 'text-stone-900 border-stone-100'
                                }`}
                                value={String(guest[col.key as keyof Guest] || '')}
                                onChange={(e) => onUpdate(guest.id, { [col.key]: e.target.value as any })}
                              >
                                {col.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt === 'Confirmed' ? 'Coming' : opt}</option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <Edit3 size={12} />
                              </div>
                            </div>
                          ) : (
                            <EditableCell
                              value={String(guest[col.key as keyof Guest] || '')}
                              onCommit={(val) => onUpdate(guest.id, { [col.key]: val })}
                              isEditing={editingId === `${guest.id}-${col.key}`}
                              onFocus={() => setEditingId(`${guest.id}-${col.key}`)}
                              onBlur={() => setEditingId(null)}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                           <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                            col.key === 'status' ? getStatusColor(String(guest.status)) : 
                            col.key === 'side' ? getSideColor(String(guest.side)) : 'text-stone-900 border-stone-50 bg-stone-50'
                          }`}>
                            {String(guest[col.key as keyof Guest] || '-')}
                          </span>
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
    </div>
  );
};

export default DataTable;
