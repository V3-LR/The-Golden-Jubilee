
import React, { useState } from 'react';
import { UserRole } from '../types';
import { EVENT_CONFIG } from '../constants';
import { Sparkles, ShieldCheck, Heart, Sun, Trees, Key, UserCircle, ShieldAlert } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole, guestId?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [plannerCode, setPlannerCode] = useState('');
  const [guestCode, setGuestCode] = useState('');
  const [error, setError] = useState('');

  const handlePlannerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const upperCode = plannerCode.toUpperCase();
    if (upperCode === EVENT_CONFIG.fullAccessCode) {
      onLogin('planner');
    } else if (upperCode === EVENT_CONFIG.guestAccessCode) {
      onLogin('guest');
    } else {
      setError('Invalid Access Code. Please check with Nisha.');
    }
  };

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = guestCode.trim().toLowerCase();
    if (cleanId.startsWith('guest-')) {
      onLogin('guest', cleanId);
    } else {
      setError('Invalid Guest ID. Example: guest-4');
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF9E7] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Decorative Golden Goan Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
        <Sun className="absolute -top-10 -left-10 md:-top-20 md:-left-20 text-[#D4AF37]" size={400} />
        <Trees className="absolute -bottom-10 -right-10 md:-bottom-20 md:-right-20 text-[#2D5A27]" size={400} />
      </div>

      <div className="max-w-xl w-full relative z-10">
        <div className="text-center mb-10 md:mb-14 px-2 space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl border-4 border-[#D4AF37] p-1 gold-shimmer">
            <div className="bg-[#FEF9E7] w-full h-full rounded-full flex items-center justify-center text-[#B8860B]">
              <Heart size={44} fill="currentColor" className="opacity-80" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-cinzel text-[#B8860B] text-lg md:text-2xl uppercase tracking-[0.4em] md:tracking-[0.6em]">{EVENT_CONFIG.theme}</h2>
            <div className="h-0.5 w-16 bg-[#D4AF37] mx-auto opacity-40"></div>
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">
            The Golden Jubilee
          </h1>
          <p className="text-[#B8860B] uppercase tracking-[0.3em] text-[11px] md:text-base font-black italic">
            Mummy & Papa ki 50vi Saalgira
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-4 border-white relative">
            <form onSubmit={handlePlannerLogin} className="space-y-6">
              <label className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B]">
                <Key size={14} /> Master Access Code
              </label>
              <input
                type="text"
                value={plannerCode}
                onChange={(e) => setPlannerCode(e.target.value)}
                placeholder="18042026"
                className="w-full bg-stone-50 border-b-2 border-stone-200 px-6 py-4 text-center font-cinzel text-xl md:text-2xl font-bold tracking-[0.4em] text-stone-900 focus:outline-none focus:border-[#D4AF37] transition-all rounded-t-2xl"
              />
              <button
                type="submit"
                className="w-full bg-stone-900 text-white py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                Access Estate List
              </button>
            </form>

            <div className="relative py-10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100"></div></div>
              <span className="relative bg-white px-4 text-[10px] font-black text-stone-300 uppercase tracking-widest">Digital Entrance</span>
            </div>

            <form onSubmit={handleGuestLogin} className="space-y-6">
              <label className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
                <UserCircle size={14} /> View My Invitation (Guest ID)
              </label>
              <input
                type="text"
                value={guestCode}
                onChange={(e) => setGuestCode(e.target.value)}
                placeholder="guest-1"
                className="w-full bg-stone-50 border-b-2 border-stone-100 px-6 py-4 text-center text-sm md:text-base font-bold tracking-[0.1em] text-stone-600 focus:outline-none focus:border-[#D4AF37] transition-all rounded-t-2xl"
              />
              <button
                type="submit"
                className="w-full gold-shimmer text-stone-900 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Open My Digital Patrikaa
              </button>
            </form>

            {error && (
              <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600">
                <ShieldAlert size={16} />
                <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
              </div>
            )}
          </div>

          <p className="text-center text-[9px] text-stone-400 uppercase tracking-[0.5em] font-medium px-8 leading-loose">
            Secure Master Planner System • Estate Hardware Sync V6
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
