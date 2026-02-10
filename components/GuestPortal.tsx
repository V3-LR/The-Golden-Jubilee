
import React, { useState } from 'react';
import { Guest, RoomDetail } from '../types';
import { ITINERARY, ROOM_DATABASE, EVENT_CONFIG } from '../constants';
import { 
  Calendar, 
  MapPin, 
  Shirt, 
  Bed, 
  Info, 
  Clock, 
  Sun, 
  Heart, 
  Maximize,
  ChevronRight,
  ArrowRight,
  X,
  CheckCircle
} from 'lucide-react';

interface GuestPortalProps {
  guest: Guest;
}

const GuestPortal: React.FC<GuestPortalProps> = ({ guest }) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const room = ROOM_DATABASE.find(r => r.roomNo === guest.roomNo && r.property === guest.property);

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="relative rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-stone-900 border-8 border-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover" 
            alt="Estate"
          />
        </div>
        <div className="relative z-10 p-10 md:p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 md:w-32 md:h-32 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <Heart className="text-[#D4AF37]" size={50} fill="currentColor" />
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Welcome, {guest.name}!
          </h1>
          <p className="text-[#D4AF37] font-black uppercase tracking-[0.5em] text-[10px] md:text-base mb-10 opacity-80">
            {EVENT_CONFIG.theme} Guest
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-full border border-white/10 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
              {guest.side} Parivaar
            </div>
            <div className="bg-[#D4AF37] px-6 py-3 rounded-full text-stone-900 text-[10px] font-black uppercase tracking-widest shadow-xl">
              Verification: {guest.status}
            </div>
          </div>
        </div>
      </div>

      {/* Your Estate Assignment */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-3xl font-serif font-bold text-stone-900">Your Goa Residence</h2>
          <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-stone-100 shadow-sm">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none">Status: Confirmed</span>
          </div>
        </div>
        
        {room ? (
          <div 
            onClick={() => setSelectedRoom(room)}
            className="bg-white rounded-[3.5rem] overflow-hidden border border-[#D4AF37]/20 shadow-2xl flex flex-col lg:flex-row group cursor-pointer hover:shadow-[0_40px_80px_-20px_rgba(212,175,55,0.2)] transition-all duration-700"
          >
            <div className="lg:w-3/5 h-[400px] lg:h-auto overflow-hidden relative">
              <img 
                src={room.image} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                alt={room.title} 
              />
              <div className="absolute top-8 left-8 bg-stone-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20 shadow-2xl">
                {room.property} • Room {room.roomNo}
              </div>
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 flex items-center justify-center transition-all duration-500">
                <Maximize className="text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" size={60} />
              </div>
            </div>
            <div className="lg:w-2/5 p-10 md:p-16 flex flex-col justify-center">
              <span className="text-[#D4AF37] font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Selected Suite</span>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight">{room.title}</h3>
              <p className="text-stone-500 text-lg mb-10 leading-relaxed italic font-light">
                {room.description}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {room.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#FEF9E7]/50 p-4 rounded-2xl border border-[#D4AF37]/10 text-[11px] font-bold text-[#B8860B] uppercase tracking-tight">
                    <CheckCircle size={16} className="text-[#D4AF37]" />
                    {a}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 text-stone-300 group-hover:text-[#D4AF37] transition-colors">
                <Info size={18} />
                <p className="text-[11px] font-black uppercase tracking-widest">Click photo for estate walkthrough</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-20 text-center bg-white rounded-[3.5rem] border-4 border-dashed border-[#D4AF37]/20 shadow-inner">
            <Bed className="mx-auto text-[#D4AF37] opacity-20 mb-8" size={80} />
            <h4 className="text-3xl font-serif font-bold text-stone-900 mb-4 tracking-tight">Assignment Pending</h4>
            <p className="text-stone-400 font-serif italic text-xl max-w-lg mx-auto">Our planners are meticulously organizing your heritage suite allocation for the Golden Jubilee.</p>
          </div>
        )}
      </section>

      {/* Itinerary Grid */}
      <section className="space-y-10">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-3xl font-serif font-bold text-stone-900">Celebration Itinerary</h2>
          <span className="text-[11px] font-black text-stone-400 uppercase tracking-[0.3em] bg-stone-100 px-4 py-1 rounded-full">April 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ITINERARY.map((event) => (
            <div key={event.id} className="bg-white rounded-[3rem] p-8 border border-stone-100 shadow-xl hover:border-[#D4AF37]/50 transition-all flex flex-col h-full group">
              <div className="relative h-60 rounded-[2rem] overflow-hidden mb-8">
                <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={event.title} />
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-stone-900 shadow-2xl">
                  {event.date}
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-[#D4AF37] mb-4">
                <Clock size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">{event.time}</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-4 leading-tight">{event.title}</h3>
              <p className="text-stone-500 text-base mb-8 leading-relaxed italic">"{event.description}"</p>
              
              <div className="mt-auto pt-8 border-t border-stone-50 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FEF9E7] flex items-center justify-center text-[#B8860B] shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <span className="text-sm font-bold text-stone-700">{event.location}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FEF9E7] flex items-center justify-center text-[#B8860B] shadow-sm">
                    <Shirt size={20} />
                  </div>
                  <span className="text-sm font-bold text-stone-700">{event.dressCode}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <div className="bg-stone-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -left-20 text-white/5 pointer-events-none">
           <Sun size={400} />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-[#D4AF37]/30">
            Estate Support
          </div>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">Questions for the Host?</h3>
          <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto italic font-light leading-relaxed">
            "We are here to ensure your Golden Jubilee experience in Goa is flawless. Reach out to Nisha or the concierge for anything you need."
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
            <button className="gold-shimmer text-stone-900 px-10 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
              Message Nisha <ArrowRight size={18} />
            </button>
            <button className="bg-white/5 backdrop-blur-xl text-white border border-white/10 px-10 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all">
              Travel Help Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestPortal;
