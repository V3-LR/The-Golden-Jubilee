
import React, { useState } from 'react';
import { Guest, RoomDetail, AppTab } from '../types';
import { ITINERARY, ROOM_DATABASE, EVENT_CONFIG } from '../constants';
import { 
  Calendar, MapPin, Shirt, Bed, Info, Clock, Heart, Maximize,
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
        onExitSimulation={() => setIsRSVPMode(false)}
      />
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Welcome Banner - Pinterest Styled */}
      <div className="relative rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl bg-white border-[12px] border-white">
        <div className="absolute inset-0 opacity-[0.15] gold-shimmer glitter-overlay"></div>
        <div className="relative z-10 p-12 md:p-24 flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-2 border-[#D4AF37] p-1 gold-shimmer">
             <div className="w-full h-full bg-[#FCFAF2] rounded-full flex items-center justify-center text-[#B8860B]">
                <Heart size={44} fill="currentColor" />
             </div>
          </div>
          
          <div className="space-y-4">
             <h1 className="text-4xl md:text-8xl font-serif font-bold text-stone-900 leading-tight">
               Welcome, <span className="gold-text-gradient">{guest.name.split(' ')[0]}</span>
             </h1>
             <p className="text-stone-400 font-cinzel text-sm md:text-xl uppercase tracking-[0.5em]">
               The Golden Jubilee Celebration
             </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-[#FEF9E7] px-8 py-3 rounded-full border border-[#D4AF37]/20 text-[#B8860B] text-[10px] font-black uppercase tracking-widest shadow-sm">
              {guest.side} Side
            </div>
            <div className={`px-8 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 ${guest.status === 'Confirmed' ? 'bg-green-600' : 'bg-[#B8860B] animate-pulse'}`}>
              {guest.status === 'Confirmed' ? <UserCheck size={14} /> : <MailOpen size={14} />}
              Status: {guest.status}
            </div>
          </div>

          {/* URGENT RSVP CTA */}
          {guest.status !== 'Confirmed' && (
            <button 
              onClick={() => setIsRSVPMode(true)}
              className="mt-6 gold-shimmer text-stone-900 px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-[0_20px_40px_rgba(212,175,55,0.4)] hover:scale-105 transition-all flex items-center gap-4 animate-bounce"
            >
              Confirm Your Family RSVP <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Group Info Summary */}
      {guest.paxCount && guest.paxCount > 1 && (
        <div className="bg-stone-900 text-white rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 border border-[#D4AF37]/30 shadow-2xl">
           <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-stone-900 shrink-0 shadow-xl">
              <Users size={32} />
           </div>
           <div className="flex-grow text-center md:text-left space-y-2">
              <h4 className="text-2xl font-serif font-bold text-[#D4AF37]">Traveling Group of {guest.paxCount}</h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                Includes: <span className="text-white font-bold">{guest.name}</span>
                {guest.familyMembers?.map(m => `, ${m.name} (Age: ${m.age})`).join('')}
              </p>
           </div>
        </div>
      )}

      {/* Your Estate Assignment */}
      <section className="space-y-8">
        <h2 className="text-3xl font-serif font-bold text-stone-900 px-4">Heritage Residence</h2>
        {room ? (
          <div 
            onClick={() => setSelectedRoom(room)}
            className="bg-white rounded-[4rem] overflow-hidden border border-stone-100 shadow-xl flex flex-col lg:flex-row group cursor-pointer transition-all duration-700"
          >
            <div className="lg:w-3/5 h-[400px] lg:h-auto overflow-hidden relative">
              <img src={room.image} className="w-full h-full object-cover" alt={room.title} />
              <div className="absolute top-8 left-8 bg-stone-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20">
                {room.property} • #{room.roomNo}
              </div>
            </div>
            <div className="lg:w-2/5 p-12 md:p-16 flex flex-col justify-center bg-[#FCFAF2]">
              <h3 className="text-4xl font-serif font-bold text-stone-900 mb-4">{room.title}</h3>
              <p className="text-stone-500 text-lg mb-8 italic">{room.description}</p>
              <div className="space-y-3">
                {room.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 text-stone-700 font-bold text-xs uppercase tracking-tight">
                    <CheckCircle size={16} className="text-[#D4AF37]" /> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-20 text-center bg-white rounded-[4rem] border-2 border-dashed border-[#D4AF37]/20 shadow-inner">
            <Bed className="mx-auto text-[#D4AF37] opacity-20 mb-6" size={60} />
            <h4 className="text-2xl font-serif font-bold text-stone-900">Room Assignment in Progress</h4>
          </div>
        )}
      </section>

      {/* Itinerary */}
      <section className="space-y-10">
        <h2 className="text-3xl font-serif font-bold text-stone-900 px-4">Celebration Itinerary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ITINERARY.map((event) => (
            <div key={event.id} className="bg-white rounded-[3rem] p-10 border border-stone-100 shadow-xl space-y-6 group hover:border-[#D4AF37]/50 transition-all">
              <div className="flex items-center gap-3 text-[#D4AF37]">
                <Clock size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">{event.time}</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-serif font-bold text-stone-900">{event.title}</h3>
              <p className="text-stone-500 italic leading-relaxed">"{event.description}"</p>
              <div className="pt-6 border-t border-stone-50 flex flex-col gap-3">
                 <div className="flex items-center gap-4 text-stone-700 text-sm font-bold">
                    <MapPin size={16} className="text-[#D4AF37]" /> {event.location}
                 </div>
                 <div className="flex items-center gap-4 text-stone-700 text-sm font-bold">
                    <Shirt size={16} className="text-[#D4AF37]" /> {event.dressCode}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Room Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-stone-900/95 z-[300] flex items-center justify-center p-4" onClick={() => setSelectedRoom(null)}>
           <button onClick={() => setSelectedRoom(null)} className="fixed top-8 right-8 z-[310] bg-[#D4AF37] text-stone-900 p-4 rounded-full shadow-2xl hover:scale-110 transition-all">
              <X size={24} />
           </button>
           <div className="bg-white rounded-[4rem] max-w-4xl w-full overflow-hidden flex flex-col md:flex-row shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="md:w-1/2 h-80 md:h-auto">
                 <img src={selectedRoom.image} className="w-full h-full object-cover" alt="Room" />
              </div>
              <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                 <span className="text-[#D4AF37] font-black text-[10px] uppercase tracking-widest mb-4">Honored Guest Room</span>
                 <h2 className="text-4xl font-serif font-bold text-stone-900 mb-8">{selectedRoom.title}</h2>
                 <p className="text-stone-500 mb-8 leading-relaxed italic">{selectedRoom.description}</p>
                 <div className="flex items-center gap-4 bg-[#FCFAF2] p-6 rounded-3xl border border-[#D4AF37]/20">
                    <Info size={24} className="text-[#D4AF37]" />
                    <span className="text-xs font-bold text-[#B8860B] uppercase">Please check-in at the main villa reception upon arrival.</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GuestPortal;
