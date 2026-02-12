
import React, { useRef, useState } from 'react';
import { MapPin, Building2, Hotel, Maximize, TreePine, Navigation, Camera, Edit2 } from 'lucide-react';
import { PROPERTY_LOCATIONS } from '../constants';
import { RoomDetail } from '../types';

interface VenueOverviewProps {
  onUpdateRoomImage: (roomNo: string, property: string, file: File) => void;
  rooms: RoomDetail[];
  isPlanner: boolean;
}

const VenueOverview: React.FC<VenueOverviewProps> = ({ onUpdateRoomImage, rooms, isPlanner }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{roomNo: string, property: string} | null>(null);

  const getRoomImg = (roomNo: string, property: string, fallback: string) => {
    return rooms.find(r => r.roomNo === roomNo && r.property === property)?.image || fallback;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      onUpdateRoomImage(uploadTarget.roomNo, uploadTarget.property, file);
      setUploadTarget(null);
    }
  };

  const triggerUpload = (roomNo: string, property: string) => {
    setUploadTarget({ roomNo, property });
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      <section className="space-y-6 relative">
        <div className="relative h-[300px] md:h-[550px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-stone-100">
          <img src={getRoomImg("101", "Villa-Pool", "https://images.unsplash.com/photo-1628592102751-ba83b03bc42e?auto=format&fit=crop&q=80")} className="w-full h-full object-cover" alt="Villa A" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/10 to-transparent flex items-end p-6 md:p-16 pointer-events-none">
            <div className="max-w-2xl">
              <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">Heritage Hub</span>
              <h2 className="text-3xl md:text-6xl font-serif font-bold text-white mb-2 leading-tight">Villa Poolside</h2>
              <div className="flex items-center gap-3 text-stone-300">
                <MapPin size={16} className="text-amber-500" />
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{PROPERTY_LOCATIONS.FAMILY_ESTATE.name}</span>
              </div>
            </div>
          </div>
          {isPlanner && (
            <button 
              onClick={() => triggerUpload("101", "Villa-Pool")} 
              className="absolute top-8 right-8 bg-white text-stone-900 px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-[11px] uppercase tracking-widest border-4 border-[#D4AF37] hover:scale-110 active:scale-95 transition-all z-20"
            >
              <Camera size={20} className="text-[#D4AF37]" /> Upload to Cloud
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default VenueOverview;
