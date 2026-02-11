import React, { useState, useRef } from 'react';
import { Guest, RoomDetail, EventFunction } from '../types';
import { PROPERTY_LOCATIONS } from '../constants';
import { 
  Calendar, MapPin, Shirt, Bed, Info, Clock, Heart,
  ArrowRight, X, CheckCircle, MailOpen, UserCheck, Users, Navigation, Camera, ShieldAlert, EyeOff
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
      <RSVPForm guest={guest} onSubmit={(u) => { onUpdate(guest.id, { ...u, status: 'Confirmed' }); setIsRSVPMode(false); }} onGoToDashboard={() => setIsRSVPMode(false)} onExitSimulation={() => setIsRSVPMode(false)} />
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700 min-h-screen">
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
      <div className="relative rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl bg-white border-[12px] border-white min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.15] gold-shimmer glitter-overlay"></div>
        <div className="relative z-10 p-12 text-center space-y-10 w-full">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto border-2 border-[#D4AF37] gold-shimmer"><Heart size={44} fill="currentColor" className="text-[#B8860B]" /></div>
          <h1 className="text-4xl md:text-8xl font-serif font-bold text-stone-900 leading-tight">Pranam, <span className="gold-text-gradient">{guest.name.split(' ')[0]}</span></h1>
          {guest.status !== 'Confirmed' && (
            <button onClick={() => setIsRSVPMode(true)} className="gold-shimmer text-stone-900 px-12 py-6 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl flex items-center gap-4 mx-auto">
              Fill Family Details <ArrowRight size={20} />
            </button>
          )}
          {guest.status === 'Confirmed' && (
            <div className="bg-green-50 text-green-600 px-10 py-5 rounded-full inline-flex items-center gap-3 font-black uppercase tracking-widest text-[11px] border border-green-100">
               <CheckCircle size={20} /> RSVP Confirmed
            </div>
          )}
        </div>
      </div>

      {/* Residence Section */}
      <section className="space-y-8 px-4">
        <h2 className="text-3xl font-serif font-bold text-stone-900">Your Goan Residence</h2>
        {room && (
          <div className="bg-white rounded-[4rem] overflow-hidden border border-stone-100 shadow-xl flex flex-col lg:flex-row group transition-all relative">
            <div className="lg:w-3/5 h-[400px] lg:h-[600px] overflow-hidden relative">
              <img src={room.image} className="w-full h-full object-cover" alt={room.title} />
              {isPlanner && (
                <button onClick={(e) => triggerUpload(e, 'room', room.roomNo)} className="absolute top-8 right-8 bg-[#D4AF37] text-stone-900 px-6 py-3 rounded-full shadow-2xl border-2 border-white z-[10000] flex items-center gap-2 font-black text-[10px] uppercase">
                  <Camera size={20} /> Edit Room View
                </button>
              )}
            </div>
            <div className="lg:w-2/5 p-12 md:p-16 flex flex-col justify-center bg-[#FCFAF2]">
              <span className="text-[#B8860B] font-black text-[10px] uppercase tracking-[0.4em] mb-4">Confirmed Suite</span>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">{room.title}</h3>
              <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/20 shadow-sm mb-10">
                <p className="text-stone-800 font-bold text-sm leading-snug">{locationInfo.name}<br/>{locationInfo.address}</p>
                <a href={locationInfo.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#D4AF37] text-stone-900 px-6 py-3 rounded-xl text-[10px] font-black mt-4 shadow-md"><Navigation size={14} /> View Map</a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Itinerary */}
      <section className="space-y-10 px-4">
        <h2 className="text-3xl font-serif font-bold text-stone-900">Personal Itinerary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {itinerary.map((event) => (
            <div key={event.id} className="bg-white rounded-[3.5rem] p-12 border border-stone-100 shadow-xl space-y-8 group transition-all relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#D4AF37]"><Clock size={20} /><span className="text-[12px] font-black uppercase tracking-[0.4em]">{event.time}</span></div>
                {isPlanner && (
                  <button onClick={(e) => triggerUpload(e, 'event', event.id)} className="p-3 bg-stone-900 text-[#D4AF37] rounded-full shadow-lg z-[10000] flex items-center gap-2 px-5 py-2">
                    <Camera size={16} /> <span className="text-[9px] font-black uppercase">Edit Photo</span>
                  </button>
                )}
              </div>
              <h3 className="text-3xl font-serif font-bold text-stone-900">{event.title}</h3>
              <div className="h-40 rounded-3xl overflow-hidden border border-stone-50"><img src={event.image} className="w-full h-full object-cover" alt={event.title} /></div>
              <p className="text-stone-500 text-lg italic leading-relaxed">"{event.description}"</p>
              <div className="pt-6 border-t border-stone-50">
                 <p className="text-[9px] font-black uppercase tracking-widest text-[#B8860B] mb-1">Location & Dress Code</p>
                 <p className="text-sm font-bold text-stone-900">{event.location} • {event.dressCode}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GuestPortal;