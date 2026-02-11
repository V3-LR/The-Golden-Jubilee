import React, { useState } from 'react';
import { Guest, FamilyMember, DietaryPreference, WelcomeDrink } from '../types';
import { Heart, CheckCircle, ArrowRight, Users, X, Plus, Trash2, ShieldCheck, Utensils, Wine, Music, MessageSquare, GlassWater } from 'lucide-react';

interface RSVPFormProps {
  guest: Guest;
  onSubmit: (updates: Partial<Guest>) => void;
  onGoToDashboard?: () => void;
  onExitSimulation?: () => void;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ guest, onSubmit, onGoToDashboard, onExitSimulation }) => {
  const [formData, setFormData] = useState<Partial<Guest>>({
    status: guest.status === 'Confirmed' ? 'Confirmed' : 'Pending',
    side: guest.side || 'Common',
    dietaryPreference: guest.dietaryPreference || 'Veg',
    welcomeDrinkPreference: guest.welcomeDrinkPreference || 'Soft Beverage',
    familyMembers: guest.familyMembers || [],
    allergies: guest.allergies || '',
    drinksPreference: guest.drinksPreference || 'Both',
    songRequest: guest.songRequest || '',
    personalMessage: guest.personalMessage || '',
    mealPlan: guest.mealPlan || { lunch17: 'Veg', dinner17: 'Veg', lunch18: 'Veg', gala18: 'Veg' }
  });

  const [submitted, setSubmitted] = useState(false);

  const addFamilyMember = () => {
    const members = [...(formData.familyMembers || [])];
    members.push({ 
      name: '', 
      age: 0, 
      relation: 'Family', 
      type: 'Adult', 
      dietaryPreference: 'Veg',
      welcomeDrinkPreference: 'Soft Beverage',
      mealPlan: { lunch17: 'Veg', dinner17: 'Veg', lunch18: 'Veg', gala18: 'Veg' }
    });
    setFormData({ ...formData, familyMembers: members });
  };

  const removeFamilyMember = (index: number) => {
    const members = [...(formData.familyMembers || [])];
    members.splice(index, 1);
    setFormData({ ...formData, familyMembers: members });
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: any) => {
    const members = [...(formData.familyMembers || [])];
    const updatedMember = { ...members[index], [field]: value };
    if (field === 'age') updatedMember.type = (value < 11) ? 'Kid' : 'Adult';
    if (field === 'dietaryPreference') {
      updatedMember.mealPlan = { lunch17: value, dinner17: value, lunch18: value, gala18: value };
    }
    members[index] = updatedMember;
    setFormData({ ...formData, familyMembers: members });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStatus = formData.status === 'Declined' ? 'Declined' : 'Confirmed';
    const totalPax = 1 + (formData.familyMembers?.length || 0);
    onSubmit({ ...formData, status: newStatus, paxCount: totalPax, rsvpTimestamp: new Date().toISOString() });
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="min-h-screen bg-[#FCFAF2] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full animate-in zoom-in duration-500">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-[#D4AF37]/20">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"><CheckCircle size={40} /></div>
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Dhanyawad!</h2>
          <p className="text-stone-500 italic mb-8">"Your family RSVP is confirmed. See you in Goa!"</p>
          <button onClick={onGoToDashboard} className="w-full gold-shimmer text-stone-900 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg">Go to My Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFAF2] py-12 md:py-24 px-4 relative">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4 mb-12">
           <p className="font-cinzel text-[#B8860B] text-xl uppercase tracking-[0.5em]">Goa Bulaye Re!</p>
           <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900">Mummy & Papa ki <span className="text-[#B8860B]">50vi Saalgira</span></h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-[4rem] p-8 md:p-16 shadow-2xl border border-stone-100 space-y-12 relative">
          
          <div className="space-y-8">
            <h3 className="text-2xl font-serif font-bold text-stone-900 border-b pb-4">Attendance</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Confirmed', 'Declined'].map((s) => (
                <button key={s} type="button" onClick={() => setFormData({ ...formData, status: s as any })} className={`py-6 rounded-3xl text-xs font-black uppercase tracking-widest border-2 transition-all ${formData.status === s ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-100 text-stone-400'}`}>
                  {s === 'Confirmed' ? 'Coming!' : 'Regretfully decline'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-serif font-bold text-stone-900 border-b pb-4">A First Drink for You</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['Goan Urak', 'Chilled Beer', 'Soft Beverage'] as WelcomeDrink[]).map((drink) => (
                <button key={drink} type="button" onClick={() => setFormData({ ...formData, welcomeDrinkPreference: drink })} className={`py-4 px-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${formData.welcomeDrinkPreference === drink ? 'bg-[#D4AF37] border-[#D4AF37] text-stone-900 shadow-lg' : 'bg-stone-50 border-stone-100 text-stone-400'}`}>
                  {drink}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-serif font-bold text-stone-900 border-b pb-4">Food Preference</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Veg', 'Non-Veg'].map((pref) => (
                <button key={pref} type="button" onClick={() => setFormData({ ...formData, dietaryPreference: pref as DietaryPreference, mealPlan: { lunch17: pref, dinner17: pref, lunch18: pref, gala18: pref } })} className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.dietaryPreference === pref ? (pref === 'Veg' ? 'bg-green-600 border-green-600 text-white' : 'bg-red-600 border-red-600 text-white') : 'bg-stone-50 border-stone-100 text-stone-400'}`}>
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
               <h3 className="text-2xl font-serif font-bold text-stone-900">Family Members</h3>
               <button type="button" onClick={addFamilyMember} className="bg-[#FEF9E7] text-[#B8860B] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest"><Plus size={14} /> Add Member</button>
            </div>
            <div className="space-y-6">
              {formData.familyMembers?.map((member, idx) => (
                <div key={idx} className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" value={member.name} onChange={(e) => updateFamilyMember(idx, 'name', e.target.value)} className="bg-white border p-3 rounded-xl text-xs font-bold" required />
                    <input type="number" placeholder="Age" value={member.age || ''} onChange={(e) => updateFamilyMember(idx, 'age', parseInt(e.target.value))} className="bg-white border p-3 rounded-xl text-xs font-bold" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <p className="text-[8px] font-black text-stone-400 uppercase">First Drink</p>
                       <select className="bg-white border p-2 rounded-xl text-[9px] w-full font-bold uppercase" value={member.welcomeDrinkPreference} onChange={(e) => updateFamilyMember(idx, 'welcomeDrinkPreference', e.target.value)}>
                          <option value="Goan Urak">Goan Urak</option>
                          <option value="Chilled Beer">Chilled Beer</option>
                          <option value="Soft Beverage">Soft Beverage</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[8px] font-black text-stone-400 uppercase">Food</p>
                       <div className="flex bg-white rounded-xl p-1 border border-stone-200">
                        {['Veg', 'Non-Veg'].map((p) => (
                          <button key={p} type="button" onClick={() => updateFamilyMember(idx, 'dietaryPreference', p)} className={`flex-grow px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${member.dietaryPreference === p ? (p === 'Veg' ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'text-stone-400'}`}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFamilyMember(idx)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-colors ml-auto block"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full gold-shimmer text-stone-900 py-10 rounded-full font-black uppercase tracking-[0.4em] text-sm shadow-2xl flex items-center justify-center gap-4">Confirm Celebrating RSVP <ArrowRight size={20} /></button>
        </form>
      </div>
    </div>
  );
};

export default RSVPForm;