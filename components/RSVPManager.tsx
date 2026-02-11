import React, { useState } from 'react';
import { Guest, UserRole } from '../types';
import { 
  CheckCircle, Clock, Eye, X, Camera, Heart, Sun, Zap, 
  MessageCircle, Share2, ClipboardCheck, Link as LinkIcon,
  Users as UsersIcon, MapPin
} from 'lucide-react';
import { PROPERTY_LOCATIONS } from '../constants';

interface RSVPManagerProps {
  guests: Guest[];
  onUpdate: (id: string, updates: Partial<Guest>) => void;
  role: UserRole;
  onTeleport: (guestId: string) => void;
}

const RSVPManager: React.FC<RSVPManagerProps> = ({ guests, onUpdate, role, onTeleport }) => {
  const [selectedForCard, setSelectedForCard] = useState<Guest | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const confirmed = guests.filter(g => g.status === 'Confirmed');
  const totalPax = guests.reduce((acc, curr) => acc + (curr.status === 'Confirmed' ? (curr.paxCount || 1) : 0), 0);

  const copyMagicLink = (guest: Guest) => {
    const url = `${window.location.origin}${window.location.pathname}?id=${guest.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkId(guest.id);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const generateWhatsAppMessage = (guest: Guest) => {
    const magicLink = `${window.location.origin}${window.location.pathname}?id=${guest.id}`;
    const text = `*Pranam ${guest.name} Ji!* 🙏

You are cordially invited to the *Golden Jubilee* of Mummy & Papa in Goa! 🌴✨

*View Your Personal Invitation & RSVP:*
${magicLink}

Hum aapke aagman ki pratiksha karenge! 🧡`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const getLocationInfo = (property: string) => {
    if (['Villa-Pool', 'Villa-Hall', 'TreeHouse'].includes(property)) {
      return PROPERTY_LOCATIONS.FAMILY_ESTATE;
    }
    return PROPERTY_LOCATIONS.RESORT;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div>
          <h2 className="text-3xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">Digital <span className="text-[#B8860B]">Patrikaas</span></h2>
          <p className="text-stone-500 text-base italic mt-3">Managing {guests.length} units and {totalPax} total expected Pax.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 text-center shadow-lg">
            <p className="text-[9px] font-black uppercase text-stone-400 mb-1 tracking-widest">Invites</p>
            <p className="text-3xl font-serif font-bold text-stone-900">{guests.length}</p>
          </div>
          <div className="bg-[#D4AF37] p-6 rounded-3xl text-center shadow-lg">
            <p className="text-[9px] font-black uppercase text-stone-900/60 mb-1 tracking-widest">Total Pax</p>
            <p className="text-3xl font-serif font-bold text-stone-900">{totalPax}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-stone-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="bg-stone-50 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
              <tr>
                <th className="px-10 py-8">Primary Guest</th>
                <th className="px-10 py-8">Family Unit (Husband/Kids)</th>
                <th className="px-10 py-8 text-center">RSVP</th>
                <th className="px-10 py-8 text-right">Invite Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-[#FCFAF2] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                       <span className="font-bold text-stone-900 text-xl group-hover:text-[#B8860B] transition-colors">{guest.name}</span>
                       <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest">{guest.side} Side</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-wrap gap-2">
                      {guest.familyMembers && guest.familyMembers.length > 0 ? (
                        guest.familyMembers.map((m, i) => (
                          <div key={i} className="bg-white border border-stone-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-stone-600 shadow-sm flex items-center gap-2">
                             <UsersIcon size={12} className="text-[#D4AF37]" /> {m.name} ({m.age})
                          </div>
                        ))
                      ) : (
                        <span className="text-stone-300 italic text-xs">No family added yet</span>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                      guest.status === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {guest.status === 'Confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {guest.status} {guest.paxCount && guest.paxCount > 1 ? `(${guest.paxCount} Pax)` : ''}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedForCard(guest)}
                        className="p-4 bg-stone-900 text-[#D4AF37] rounded-2xl shadow-xl hover:scale-110 transition-all"
                        title="Visual Patrikaa"
                      >
                        <Camera size={20} />
                      </button>
                      
                      <button 
                        onClick={() => copyMagicLink(guest)}
                        className={`p-4 rounded-2xl transition-all border shadow-sm ${
                          copiedLinkId === guest.id ? 'bg-[#D4AF37] border-[#D4AF37] text-stone-900' : 'bg-white text-stone-500 border-stone-100 hover:border-[#D4AF37]'
                        }`}
                        title="Copy Magic Link"
                      >
                        {copiedLinkId === guest.id ? <CheckCircle size={20} /> : <LinkIcon size={20} />}
                      </button>

                      <button 
                        onClick={() => generateWhatsAppMessage(guest)}
                        className="p-4 bg-white text-green-600 border border-green-100 rounded-2xl hover:bg-green-50 transition-all shadow-sm"
                        title="Send WhatsApp"
                      >
                        <MessageCircle size={20} />
                      </button>

                      <button 
                        onClick={() => onTeleport(guest.id)}
                        className="p-4 bg-stone-50 border border-stone-100 text-stone-300 rounded-2xl hover:text-[#B8860B] transition-all"
                        title="View Guest Portal"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ornate Invitation Card Modal */}
      {selectedForCard && (
        <div className="fixed inset-0 bg-stone-900/98 z-[500] flex items-center justify-center p-4 overflow-y-auto">
          <button 
            onClick={() => setSelectedForCard(null)}
            className="fixed top-8 right-8 z-[510] bg-[#D4AF37] text-stone-900 p-5 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.6)] hover:scale-110 transition-all border-4 border-white"
          >
            <X size={28} />
          </button>

          <div className="max-w-md w-full relative py-12 md:py-20 animate-in zoom-in duration-500">
            {/* Main Card Container with Ornate Styling */}
            <div className="bg-[#FDFBF7] rounded-[4rem] overflow-hidden shadow-[0_0_120px_rgba(212,175,55,0.4)] border-8 border-white relative">
               
               {/* Decorative Floral Corners (SVG simplified) */}
               <div className="absolute top-0 left-0 p-8 opacity-40 pointer-events-none">
                 <Heart size={80} className="text-[#D4AF37]/20" />
               </div>
               <div className="absolute bottom-0 right-0 p-8 opacity-40 pointer-events-none">
                 <Heart size={80} className="text-[#D4AF37]/20" />
               </div>

               <div className="relative h-64 overflow-hidden border-b-4 border-white">
                  <img src={selectedForCard.property === 'Villa-Pool' ? 'https://images.unsplash.com/photo-1628592102751-ba83b03bc42e?auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="Villa" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent"></div>
               </div>

               <div className="px-10 pb-12 pt-2 text-center space-y-8">
                  <div className="space-y-3">
                     <p className="font-cinzel text-[#B8860B] text-lg uppercase tracking-[0.5em]">Goa Bulaye Re!</p>
                     <h1 className="text-4xl font-serif font-bold text-stone-900 leading-tight">Mummy & Papa ki <br/><span className="text-[#B8860B]">50vi Saalgira</span></h1>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[3rem] border-2 border-[#D4AF37]/20 shadow-sm relative overflow-hidden">
                     <div className="absolute inset-0 border border-[#D4AF37]/10 m-1 rounded-[2.8rem] pointer-events-none"></div>
                     <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Honored Guest</p>
                     <h3 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">{selectedForCard.name} Ji</h3>
                     {selectedForCard.paxCount && selectedForCard.paxCount > 1 && (
                        <p className="text-[10px] text-stone-400 font-bold mt-2 uppercase tracking-widest">PLUS {selectedForCard.paxCount - 1} FAMILY MEMBERS</p>
                     )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-left">
                     <div className="bg-white/80 p-6 rounded-3xl border border-stone-100 flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#FEF9E7] rounded-2xl flex items-center justify-center text-[#B8860B]">
                           <Zap size={20} className="opacity-70" />
                        </div>
                        <div className="flex-grow">
                           <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Your Stay</p>
                           <p className="text-base font-bold text-stone-900 leading-tight">{selectedForCard.property}</p>
                           <p className="text-[10px] font-black text-[#B8860B] uppercase">Room #{selectedForCard.roomNo}</p>
                           <div className="mt-2 pt-2 border-t border-stone-50">
                              <p className="text-[8px] font-black text-stone-400 uppercase mb-0.5">Location</p>
                              <p className="text-[10px] font-bold text-stone-800 leading-tight italic">
                                 {getLocationInfo(selectedForCard.property).name}
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="bg-white/80 p-6 rounded-3xl border border-stone-100 flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#FEF9E7] rounded-2xl flex items-center justify-center text-[#B8860B]">
                           <Sun size={20} className="opacity-70" />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">The Date</p>
                           <p className="text-base font-bold text-stone-900">April 17-18, 2026</p>
                           <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-widest">Arossim, Goa</p>
                        </div>
                     </div>
                  </div>

                  {/* Sign-off Section */}
                  <div className="pt-8 space-y-1">
                     <p className="text-[11px] text-stone-400 italic font-serif">With Love,</p>
                     <p className="text-xl font-serif font-bold text-stone-800">The Srivastava Family</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RSVPManager;