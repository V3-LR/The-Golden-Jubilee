import React, { useState } from 'react';
import { Guest, InventoryItem } from '../types';
import { Package, ShoppingCart, AlertTriangle, Plus, Trash2, CheckCircle, Beer, Wine, GlassWater, UtensilsCrossed, Info } from 'lucide-react';

interface InventoryManagerProps {
  guests: Guest[];
  inventory: InventoryItem[];
  onUpdate: (inventory: InventoryItem[]) => void;
  isPlanner: boolean;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ guests, inventory, onUpdate, isPlanner }) => {
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ category: 'Bar', label: '', currentQuantity: 0, unit: 'Cases' });

  const confirmedAdults = guests.filter(g => g.status === 'Confirmed').length;
  
  // Consumption Logic
  const needs = {
    urak: Math.ceil(confirmedAdults * 0.1), // 100ml per adult
    beer: Math.ceil((confirmedAdults * 4) / 24), // 4 pints per adult, 24 per case
    water: Math.ceil((confirmedAdults * 4) / 6), // 4L per pax, assume 6L per case/crate
    ice: Math.ceil(confirmedAdults * 4), // 2kg per adult per day, 2 days = 4kg
    glassware: Math.ceil(confirmedAdults * 1.5)
  };

  const addItem = () => {
    if (newItem.label) {
      const item: InventoryItem = {
        id: `inv-${Date.now()}`,
        label: newItem.label!,
        currentQuantity: newItem.currentQuantity || 0,
        unit: newItem.unit || 'Units',
        category: newItem.category as any,
        lastUpdated: new Date().toISOString()
      };
      onUpdate([...inventory, item]);
      setNewItem({ category: 'Bar', label: '', currentQuantity: 0, unit: 'Cases' });
    }
  };

  const removeItem = (id: string) => {
    onUpdate(inventory.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    onUpdate(inventory.map(i => i.id === id ? { ...i, currentQuantity: qty, lastUpdated: new Date().toISOString() } : i));
  };

  const getStockStatus = (item: InventoryItem) => {
    let required = 0;
    if (item.label.toLowerCase().includes('urak')) required = needs.urak;
    else if (item.label.toLowerCase().includes('beer')) required = needs.beer;
    else if (item.label.toLowerCase().includes('water')) required = needs.water;
    else if (item.label.toLowerCase().includes('ice')) required = needs.ice;
    else if (item.label.toLowerCase().includes('glass')) required = needs.glassware;

    if (required === 0) return null;
    if (item.currentQuantity >= required) return 'Safe';
    if (item.currentQuantity >= required * 0.7) return 'Low';
    return 'Critical';
  };

  const categories = ['Bar', 'Garnish', 'Asset', 'Consumable'];

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div>
          <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">Inventory <br/><span className="text-[#B8860B]">Command</span></h2>
          <p className="text-stone-500 text-lg italic mt-3">Precision stock for {confirmedAdults} confirmed adults.</p>
        </div>
        <div className="bg-stone-900 text-white p-8 rounded-3xl border-2 border-[#D4AF37] shadow-xl">
          <div className="flex items-center gap-4">
             <Info className="text-[#D4AF37]" size={24} />
             <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Delhi-Goa Calculation Applied</p>
          </div>
        </div>
      </div>

      {/* Consumption Logic Briefing */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Urak Needed', val: needs.urak, unit: 'Liters', icon: Wine },
          { label: 'Beer Needed', val: needs.beer, unit: 'Cases', icon: Beer },
          { label: 'Water Needed', val: needs.water, unit: 'Crates', icon: GlassWater },
          { label: 'Ice Needed', val: needs.ice, unit: 'kg', icon: Package }
        ].map((n, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-[#B8860B]">
              <n.icon size={20} />
            </div>
            <div>
              <p className="text-xl font-serif font-bold text-stone-900">{n.val} {n.unit}</p>
              <p className="text-[9px] font-black uppercase text-stone-400 tracking-tighter">{n.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Section */}
      {isPlanner && (
        <section className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl">
          <h3 className="text-xl font-serif font-bold text-stone-900 mb-8 flex items-center gap-3">
             <ShoppingCart size={24} className="text-[#D4AF37]" /> Add New Stock Item
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Item (e.g. Urak, Rock Salt)" 
              value={newItem.label}
              onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
              className="bg-stone-50 border p-4 rounded-2xl text-xs font-bold"
            />
            <select 
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
              className="bg-stone-50 border p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input 
              type="number" 
              placeholder="Current Qty" 
              value={newItem.currentQuantity || ''}
              onChange={(e) => setNewItem({ ...newItem, currentQuantity: parseInt(e.target.value) })}
              className="bg-stone-50 border p-4 rounded-2xl text-xs font-bold"
            />
            <button onClick={addItem} className="bg-stone-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest py-4 hover:scale-[1.02] active:scale-95 transition-all">
              Add to Inventory
            </button>
          </div>
        </section>
      )}

      {/* Inventory List */}
      <section className="bg-white rounded-[4rem] border border-stone-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FCFAF2] text-stone-500 text-[10px] uppercase tracking-[0.3em] font-black">
              <tr>
                <th className="px-10 py-8">Stock Item</th>
                <th className="px-10 py-8">Current Quantity</th>
                <th className="px-10 py-8">Alert Status</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {inventory.map((item) => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-all group">
                    <td className="px-10 py-8">
                       <div className="flex flex-col">
                          <span className="text-xl font-bold text-stone-900">{item.label}</span>
                          <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest">{item.category}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          {isPlanner ? (
                            <input 
                              type="number" 
                              value={item.currentQuantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                              className="w-24 bg-stone-50 border p-3 rounded-xl text-xs font-bold"
                            />
                          ) : (
                            <span className="font-bold">{item.currentQuantity}</span>
                          )}
                          <span className="text-[10px] font-black uppercase text-stone-400">{item.unit || 'Units'}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       {status === 'Safe' && <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase"><CheckCircle size={14} /> Stock Safe</div>}
                       {status === 'Low' && <div className="flex items-center gap-2 text-amber-600 text-[10px] font-black uppercase"><AlertTriangle size={14} /> Stock Low</div>}
                       {status === 'Critical' && <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase animate-pulse"><AlertTriangle size={14} /> Critical Need</div>}
                    </td>
                    <td className="px-10 py-8 text-right">
                       {isPlanner && (
                         <button onClick={() => removeItem(item.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 size={18} />
                         </button>
                       )}
                    </td>
                  </tr>
                );
              })}
              {inventory.length === 0 && (
                <tr>
                   <td colSpan={4} className="py-24 text-center">
                      <Package size={64} className="mx-auto text-stone-100 mb-4" />
                      <p className="text-stone-400 italic">No inventory tracked yet. Start with 'Urak' or 'Beer'.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Execution Pro-Tip */}
      <div className="bg-[#FEF9E7] p-10 rounded-[3rem] border-2 border-[#D4AF37] flex flex-col md:flex-row items-center gap-10 shadow-lg">
         <div className="w-20 h-20 bg-stone-900 text-[#D4AF37] rounded-full flex items-center justify-center shadow-2xl shrink-0">
            <UtensilsCrossed size={36} />
         </div>
         <div>
            <h4 className="text-2xl font-serif font-bold text-stone-900 mb-2">The Garnish Rule</h4>
            <p className="text-stone-600 leading-relaxed italic">
               "For the Urak station to feel premium, your brother must verify the <strong>Garnish Tracker</strong> 2 hours before the Sundowner: 2kg Lemons, 500g Green Chilies, and 1kg Rock Salt. A dry station is a failed station."
            </p>
         </div>
      </div>
    </div>
  );
};

export default InventoryManager;