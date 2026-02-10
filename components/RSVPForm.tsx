
import React, { useState } from 'react';
import { Guest, RoomDetail } from '../types';
import { EVENT_CONFIG, ROOM_DATABASE } from '../constants';
import { Heart, Sun, Trees, CheckCircle, Plane, Utensils, Music, ArrowRight, Users, LayoutDashboard, Bed, MapPin, Sparkles, X } from 'lucide-react';

interface RSVPFormProps {
  guest: Guest;
  onSubmit: (updates: Partial<Guest>) => void;
  onGoToDashboard?: () => void;
  onExitSimulation?: () => void;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ guest, onSubmit, onGoToDashboard, onExitSimulation }) => {
  const [formData, setFormData] = useState<Partial<Guest>>({
    status: guest.status || 'Confirmed',
    paxCount: guest.paxCount || 1,
    side: guest.side || 'Common',
    allergies: guest.allergies || '',
    drinksPreference: guest.drinksPreference || 'Both',
    arrivalDateTime: guest.arrivalDateTime || '',
    arrivalFlight: guest.arrivalFlight || '',
    departureDateTime: guest.departureDateTime || '',
    departureFlight: guest.departureFlight || '',
    songRequest: guest.songRequest || '',
    personalMessage: guest.personalMessage || '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, rsvpTimestamp: new Date().toISOString() });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FEF9E7] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full animate-in zoom-in duration-500">
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-[#D4AF37]/20">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Dhanyawad!</h2>
            <p className="text-stone-500 leading-relaxed italic mb-8">
              "We are honored that you will be joining us in Goa. Your preferences have been shared with the family."
            </p>
            <div className="space-y-4">
              <button 
                onClick={onGoToDashboard}
                className="w-full gold-shimmer text-stone-900 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-3"
              >
                <LayoutDashboard size={16} /> Enter Guest Dashboard
              </button>
              {onExitSimulation && (
                <button onClick={onExitSimulation} className="text-[10px] font-black uppercase text-stone-400 tracking-widest hover:text-[#D4AF37] transition-colors">
                  Exit Preview Mode
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEF9E7] py-12 md:py-24 px-4 relative overflow-x-hidden">
      {/* Simulation Header */}
      {onExitSimulation && (
        <div className="fixed top-0 left-0 w-full bg-stone-900 text-white py-3 px-6 z-[100] flex justify-between items-center border-b border-[#D4AF37]/30 shadow-2xl">
           <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Invitation Preview: <strong>{guest.name}</strong></span>
           </div>
           <button onClick={onExitSimulation} className="flex items-center gap-2 bg-[#D4AF37] text-stone-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
              <X size={12} /> Close Preview
           </button>
        </div>
      )}

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none -z-10">
        <Sun className="absolute -top-20 -left-20 text-[#D4AF37]" size={600} />
        <Trees className="absolute -bottom-20 -right-20 text-[#2D5A27]" size={600} />
      </div>

      <div className="max-w-3xl mx-auto space-y-16 pt-10">
        {/* The Digital Invitation Card (Patrika Style) */}
        <div className="relative animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-10 md:p-24 text-center shadow-2xl border-2 border-white/50 space-y-12">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-full shadow-2xl border-2 border-[#D4AF37] p-1 gold-shimmer mx-auto">
              <div className="bg-[#FEF9E7] w-full h-full rounded-full flex items-center justify-center text-[#B8860B]">
                <Heart size={48} fill="currentColor" />
              </div>
            </div>
            
            <div className="space-y-6">
              <p className="font-cinzel text-[#B8860B] text-lg md:text-2xl uppercase tracking-[0.4em]">Aapka Hardik Swagat Hai</p>
              <div className="h-0.5 w-20 bg-[#D4AF37] mx-auto opacity-40"></div>
              <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-900 leading-tight">Mummy & Papa ki <br/><span className="text-[#B8860B]">50vi Saalgira</span></h1>
              <p className="text-[#B8860B] text-[10px] md:text-sm font-black uppercase tracking-[0.5em] mt-4 italic">Sunehri Yaadein • Sunehra Jashn</p>
            </div>

            <div className="bg-[#FEF9E7] p-8 md:p-12 rounded-[3rem] border border-[#D4AF37]/10 shadow-inner">
               <p className="text-stone-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4">Honored Guest</p>
               <h3 className="text-3xl md:text-5xl font-serif font-bold text-stone-900">{guest.name} Ji</h3>
               <p className="text-[#B8860B] text-xs font-bold uppercase mt-4 tracking-widest italic opacity-70">Hum aapke aagman ki pratiksha karenge</p>
            </div>
          </div>
        </div>

        {/* The RSVP Form Section */}
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <form onSubmit={handleSubmit} className="bg-white rounded-[4rem] p-8 md:p-16 shadow-2xl border-4 border-white space-y-16">
            <div className="text-center">
               <div className="inline-block bg-[#FEF9E7] text-[#B8860B] px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6">Celebration Preferences</div>
               <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-tight">RSVP Submission</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <section className="space-y-6">
                 <label className="flex items-center gap-3 text-stone-400 text-[10px] font-black uppercase tracking-widest">
                    <Sun size={14} className="text-[#D4AF37]" /> Attendance
                 </label>
                 <div className="grid grid-cols-1 gap-4">
                    {['Confirmed', 'Declined'].map((s) => (
                      <button
                        key={s} type="button" onClick={() => setFormData({ ...formData, status: s as any })}
                        className={`py-6 rounded-3xl text-sm font-bold uppercase border-2 transition-all ${
                          formData.status === s ? 'bg-stone-900 border-stone-900 text-white shadow-xl scale-[1.02]' : 'bg-white border-stone-100 text-stone-400 hover:border-[#D4AF37]/30'
                        }`}
                      >
                        {s === 'Confirmed' ? 'We are coming!' : 'Sadly, cannot attend'}
                      </button>
                    ))}
                 </div>
               </section>

               <section className="space-y-6">
                 <label className="flex items-center gap-3 text-stone-400 text-[10px] font-black uppercase tracking-widest">
                    <Users size={14} className="text-[#D4AF37]" /> Family Side
                 </label>
                 <div className="grid grid-cols-1 gap-4">
                    {['Ladkiwale', 'Ladkewale', 'Common'].map((s) => (
                      <button
                        key={s} type="button" onClick={() => setFormData({ ...formData, side: s as any })}
                        className={`py-6 rounded-3xl text-sm font-bold uppercase border-2 transition-all ${
                          formData.side === s ? 'bg-[#B8860B] border-[#B8860B] text-white shadow-xl scale-[1.02]' : 'bg-white border-stone-100 text-stone-400 hover:border-[#D4AF37]/30'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                 </div>
               </section>
            </div>

            <button 
              type="submit"
              className="w-full gold-shimmer text-stone-900 py-10 rounded-full font-black uppercase tracking-[0.4em] text-sm md:text-base shadow-2xl hover:scale-[1.03] transition-all flex items-center justify-center gap-4 group"
            >
              Confirm RSVP <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RSVPForm;
