import React, { useState } from 'react';
import { Guest, RoomDetail } from '../types';
import { ITINERARY, ROOM_DATABASE } from '../constants';
import { 
  Calendar, MapPin, Shirt, Bed, Info, Clock, Heart,
  ArrowRight, X, CheckCircle, MailOpen, UserCheck, Users
} from 'lucide-react';
import RSVPForm from './RSVPForm';

interface GuestPortalProps {
  guest: Guest;
  onUpdate?: (id: string, updates: Partial<Guest>) => void;
}

const GuestPortal: React.FC<GuestPortalProps> = ({ guest, onUpdate }) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const [isRSVPMode, setIsRSVPMode] = useState(false);

  const room = ROOM_DATABASE.find(r => r.roomNo === guest.roomNo && r.property === guest.property);

  if (isRSVPMode && onUpdate) {
    return (
      <RSVPForm 
        guest={guest} 
        onSubmit={(updates) => {
          onUpdate(guest.id, { ...updates, status: 'Confirmed' });
          setIsRSVPMode(false);
        }}
        onGoToDashboard={() => setIsRSVPMode(false)}
        onExitSimulation={() => setIsRSVPMode(false)}
      />
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700 min-h-screen">
      {/* Welcome Banner - Master Link Integrated */}
      <div className="relative rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl bg-white border-[12px] border-white min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.15] gold-shimmer glitter-overlay"></div>
        <div className="relative z-10 p-12 md:p-24 flex flex-col items-center text-center space-y-10 w-full">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-2 border-[#D4AF37] p-1 gold-shimmer animate-in zoom-in duration-1000">
             <div className="w-full h-full bg-[#FCFAF2] rounded-full flex items-center justify-center text-[#B8860B]">
                <Heart size={44} fill="currentColor" />
             </div>
          </div>
          
          <div className="space-y-6">
             <h1 className="text-4xl md:text-8xl font-serif font-bold text-stone-900 leading-tight">
               Pranam, <span className="gold-text-gradient">{guest.name.split(' ')[0]}</span>
             </h1>
             <p className="text-stone-400 font-cinzel text-sm md:text-xl uppercase tracking-[0.5em]">
               The Golden Jubilee Celebration
             </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className={`px-8 py-3 rounded-full border border-[#D4AF37]/20 text-[#B8860B] text-[10px] font-black uppercase tracking-widest shadow-sm ${guest.side === 'Ladkiwale' ? 'bg-pink-50' : guest.side === 'Ladkewale' ? 'bg-blue-50' : 'bg-stone-50'}`}>
              Team {guest.side}
            </div>
            <div className={`px-8 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 ${guest.status === 'Confirmed' ? 'bg-green-600' : 'bg-[#B8860B] animate-pulse'}`}>
              {guest.status === 'Confirmed' ? <UserCheck size={14} /> : <MailOpen size={14} />}
              RSVP: {guest.status}
            </div>
          </div>

          {guest.status !== 'Confirmed' && (
            <button 
              onClick={() => setIsRSVPMode(true)}
              className="mt-6 gold-shimmer text-stone-900 px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-[0_20px_40px_rgba(212,175,55,0.4)] hover:scale-105 transition-all flex items-center gap-4"
            >
              Fill Your Family Details <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Group Info Summary */}
      {(guest.paxCount || (guest.familyMembers?.length || 0) > 0) && (
        <div className="bg-stone-900 text-white rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 border border-[#D4AF37]/30 shadow-2xl mx-4">
           <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-stone-900 shrink-0 shadow-xl">
              <Users size={32} />
           </div>
           <div className="flex-grow text-center md:text-left space-y-2">
              <h4 className="text-2xl font-serif font-bold text-[#D4AF37]">Traveling Party ({guest.paxCount || (1 + (guest.familyMembers?.length || 0))})</h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                <span className="text-white font-bold">{guest.name}</span>
                {guest.familyMembers?.map(m => `, ${m.name} (${m.age})`).join('')}
              </p>
           </div>
        </div>
      )}

      {/* Your Estate Assignment */}
      <section className="space-y-8 px-4">
        <h2 className="text-3xl font-serif font-bold text-stone-900">Your Goan Residence</h2>
        {room ? (
          <div 
            onClick={() => setSelectedRoom(room)}
            className="bg-white rounded-[4rem] overflow-hidden border border-stone-100 shadow-xl flex flex-col lg:flex-row group cursor-pointer transition-all duration-700 hover:border-[#D4AF37]/40"
          >
            <div className="lg:w-3/5 h-[400px] lg:h-[600px] overflow-hidden relative">
              <img src={room.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={room.title} />
              <div className="absolute top-8 left-8 bg-stone-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20">
                {room.property} • Suite {room.roomNo}
              </div>
            </div>
            <div className="lg:w-2/5 p-12 md:p-20 flex flex-col justify-center bg-[#FCFAF2]">
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">{room.title}</h3>
              <p className="text-stone-500 text-xl mb-10 italic leading-relaxed">{room.description}</p>
              <div className="grid grid-cols-1 gap-4">
                {room.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 text-stone-700 font-bold text-xs uppercase tracking-tight bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                    <CheckCircle size={18} className="text-[#D4AF37]" /> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-24 text-center bg-white rounded-[4rem] border-4 border-dashed border-[#D4AF37]/20 shadow-inner">
            <Bed className="mx-auto text-[#D4AF37] opacity-20 mb-8" size={80} />
            <h4 className="text-3xl font-serif font-bold text-stone-900">Villa Allocation in Progress</h4>
            <p className="text-stone-400 mt-4 italic font-serif">"Mapping heritage stays for all VIPs..."</p>
          </div>
        )}
      </section>

      {/* Itinerary */}
      <section className="space-y-10 px-4">
        <h2 className="text-3xl font-serif font-bold text-stone-900">Personal Itinerary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {ITINERARY.map((event) => (
            <div key={event.id} className="bg-white rounded-[3.5rem] p-12 border border-stone-100 shadow-xl space-y-8 group hover:border-[#D4AF37]/50 transition-all relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-[0.03] text-[#D4AF37] group-hover:scale-150 transition-transform duration-1000">
                <Calendar size={200} />
              </div>
              <div className="flex items-center gap-3 text-[#D4AF37]">
                <Clock size={20} />
                <span className="text-[12px] font-black uppercase tracking-[0.4em]">{event.time}</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-stone-900">{event.title}</h3>
              <p className="text-stone-500 text-lg italic leading-relaxed font-light">"{event.description}"</p>
              <div className="pt-8 border-t border-[#D4AF37]/10 flex flex-col gap-5">
                 <div className="flex items-center gap-5 text-stone-700 text-base font-bold">
                    <div className="p-3 bg-stone-50 rounded-xl"><MapPin size={20} className="text-[#D4AF37]" /></div>
                    {event.location}
                 </div>
                 <div className="flex items-center gap-5 text-stone-700 text-base font-bold">
                    <div className="p-3 bg-stone-50 rounded-xl"><Shirt size={20} className="text-[#D4AF37]" /></div>
                    {event.dressCode}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Room Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-stone-900/98 z-[500] flex items-center justify-center p-4 animate-in fade-in duration-500" onClick={() => setSelectedRoom(null)}>
           <button onClick={() => setSelectedRoom(null)} className="fixed top-10 right-10 z-[510] bg-[#D4AF37] text-stone-900 p-6 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:scale-110 transition-all">
              <X size={28} />
           </button>
           <div className="bg-white rounded-[5rem] max-w-5xl w-full overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)] border-8 border-white" onClick={e => e.stopPropagation()}>
              <div className="md:w-1/2 h-80 md:h-auto overflow-hidden">
                 <img src={selectedRoom.image} className="w-full h-full object-cover" alt="Room" />
              </div>
              <div className="md:w-1/2 p-16 md:p-24 flex flex-col justify-center bg-[#FCFAF2]">
                 <span className="text-[#D4AF37] font-black text-[11px] uppercase tracking-[0.5em] mb-6">Honored Guest Room View</span>
                 <h2 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-10">{selectedRoom.title}</h2>
                 <p className="text-stone-500 text-xl mb-12 leading-relaxed italic font-light">{selectedRoom.description}</p>
                 <div className="flex items-center gap-6 bg-white p-10 rounded-[3rem] border border-[#D4AF37]/20 shadow-xl">
                    <Info size={32} className="text-[#D4AF37] shrink-0" />
                    <span className="text-sm font-bold text-stone-800 uppercase leading-relaxed tracking-wider">Our family steward will meet you at the Villa gate for key presentation.</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GuestPortal;