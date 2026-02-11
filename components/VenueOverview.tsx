import React, { useRef, useState } from 'react';
import { MapPin, Building2, Hotel, Maximize, TreePine, Navigation, Camera, Edit2 } from 'lucide-react';
import { PROPERTY_LOCATIONS } from '../constants';
import { RoomDetail } from '../types';

interface VenueOverviewProps {
  onUpdateRoomImage: (roomNo: string, property: string, base64: string) => void;
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
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateRoomImage(uploadTarget.roomNo, uploadTarget.property, reader.result as string);
        setUploadTarget(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (roomNo: string, property: string) => {
    setUploadTarget({ roomNo, property });
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      {/* Property 1: Poolside Villa */}
      <section className="space-y-6 relative">
        <div className="relative h-[300px] md:h-[550px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-stone-100">
          <img src={getRoomImg("101", "Villa-Pool", "https://images.unsplash.com/photo-1628592102751-ba83b03bc42e?auto=format&fit=crop&q=80")} className="w-full h-full object-cover" alt="Villa A" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/10 to-transparent flex items-end p-6 md:p-16 pointer-events-none">
            <div className="max-w-2xl">
              <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">Estate Hub</span>
              <h2 className="text-3xl md:text-6xl font-serif font-bold text-white mb-2 leading-tight text-shadow-lg">Villa A: Poolside</h2>
              <div className="flex items-center gap-3 text-stone-300">
                <MapPin size={16} className="text-amber-500" />
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{PROPERTY_LOCATIONS.FAMILY_ESTATE.name}</span>
              </div>
            </div>
          </div>
          {isPlanner && (
            <button 
              onClick={() => triggerUpload("101", "Villa-Pool")} 
              className="absolute top-8 right-8 bg-white text-stone-900 px-6 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-3 font-black text-[11px] uppercase tracking-widest border-4 border-[#D4AF37] hover:scale-110 active:scale-95 transition-all z-[10000]"
            >
              <Camera size={20} className="text-[#D4AF37]" /> Change Main Image
            </button>
          )}
        </div>
      </section>

      {/* Property 2: Red Hall Villa */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
        <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl min-h-[400px] border-4 border-white bg-stone-100">
          <img src={getRoomImg("201", "Villa-Hall", "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80")} className="w-full h-full object-cover" alt="Villa B" />
          {isPlanner && (
            <button 
              onClick={() => triggerUpload("201", "Villa-Hall")} 
              className="absolute top-6 right-6 bg-white text-stone-900 px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border-2 border-[#D4AF37] hover:scale-105 transition-all z-[10000]"
            >
              <Edit2 size={16} className="text-[#D4AF37]" /> Update View
            </button>
          )}
        </div>
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-stone-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <Maximize className="text-red-600" size={32} />
            <h3 className="text-xl md:text-3xl font-serif font-bold text-stone-900">Grand Indoor Hall</h3>
          </div>
          <p className="text-stone-600 text-sm md:text-lg mb-6 leading-relaxed">Heritage Red House designation for indoor gatherings.</p>
          <div className="grid grid-cols-1 gap-3">
            {['Indoor Chill Zones', 'Heritage Balconies', '5 Luxury Suites'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs font-bold text-stone-800 uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property 4: Marinha Dourada */}
      <section className="bg-stone-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl group">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Hotel className="text-amber-500" size={32} />
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight">{PROPERTY_LOCATIONS.RESORT.name}</h3>
          </div>
          <p className="text-stone-400 text-base md:text-xl mb-8 font-light leading-relaxed">
            Located in Arpora, hosting the AC Ballroom for our grand finale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-8 bg-stone-800/50 rounded-[2rem] border border-stone-700">
              <h4 className="text-lg font-bold mb-2 text-amber-500">Ballroom</h4>
              <p className="text-stone-400 text-xs uppercase font-black tracking-widest">Gala Event Hub</p>
            </div>
          </div>
        </div>
        {isPlanner && (
          <button 
            onClick={() => triggerUpload("301", "Resort")} 
            className="absolute bottom-8 right-8 bg-[#D4AF37] text-stone-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-[11px] uppercase tracking-widest border-2 border-white z-[10000]"
          >
            <Camera size={20} /> Update Resort Photo
          </button>
        )}
      </section>
    </div>
  );
};

export default VenueOverview;