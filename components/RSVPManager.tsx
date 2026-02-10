
import React, { useState } from 'react';
import { Guest, UserRole } from '../types';
import { EVENT_CONFIG } from '../constants';
import { 
  Copy, CheckCircle, Clock, Eye, X, Camera, Heart, Sun, Zap, 
  MessageCircle, Share2, ClipboardCheck, ArrowRight, Plane
} from 'lucide-react';

interface RSVPManagerProps {
  guests: Guest[];
  onUpdate: (id: string, updates: Partial<Guest>) => void;
  role: UserRole;
  onTeleport: (guestId: string) => void;
}

const RSVPManager: React.FC<RSVPManagerProps> = ({ guests, onUpdate, role, onTeleport }) => {
  const [selectedForCard, setSelectedForCard] = useState<Guest | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const confirmed = guests.filter(g => g.status === 'Confirmed');
  const totalPax = confirmed.reduce((acc, curr) => acc + (curr.paxCount || 1), 0);

  const generateWhatsAppMessage = (guest: Guest) => {
    const text = `*Pranam ${guest.name} Ji!* 🙏

You are cordially invited to the *Golden Jubilee* of Mummy & Papa in Goa! 🌴✨

*Stay Details:*
Property: ${guest.property}
Room: #${guest.roomNo}
Meal Plan: ${guest.mealPlan.lunch17}

*Itinerary Highlights:*
- Welcome Sundowner: April 17, 5 PM
- Golden Gala Dinner: April 18, 7:30 PM

*RSVP Verification:*
We have you marked as: *${guest.status}*

*Warm regards,*
The Family`;

    navigator.clipboard.writeText(text);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 3000);
    
    // Also try to open WhatsApp if possible
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Dynamic Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div>
          <h2 className="text-3xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">Digital <span className="text-[#B8860B]">Patrikaas</span></h2>
          <p className="text-stone-500 text-base italic mt-3">Sharing hub for all {guests.length} honored guest invites.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white p-5 rounded-3xl border border-stone-100 text-center shadow-sm">
            <p className="text-[8px] font-black uppercase text-stone-400 mb-1">Guests</p>
            <p className="text-2xl font-serif font-bold text-stone-900">{guests.length}</p>
          </div>
          <div className="bg-stone-900 p-5 rounded-3xl text-center shadow-lg">
            <p className="text-[8px] font-black uppercase text-stone-500 mb-1">Pax</p>
            <p className="text-2xl font-serif font-bold text-white">{totalPax}</p>
          </div>
        </div>
      </div>

      {/* Sharing Tool Logic Explanation */}
      <div className="bg-[#FEF9E7] border-4 border-[#D4AF37] p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
           <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center text-[#D4AF37] shadow-xl shrink-0">
              <Share2 size={32} />
           </div>
           <div className="flex-grow space-y-3 text-center md:text-left">
              <h4 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">The Sharing Solution</h4>
              <p className="text-stone-600 text-base leading-relaxed max-w-2xl font-medium">
                Because external links are temporary, use the <span className="text-[#B8860B] font-black uppercase mx-1">WHATSAPP</span> button to send a formal text invite, or <span className="text-[#B8860B] font-black uppercase mx-1">GENERATE CARD</span> to create a beautiful image for a screenshot.
              </p>
           </div>
        </div>
      </div>

      {/* Guest Invitation Table */}
      <div className="bg-white rounded-[3rem] border border-stone-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-stone-50 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
              <tr>
                <th className="px-10 py-8">Guest Name</th>
                <th className="px-10 py-8 text-center">RSVP</th>
                <th className="px-10 py-8">Stay Information</th>
                <th className="px-10 py-8 text-right">Invite Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-[#FEF9E7]/50 transition-colors group">
                  <td className="px-10 py-6">
                    <span className="font-bold text-stone-900 text-xl group-hover:text-[#B8860B] transition-colors">{guest.name}</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-50 text-[9px] font-black uppercase tracking-widest text-stone-400 border border-stone-100">
                      {guest.status === 'Confirmed' ? <CheckCircle size={14} className="text-green-500" /> : <Clock size={14} />}
                      {guest.status}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-stone-700">{guest.property}</span>
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Room #{guest.roomNo}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedForCard(guest)}
                        className="flex items-center gap-2 px-6 py-4 bg-stone-900 text-[#D4AF37] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                      >
                        <Camera size={14} /> Generate Card
                      </button>
                      <button 
                        onClick={() => generateWhatsAppMessage(guest)}
                        className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                          copiedId === guest.id ? 'bg-green-500 text-white border-green-500' : 'bg-white text-green-600 border-green-100 hover:border-green-300'
                        }`}
                      >
                        {copiedId === guest.id ? <ClipboardCheck size={14} /> : <MessageCircle size={14} />}
                        {copiedId === guest.id ? 'Text Copied' : 'WhatsApp Text'}
                      </button>
                      <button 
                        onClick={() => onTeleport(guest.id)}
                        className="p-4 bg-stone-50 border border-stone-100 text-stone-300 rounded-2xl hover:text-[#B8860B] hover:border-[#D4AF37] transition-all"
                        title="Simulate Mobile View"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Invitation Card Generator Modal */}
      {selectedForCard && (
        <div className="fixed inset-0 bg-stone-900/98 z-[200] flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
          <div className="max-w-md w-full relative py-20">
            <button 
              onClick={() => setSelectedForCard(null)}
              className="absolute top-10 right-0 text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] hover:text-[#D4AF37] transition-colors"
            >
              <X size={24} /> Close Designer
            </button>

            {/* THE PATRIKAA (Invitation Card) */}
            <div className="bg-white rounded-[4rem] overflow-hidden shadow-[0_0_120px_rgba(212,175,55,0.4)] border-8 border-white animate-in zoom-in duration-500">
               {/* Hero Section */}
               <div className="relative h-[280px] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Villa" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent"></div>
                  <div className="absolute top-10 left-0 w-full flex justify-center">
                     <div className="w-24 h-24 bg-white rounded-full p-1 gold-shimmer shadow-2xl">
                        <div className="w-full h-full bg-[#FEF9E7] rounded-full flex items-center justify-center text-[#B8860B]">
                           <Heart size={40} fill="currentColor" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Card Body */}
               <div className="px-10 pb-16 pt-2 text-center space-y-8 bg-white">
                  <div className="space-y-3">
                     <p className="font-cinzel text-[#B8860B] text-lg uppercase tracking-[0.5em]">Goa Bulaye Re!</p>
                     <div className="h-px w-20 bg-[#D4AF37]/40 mx-auto"></div>
                     <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
                        Mummy & Papa ki <br/>
                        <span className="text-[#B8860B]">50vi Saalgira</span>
                     </h1>
                  </div>

                  <div className="bg-[#FEF9E7] p-8 rounded-[3rem] border border-[#D4AF37]/10 space-y-2 shadow-inner">
                     <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Honored Guest</p>
                     <h3 className="text-3xl font-serif font-bold text-stone-900">{selectedForCard.name} Ji</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-left">
                     <div className="flex items-center gap-5 bg-stone-50 p-6 rounded-3xl border border-stone-100">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-sm">
                           <Zap size={20} />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Your Private Stay</p>
                           <p className="text-base font-bold text-stone-900">{selectedForCard.property}</p>
                           <p className="text-[10px] font-black text-[#B8860B] uppercase">Room #{selectedForCard.roomNo}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-5 bg-stone-50 p-6 rounded-3xl border border-stone-100">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-sm">
                           <Sun size={20} />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">The Celebration</p>
                           <p className="text-base font-bold text-stone-900">April 17-18, 2026</p>
                           <p className="text-[10px] font-black text-[#B8860B] uppercase">Arpora & Cansaulim, Goa</p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-4">
                     <p className="text-stone-400 text-[10px] font-bold italic leading-relaxed px-4">
                       "Take a screenshot of this card to share the stay details with your family over WhatsApp!"
                     </p>
                  </div>
               </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
               <div className="flex items-center gap-4 bg-stone-800/40 backdrop-blur-2xl px-8 py-4 rounded-full text-white text-[11px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-3xl animate-bounce">
                  <Camera size={18} className="text-[#D4AF37]" /> Screenshot to Share
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RSVPManager;
