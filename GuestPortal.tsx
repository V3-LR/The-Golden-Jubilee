import React, { useState, useRef } from 'react';
import { Guest, RoomDetail, EventFunction } from '../types';
import { PROPERTY_LOCATIONS } from '../constants';
import { 
  Calendar, MapPin, Shirt, Bed, Info, Clock, Heart,
  ArrowRight, X, CheckCircle, MailOpen, UserCheck, Users, Navigation, Camera, ShieldAlert, EyeOff, Edit3
} from 'lucide-react';
import RSVPForm from './RSVPForm';

interface GuestPortalProps {
  guest: Guest;
  roomDatabase: RoomDetail[];
  itinerary: EventFunction[];
  onUpdate: (id: string, updates: Partial<Guest>) => void;
  onUpdateEventImage: (eventId: string, base64: string) => void;
  onUpdateRoomImage: (roomNo: string, property: string, base64: string) => void;
  isPlanner: boolean;
  onBackToMaster?: () => void;
}

const GuestPortal: React.FC<GuestPortalProps> = ({ guest, onUpdate, roomDatabase, itinerary, onUpdateEventImage, onUpdateRoomImage, isPlanner, onBackToMaster }) => {
  const [isRSVPMode, setIsRSVPMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{type: 'event' | 'room', id: string} | null>(null);

  const room = roomDatabase.find(r => r.roomNo === guest.roomNo && r.property === guest.property);
  const locationInfo = ['Villa-Pool', 'Villa-Hall', 'TreeHouse'].includes(guest.property) ? PROPERTY_LOCATIONS.FAMILY_ESTATE : PROPERTY_LOCATIONS.RESORT;

  // Robust name personalization
  const getFirstName = (fullName: string) => {
    if (!fullName) return 'Guest';
    const parts = fullName.trim().split(' ');
    return parts[0];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (uploadTarget.type === 'event') onUpdateEventImage(uploadTarget.id, reader.result as string);
        if (uploadTarget.type === 'room' && room) onUpdateRoomImage(room.roomNo, room.property, reader.result as string);
        setUploadTarget(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (e: React.MouseEvent, type: 'event' | 'room', id: string) => {
    e.stopPropagation();
    setUploadTarget({ type, id });
    fileInputRef.current?.click();
  };

  if (isRSVPMode) {
    return (
      <RSVPForm 
        guest={guest} 
        onSubmit={(u) => { onUpdate(guest.id, { ...u, status: 'Confirmed' }); setIsRSVPMode(false); }} 
        onGoToDashboard={() => setIsRSVPMode(false)} 
        onExitSimulation={() => setIsRSVPMode(false)} 
      />
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700 min-h-screen bg-[#FCFAF2]">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      {isPlanner && (
        <div className="bg-stone-900 text-white p-5 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between border-2 border-[#D4AF37] shadow-2xl mb-10 gap-4">
          <div className="flex items-center gap-4">
            <UserCheck className="text-[#D4AF37]" size={24} />
            <p className="text-sm font-bold">Admin Preview Mode: <span className="text-[#D4AF37] font-black">{guest.name}</span></p>
          </div>
          <button onClick={onBackToMaster} className="bg-[#D4AF37] text-stone-900 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
            <EyeOff size={16} /> Exit Preview
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl bg-white border-[12px] border-white min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.15] gold-shimmer glitter-overlay"></div>
        <div className="relative z-10 p-12 text-center space-y-10 w-full">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto border-2 border-[#D4AF37] gold-shimmer shadow-xl">
             <Heart size={44} fill="currentColor" className="text-[#B8860B]" />
          </div>
          <div className="space-y-4">
            <p className="font-cinzel text-[#B8860B] text-xl uppercase tracking-[0.5em] animate-pulse">Hum Aatishbaz hain!</p>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-900 leading-tight">Pranam, <br/><span className="gold-text-gradient">{getFirstName(guest.name)}</span></h1>
          </div>
          
          <div className="max-w-md mx-auto">
            {guest.status !== 'Confirmed' ? (
              <div className="space-y-6">
                <p className="text-stone-500 italic text-lg leading-relaxed">
                  "Mummy and Papa would love to have you in Goa to celebrate their 50 golden years of journey together."
                </p>
                <button 
                  onClick={() => setIsRSVPMode(true)} 
                  className="gold-shimmer text-stone-900 px-16 py-8 rounded-full font-black uppercase text-sm tracking-[0.2em] shadow-[0_30px_60px_-15px_rgba(212,175,55,0.6)] flex items-center gap-4 mx-auto hover:scale-105 transition-all border-4 border-white"
                >
                  Accept Invitation & RSVP <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 text-green-600 px-12 py-6 rounded-full inline-flex flex-col items-center gap-2 font-black uppercase tracking-widest text-[11px] border-2 border-green-100 shadow-sm">
                   <div className="flex items-center gap-3">
                      <CheckCircle size={24} /> RSVP Status: Confirmed
                   </div>
                   <p className="text-[9px] text-green-500 opacity-70">See you on April 17th!</p>
                </div>
                <button 
                  onClick={() => setIsRSVPMode(true)}
                  className="block mx-auto text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-[#B8860B] transition-colors"
                >
                  <Edit3 size={12} className="inline mr-1" /> Update My Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Residence Section */}
      <section className="space-y-8 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-stone-900">Your Sanctuary</h2>
        {room ? (
          <div className="bg-white rounded-[4rem] overflow-hidden border border-stone-100 shadow-xl flex flex-col lg:flex-row group transition-all relative">
            <div className="lg:w-3/5 h-[450px] lg:h-[700px] overflow-hidden relative">
              <img src={room.image} className="w-full h-full object-cover" alt={room.title} />
              {isPlanner && (
                <button onClick={(e) => triggerUpload(e, 'room', room.roomNo)} className="absolute top-8 right-8 bg-[#D4AF37] text-stone-900 px-6 py-3 rounded-full shadow-2xl border-2 border-white z-[10000] flex items-center gap-2 font-black text-[10px] uppercase">
                  <Camera size={20} /> Edit Room View
                </button>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="lg:w-2/5 p-12 md:p-20 flex flex-col justify-center bg-[#FCFAF2] relative">
              <div className="absolute top-10 right-10 text-stone-100"><Bed size={80} /></div>
              <span className="text-[#B8860B] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Reserved For Your Family</span>
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-8 leading-tight">{room.title}</h3>
              <div className="bg-white p-8 rounded-[3rem] border border-[#D4AF37]/20 shadow-lg mb-12 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-stone-800 font-bold text-lg leading-snug mb-2">{locationInfo.name}</p>
                  <p className="text-stone-400 text-xs font-medium mb-6 uppercase tracking-wider">{locationInfo.address}</p>
                  <a 
                    href={locationInfo.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-3 bg-stone-900 text-[#D4AF37] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                  >
                    <Navigation size={16} /> Open in Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[4rem] border-2 border-dashed border-stone-200 text-center">
             <p className="text-stone-400 italic">Room assignment in progress. Please check back soon.</p>
          </div>
        )}
      </section>

      {/* Itinerary */}
      <section className="space-y-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-stone-900 text-center md:text-left">Your Celebration <span className="text-[#B8860B]">Timeline</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {itinerary.map((event) => (
            <div key={`${event.id}-${event.image}`} className="bg-white rounded-[4rem] p-12 border border-stone-100 shadow-2xl space-y-8 group transition-all relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 text-[#D4AF37]">
                   <Clock size={20} />
                   <span className="text-[12px] font-black uppercase tracking-[0.4em]">{event.time}</span>
                </div>
                {isPlanner && (
                  <button onClick={(e) => triggerUpload(e, 'event', event.id)} className="p-3 bg-stone-900 text-[#D4AF37] rounded-full shadow-lg z-[10000] flex items-center gap-2 px-5 py-2">
                    <Camera size={16} /> <span className="text-[9px] font-black uppercase">Edit Photo</span>
                  </button>
                )}
              </div>
              
              <div className="space-y-4 relative z-10">
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">{event.title}</h3>
                <div className="h-56 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-lg">
                   <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={event.title} />
                </div>
                <p className="text-stone-500 text-lg italic leading-relaxed pt-2">"{event.description}"</p>
              </div>

              <div className="pt-8 border-t border-stone-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#B8860B] mb-1">Dress Code</p>
                    <p className="text-sm font-bold text-stone-900 uppercase tracking-widest">{event.dressCode}</p>
                 </div>
                 <div className="bg-stone-50 px-6 py-3 rounded-2xl border border-stone-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">Venue</p>
                    <p className="text-[11px] font-black text-stone-800 uppercase tracking-widest">{event.location}</p>
                 </div>
              </div>
              
              {/* Decorative Number */}
              <div className="absolute -bottom-10 -right-10 text-[120px] font-serif font-black text-stone-50 pointer-events-none group-hover:text-[#D4AF37]/5 transition-colors">
                {event.id.split('-')[1]}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GuestPortal;