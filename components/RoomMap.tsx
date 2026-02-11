import React, { useState, useRef } from 'react';
import { Guest, RoomDetail, PropertyType } from '../types';
import { Users, Bed, CheckCircle2, Circle, Home, Building2, Hotel, TreePine, Camera, Edit3 } from 'lucide-react';

interface RoomMapProps {
  guests: Guest[];
  rooms: RoomDetail[];
  onUpdateImage?: (roomNo: string, property: string, base64: string) => void;
}

const RoomMap: React.FC<RoomMapProps> = ({ guests, rooms, onUpdateImage }) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const [filter, setFilter] = useState<PropertyType | 'All'>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploadRoom, setPendingUploadRoom] = useState<RoomDetail | null>(null);

  const propertyIcons = {
    'Villa-Pool': Home,
    'Villa-Hall': Building2,
    'Resort': Hotel,
    'TreeHouse': TreePine
  };

  const filteredRooms = filter === 'All' 
    ? rooms 
    : rooms.filter(r => r.property === filter);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingUploadRoom && onUpdateImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateImage(pendingUploadRoom.roomNo, pendingUploadRoom.property, reader.result as string);
        setPendingUploadRoom(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (e: React.MouseEvent, room: RoomDetail) => {
    e.stopPropagation();
    setPendingUploadRoom(room);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-900">Property Occupancy</h2>
          <p className="text-stone-500 italic text-lg">Managing 2 Villas, Resort, and TreeHouse bookings.</p>
        </div>
        <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200 overflow-x-auto max-w-full">
          {(['All', 'Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] as const).map((prop) => (
            <button
              key={prop}
              onClick={() => setFilter(prop)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === prop ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              {prop.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredRooms.map((room) => {
          const occupants = guests.filter(g => g.roomNo === room.roomNo && g.property === room.property);
          const isFull = occupants.length >= 2;
          const Icon = propertyIcons[room.property];
          
          return (
            <div 
              key={`${room.property}-${room.roomNo}`} 
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full relative"
              onClick={() => setSelectedRoom(room)}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={room.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={room.title} />
                <div className="absolute top-4 left-4 bg-stone-900/90 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2">
                  <Icon size={12} className="text-amber-500" /> {room.property} #{room.roomNo}
                </div>
                {onUpdateImage && (
                  <button 
                    onClick={(e) => triggerUpload(e, room)}
                    className="absolute bottom-4 right-4 bg-white text-stone-900 px-3 py-2 rounded-full border-2 border-[#D4AF37] shadow-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    <Camera size={14} className="text-[#D4AF37]" /> Edit
                  </button>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">{room.title}</h3>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Users size={14} />
                    <span className="text-xs font-medium">{occupants.length} / 2 Guests</span>
                  </div>
                  {isFull ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-stone-200" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-stone-900/95 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRoom(null)}>
          <div className="bg-white rounded-[2.5rem] max-w-4xl w-full overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 h-64 md:h-auto">
              <img src={selectedRoom.image} className="w-full h-full object-cover" alt={selectedRoom.title} />
            </div>
            <div className="md:w-1/2 p-12">
              <h3 className="text-4xl font-serif font-bold text-stone-900 mb-6">{selectedRoom.title}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Assigned Guests</h4>
                  <div className="space-y-2">
                    {guests.filter(g => g.roomNo === selectedRoom.roomNo && g.property === selectedRoom.property).map(g => (
                      <div key={g.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100 font-bold text-stone-900">
                        {g.name}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setSelectedRoom(null)} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase text-xs tracking-widest">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomMap;