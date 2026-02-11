import React, { useState, useRef } from 'react';
import { Guest, RoomDetail, EventFunction } from '../types';
import { PROPERTY_LOCATIONS } from '../constants';
import { 
  Calendar, MapPin, Shirt, Bed, Info, Clock, Heart,
  ArrowRight, X, CheckCircle, MailOpen, UserCheck, Users, Navigation, Camera
} from 'lucide-react';
import RSVPForm from './RSVPForm';

interface GuestPortalProps {
  guest: Guest;
  roomDatabase: RoomDetail[];
  itinerary: EventFunction[];
  onUpdate?: (id: string, updates: Partial<Guest>) => void;
  onUpdateEventImage?: (eventId: string, base64: string) => void;
  onUpdateRoomImage?: (roomNo: string, property: string, base64: string) => void;
}

const GuestPortal: React.FC<GuestPortalProps> = ({ guest, onUpdate, roomDatabase, itinerary, onUpdateEventImage, onUpdateRoomImage }) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
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
        if (uploadTarget.type === 'event' && onUpdateEventImage) onUpdateEventImage(uploadTarget.id, reader.result as string);
        if (uploadTarget.type === 'room' && onUpdateRoomImage && room) onUpdateRoomImage(room.roomNo, room.property, reader.result as string);
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

  if (isRSVPMode && onUpdate) {
    return (
      <RSVPForm guest={guest} onSubmit={(u) => { onUpdate(guest.id, { ...u, status: 'Confirmed' }); setIsRSVPMode(false); }} onGoToDashboard={() => setIsRSVPMode(false)} onExitSimulation={() => setIsRSVPMode(false)} />
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700 min-h-screen">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
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
        </div>
      </div>

      {/* Residence Section */}
      <section className="space-y-8 px-4">
        <h2 className="text-3xl font-serif font-bold text-stone-900">Your Goan Residence</h2>
        {room && (
          <div className="bg-white rounded-[4rem] overflow-hidden border border-stone-100 shadow-xl flex flex-col lg:flex-row group transition-all relative">
            <div className="lg:w-3/5 h-[400px] lg:h-[600px] overflow-hidden relative">
              <img src={room.image} className="w-full h-full object-cover" alt={room.title} />
              {onUpdateRoomImage && (
                <button onClick={(e) => triggerUpload(e, 'room', room.roomNo)} className="absolute top-8 right-8 bg-[#D4AF37] text-stone-900 p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all">
                  <Camera size={24} />
                </button>
              )}
            </div>
            <div className="lg:w-2/5 p-12 md:p-16 flex flex-col justify-center bg-[#FCFAF2]">
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">{room.title}</h3>
              <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/20 shadow-sm mb-10">
                <p className="text-stone-800 font-bold text-sm leading-snug">{locationInfo.name}<br/>{locationInfo.address}</p>
                <a href={locationInfo.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#D4AF37] text-stone-900 px-6 py-3 rounded-xl text-[10px] font-black mt-4 shadow-md"><Navigation size={14} /> Maps</a>
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
                {onUpdateEventImage && (
                  <button onClick={(e) => triggerUpload(e, 'event', event.id)} className="p-3 bg-stone-50 rounded-full text-stone-400 hover:text-[#D4AF37] transition-all">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <h3 className="text-3xl font-serif font-bold text-stone-900">{event.title}</h3>
              <div className="h-40 rounded-3xl overflow-hidden border border-stone-50"><img src={event.image} className="w-full h-full object-cover" alt={event.title} /></div>
              <p className="text-stone-500 text-lg italic leading-relaxed">"{event.description}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GuestPortal;