import React, { useState } from 'react';
import { Guest, FamilyMember } from '../types';
import { Heart, CheckCircle, ArrowRight, Users, X, Plus, Trash2, ShieldCheck } from 'lucide-react';

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
    familyMembers: guest.familyMembers || [],
    allergies: guest.allergies || '',
    drinksPreference: guest.drinksPreference || 'Both',
    songRequest: guest.songRequest || '',
    personalMessage: guest.personalMessage || '',
  });

  const [submitted, setSubmitted] = useState(false);

  const addFamilyMember = () => {
    const members = [...(formData.familyMembers || [])];
    members.push({ name: '', age: 0, relation: 'Family' });
    setFormData({ ...formData, familyMembers: members });
  };

  const removeFamilyMember = (index: number) => {
    const members = [...(formData.familyMembers || [])];
    members.splice(index, 1);
    setFormData({ ...formData, familyMembers: members });
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: any) => {
    const members = [...(formData.familyMembers || [])];
    members[index] = { ...members[index], [field]: value };
    setFormData({ ...formData, familyMembers: members });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only set to confirmed if they didn't explicitly decline (though we don't have a decline button here currently)
    const newStatus = formData.status === 'Declined' ? 'Declined' : 'Confirmed';
    const totalPax = 1 + (formData.familyMembers?.length || 0);
    
    onSubmit({ 
      ...formData, 
      status: newStatus,
      paxCount: totalPax, 
      rsvpTimestamp: new Date().toISOString() 
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FCFAF2] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full animate-in zoom-in duration-500">
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-[#D4AF37]/20">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Dhanyawad!</h2>
            <p className="text-stone-500 leading-relaxed italic mb-8">
              "Your family RSVP is confirmed. We can't wait to see you all in Goa!"
            </p>
            <div className="space-y-4">
              <button 
                onClick={onGoToDashboard}
                className="w-full gold-shimmer text-stone-900 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-3"
              >
                Go to My Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF2] py-12 md:py-24 px-4 relative">
      {onExitSimulation && (
        <div className="fixed top-0 left-0 w-full bg-stone-900 text-white py-3 px-6 z-[100] flex justify-between items-center border-b border-[#D4AF37]/30 shadow-2xl">
           <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Invitation Preview: <strong>{guest.name}</strong></span>
           </div>
           <button onClick={onExitSimulation} className="flex items-center gap-2 bg-[#D4AF37] text-stone-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
              <X size={12} /> Close
           </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4 mb-12">
           <p className="font-cinzel text-[#B8860B] text-xl uppercase tracking-[0.5em]">Goa Bulaye Re!</p>
           <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900">Mummy & Papa ki <span className="text-[#B8860B]">50vi Saalgira</span></h1>
           <div className="h-px w-24 bg-[#D4AF37] mx-auto opacity-30"></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[4rem] p-8 md:p-16 shadow-2xl border border-stone-100 space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
            <Heart size={200} className="text-[#D4AF37]" />
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b border-stone-100 pb-4">
               <ShieldCheck className="text-[#D4AF37]" size={24} />
               <h3 className="text-2xl font-serif font-bold text-stone-900">Attendance Status</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {['Confirmed', 'Declined'].map((s) => (
                <button
                  key={s} type="button" onClick={() => setFormData({ ...formData, status: s as any })}
                  className={`py-6 rounded-3xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                    formData.status === s ? 'bg-stone-900 border-stone-900 text-white shadow-xl' : 'bg-white border-stone-100 text-stone-400'
                  }`}
                >
                  {s === 'Confirmed' ? 'Coming!' : 'Regretfully decline'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
               <div className="flex items-center gap-4">
                  <Users className="text-[#D4AF37]" size={24} />
                  <h3 className="text-2xl font-serif font-bold text-stone-900">Family Members</h3>
               </div>
               <button 
                 type="button" 
                 onClick={addFamilyMember}
                 className="flex items-center gap-2 px-4 py-2 bg-[#FEF9E7] text-[#B8860B] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#D4AF37]/20 hover:scale-105 transition-all"
               >
                 <Plus size={14} /> Add Member
               </button>
            </div>
            
            <div className="space-y-4">
              {formData.familyMembers?.map((member, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-50 p-6 rounded-[2rem] border border-stone-100">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-stone-400 ml-2">Name</label>
                    <input 
                      type="text" 
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => updateFamilyMember(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-stone-400 ml-2">Age</label>
                    <input 
                      type="number" 
                      placeholder="Age"
                      value={member.age || ''}
                      onChange={(e) => updateFamilyMember(idx, 'age', parseInt(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button 
                      type="button"
                      onClick={() => removeFamilyMember(idx)}
                      className="flex-grow flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
              {formData.familyMembers?.length === 0 && (
                <p className="text-center text-stone-400 italic text-sm py-4">Are family members joining? Add them above!</p>
              )}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full gold-shimmer text-stone-900 py-10 rounded-full font-black uppercase tracking-[0.4em] text-sm shadow-2xl hover:scale-[1.03] transition-all flex items-center justify-center gap-4"
          >
            Submit Celebration RSVP <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RSVPForm;