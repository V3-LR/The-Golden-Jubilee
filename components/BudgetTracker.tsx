import React, { useState } from 'react';
import { Budget, Guest, Quotation, InventoryItem } from '../types';
import { QUOTATIONS } from '../constants';
import { 
  CheckCircle, Edit2, Plus, Trash2, ShieldCheck, ShoppingBag, 
  TrendingDown, ArrowRight, ChefHat, Beer, Wine, GlassWater,
  Activity, Wallet, Package, ShoppingCart
} from 'lucide-react';

interface BudgetTrackerProps {
  budget: Budget;
  guests: Guest[];
  onUpdateBudget: (updates: Partial<Budget>) => void;
  isPlanner: boolean;
  onFinalizePath: (path: 'Villa' | 'Resort') => void;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budget, guests, onUpdateBudget, isPlanner, onFinalizePath }) => {
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ label: '', quantity: 1, unit: 'Cases', source: '', cost: 0 });

  const b = budget.barInventory || { urakLitres: 0, beerCases: 0, mixersCrates: 0 };
  const customInv = budget.customInventory || [];

  const handleAddInventory = () => {
    if (newItem.label) {
      const item: InventoryItem = {
        id: `i-${Date.now()}`,
        label: newItem.label,
        quantity: newItem.quantity || 0,
        unit: newItem.unit || '',
        source: newItem.source || '',
        cost: newItem.cost || 0,
        isPurchased: false
      };
      onUpdateBudget({ customInventory: [...customInv, item] });
      setNewItem({ label: '', quantity: 1, unit: 'Cases', source: '', cost: 0 });
      setShowAddInventory(false);
    }
  };

  const removeInventory = (id: string) => {
    onUpdateBudget({ customInventory: customInv.filter(i => i.id !== id) });
  };

  const togglePurchased = (id: string) => {
    onUpdateBudget({ customInventory: customInv.map(i => i.id === id ? { ...i, isPurchased: !i.isPurchased } : i) });
  };

  const calculateGrandTotal = () => {
    const committed = budget.committedSpend || 0;
    const invTotal = customInv.reduce((acc, curr) => acc + curr.cost, 0);
    // Estimated costs for Bar based on pre-calculated quantities
    const urakCost = b.urakLitres * 1200; // ₹1200/L wholesale
    const beerCost = b.beerCases * 3500; // ₹3500/case
    const mixersCost = b.mixersCrates * 1500; // ₹1500/crate
    return committed + invTotal + urakCost + beerCost + mixersCost;
  };

  const grandTotal = calculateGrandTotal();
  const remaining = budget.totalBudget - grandTotal;

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      {/* 1. Decision Status */}
      <section className="bg-stone-900 text-[#F3E5AB] p-8 md:p-12 rounded-[3rem] shadow-2xl border border-[#D4AF37]/50 relative overflow-hidden">
        <Activity className="absolute -top-10 -right-10 opacity-5" size={300} />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <p className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.5em]">Command Center</p>
            <h2 className="text-3xl font-serif font-bold text-white leading-tight">Projected Total: ₹{grandTotal.toLocaleString()}</h2>
            <div className="flex items-center gap-3">
               <span className={`px-4 py-1.5 rounded-full text-[10px] border font-black uppercase tracking-widest ${remaining > 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                  {remaining >= 0 ? `₹${remaining.toLocaleString()} Surplus` : `₹${Math.abs(remaining).toLocaleString()} Deficit`}
               </span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
             <TrendingDown className="text-green-400" size={40} />
             <div>
                <p className="text-[10px] font-black uppercase text-stone-500 mb-1 tracking-widest">Savings Potential</p>
                <p className="text-2xl font-bold text-white uppercase tracking-widest">₹45,000</p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Welcome Bar Procurement (Live Logic) */}
      <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-stone-100 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-[#B8860B]"><Beer size={28} /></div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">Welcome Bar Shopping List</h3>
              <p className="text-stone-500 text-xs italic">Live logic based on {guests.filter(g => g.status === 'Confirmed').length} confirmed guests.</p>
            </div>
          </div>
          <p className="text-[10px] font-black uppercase bg-stone-900 text-[#D4AF37] px-6 py-3 rounded-full tracking-widest">Husband's Task</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Fresh Goan Urak', val: b.urakLitres, unit: 'Litres', icon: Wine, color: 'text-amber-600', bg: 'bg-amber-50', source: 'Local Wholesale' },
            { label: 'Chilled Pint Cases', val: b.beerCases, unit: 'Cases (24s)', icon: Beer, color: 'text-stone-700', bg: 'bg-stone-50', source: 'Madgao Wholesaler' },
            { label: 'Mixers (Limca/Soda)', val: b.mixersCrates, unit: 'Crates', icon: GlassWater, color: 'text-blue-600', bg: 'bg-blue-50', source: 'Caterer Sourcing' }
          ].map((item, i) => (
            <div key={i} className={`${item.bg} p-8 rounded-[2.5rem] border border-stone-100 space-y-4 group transition-all`}>
               <div className="flex justify-between items-start">
                  <item.icon className={item.color} size={28} />
                  <span className="text-[8px] font-black uppercase text-stone-400 tracking-widest">{item.source}</span>
               </div>
               <div className="space-y-1">
                  <p className="text-3xl font-serif font-bold text-stone-900">{item.val} {item.unit}</p>
                  <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">{item.label}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Custom Inventory Manager */}
      <section className="bg-white rounded-[4rem] p-10 md:p-16 border border-stone-100 shadow-xl overflow-hidden relative">
        <div className="flex justify-between items-center mb-12">
           <div>
              <h3 className="text-3xl font-serif font-bold text-stone-900">Inventory Tracker</h3>
              <p className="text-stone-500 italic mt-2">Manage additional consumables and event assets.</p>
           </div>
           <button 
             onClick={() => setShowAddInventory(!showAddInventory)}
             className="bg-stone-900 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
           >
             <Plus size={18} /> Add Item
           </button>
        </div>

        {showAddInventory && (
          <div className="bg-stone-50 p-10 rounded-[3rem] border-2 border-[#D4AF37]/20 mb-12 animate-in slide-in-from-top-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <input type="text" placeholder="Item Name (e.g. Wet Tissues)" value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} className="bg-white border p-4 rounded-2xl text-sm font-bold shadow-sm" />
                <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} className="bg-white border p-4 rounded-2xl text-sm font-bold shadow-sm" />
                <input type="text" placeholder="Unit (Cases/kg/pcs)" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} className="bg-white border p-4 rounded-2xl text-sm font-bold shadow-sm" />
                <input type="text" placeholder="Source Wholesaler" value={newItem.source} onChange={(e) => setNewItem({ ...newItem, source: e.target.value })} className="bg-white border p-4 rounded-2xl text-sm font-bold shadow-sm" />
                <input type="number" placeholder="Est. Cost (₹)" value={newItem.cost} onChange={(e) => setNewItem({ ...newItem, cost: parseInt(e.target.value) })} className="bg-white border p-4 rounded-2xl text-sm font-bold shadow-sm" />
                <button onClick={handleAddInventory} className="gold-shimmer text-stone-900 rounded-2xl font-black uppercase tracking-widest text-[10px]">Add to Tracker</button>
             </div>
          </div>
        )}

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-stone-50 text-[10px] font-black uppercase tracking-widest text-stone-400">
                    <th className="px-8 py-6">Consumable Item</th>
                    <th className="px-8 py-6">Source & Quantity</th>
                    <th className="px-8 py-6">Est. Cost</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                 {customInv.map((item) => (
                   <tr key={item.id} className={`group transition-all ${item.isPurchased ? 'opacity-40 grayscale' : ''}`}>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <button onClick={() => togglePurchased(item.id)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${item.isPurchased ? 'bg-green-500 border-green-500 text-white' : 'border-stone-200 text-transparent'}`}><CheckCircle size={14} /></button>
                            <span className="font-bold text-stone-900 text-lg">{item.label}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-stone-500 font-bold text-sm">{item.quantity} {item.unit}</p>
                         <p className="text-[9px] font-black uppercase text-stone-400">{item.source}</p>
                      </td>
                      <td className="px-8 py-6 font-black text-stone-900">₹{item.cost.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                         <button onClick={() => removeInventory(item.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                      </td>
                   </tr>
                 ))}
                 {customInv.length === 0 && (
                   <tr>
                      <td colSpan={4} className="p-20 text-center">
                         <ShoppingCart size={40} className="mx-auto text-stone-100 mb-4" />
                         <p className="text-stone-400 italic">No custom items added yet.</p>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </section>
    </div>
  );
};

export default BudgetTracker;