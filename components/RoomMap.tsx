
import React, { useState, useRef } from 'react';
import { Guest, RoomDetail, PropertyType } from '../types';
import { Users, CheckCircle2, Circle, Home, Building2, Hotel, TreePine, Camera, Plus, Trash2, X, Edit3 } from 'lucide-react';

interface RoomMapProps {
  guests: Guest[];
  rooms: RoomDetail[];
  onUpdateImage: (roomNo: string, property: string, file: File) => void;
  onAddRoom: (room: RoomDetail) => void;
  onUpdateRoom: (roomNo: string, property: PropertyType, updates: Partial<RoomDetail>) => void;
  onDeleteRoom: (roomNo: string, property: PropertyType) => void;
  isPlanner: boolean;
}

const RoomMap: React.FC<RoomMapProps> = ({ guests, rooms, onUpdateImage, onAddRoom, onUpdateRoom, onDeleteRoom, isPlanner }) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const [filter, setFilter] = useState<PropertyType | 'All'>('All');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomData, setNewRoomData] = useState<Partial<RoomDetail>>({ property: 'Villa-Pool', title: '', roomNo: '', type: 'Standard' });
  
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

  // CRITICAL: Master Replication Logic - Look up actual guest objects to get updated names
  const getAssignedGuests = (roomNo: string, property: string) => {
    return guests.filter(g => g.roomNo === roomNo && g.property === property && g.status === 'Confirmed');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingUploadRoom) {
      onUpdateImage(pendingUploadRoom.roomNo, pendingUploadRoom.property, file);
      setPendingUploadRoom(null);
    }
  };

  const triggerUpload = (e: React.MouseEvent, room: RoomDetail) => {
    e.stopPropagation();
    setPendingUploadRoom(room);
    fileInputRef.current?.click();
  };

  const getOccupancyInfo = (room: RoomDetail) => {
    const assigned = getAssignedGuests(room.roomNo, room.property);
    let adultCount = 0;
    let kidCount = 0;
    assigned.forEach(g => {
      adultCount += 1; 
      g.familyMembers?.forEach(f => {
        if (f.age < 11) kidCount += 1;
        else adultCount += 1;
      });
    });
    return { adultCount, kidCount, total: adultCount + kidCount, isFull: adultCount >= 2 };
  };

  const handleCreateRoom = () => {
    if (newRoomData.roomNo && newRoomData.title) {
      const room: RoomDetail = {
        roomNo: newRoomData.roomNo,
        property: (newRoomData.property || 'Villa-Pool') as PropertyType,
        title: newRoomData.title,
        description: newRoomData.description || 'A freshly added suite for the anniversary celebration.',
        image: 'https://images.unsplash.com/photo-1628592102751-ba83b03bc42e?auto=format&fit=crop&q=80',
        type: (newRoomData.type || 'Standard') as RoomDetail['type'],
        amenities: ['AC', 'En-suite Bath']
      };
      onAddRoom(room);
      setShowAddRoom(false);
      setNewRoomData({ property: 'Villa-Pool', title: '', roomNo: '', type: 'Standard' });
    }
  };

  const handleDelete = (e: React.MouseEvent, room: RoomDetail) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove Room ${room.roomNo}?`)) {
      onDeleteRoom(room.roomNo, room.property as PropertyType);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="px-1">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">Master <span className="text-[#B8860B]">Rooms</span></h2>
          <p className="text-stone-500 italic text-sm md:text-lg mt-2 font-bold uppercase tracking-widest">Linked to Master Guest List</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            {(['All', 'Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] as const).map((prop) => (
              <button
                key={prop}
                onClick={() => setFilter(prop)}
                className={`px-4 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === prop ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {prop.replace('-', ' ')}
              </button>
            ))}
          </div>
          {isPlanner && (
            <button onClick={() => setShowAddRoom(true)} className="bg-[#D4AF37] text-stone-900 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl">
              <Plus size={16} /> Add Suite
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredRooms.map((room) => {
          const { adultCount, isFull } = getOccupancyInfo(room);
          const Icon = propertyIcons[room.property];
          return (
            <div 
              key={`${room.property}-${room.roomNo}`} 
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full relative"
              onClick={() => setSelectedRoom(room)}
            >
              <div className="relative h-56 overflow-hidden bg-stone-50">
                <img src={room.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={room.title} />
                <div className="absolute top-4 left-4 bg-stone-900/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 z-10 border border-white/10">
                  <Icon size={12} className="text-amber-500" /> #{room.roomNo}
                </div>
                {isPlanner && (
                  <button onClick={(e) => triggerUpload(e, room)} className="absolute bottom-4 right-4 bg-white text-stone-900 px-4 py-2 rounded-full border border-stone-100 shadow-lg flex items-center gap-2 font-black text-[9px] uppercase tracking-widest hover:scale-110 transition-all z-20">
                    <Camera size={12} /> Cloud Upload
                  </button>
                )}
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-3 group-hover:text-[#B8860B] transition-colors">{room.title}</h3>
                <div className="mt-auto flex items-center justify-between border-t border-stone-50 pt-5">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Users size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{adultCount} / 2 Adults</span>
                  </div>
                  {isFull ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-stone-100" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-stone-900/98 z-[500] flex items-center justify-center p-4 md:p-10" onClick={() => setSelectedRoom(null)}>
          <div className="bg-white rounded-[3rem] md:rounded-[5rem] max-w-5xl w-full overflow-hidden flex flex-col lg:flex-row animate-in zoom-in duration-500 border-8 border-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="lg:w-1/2 h-64 lg:h-auto relative">
              <img src={selectedRoom.image} className="w-full h-full object-cover" alt={selectedRoom.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>
            </div>
            <div className="lg:w-2/5 p-10 md:p-20 flex flex-col justify-center">
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-8 leading-tight">{selectedRoom.title}</h3>
              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Master Entry Replication</h4>
                  <div className="space-y-3">
                    {getAssignedGuests(selectedRoom.roomNo, selectedRoom.property).map(g => (
                      <div key={g.id} className="flex flex-col p-5 bg-stone-50 rounded-2xl border border-stone-100 font-black text-stone-900 uppercase tracking-widest text-xs">
                        <div className="flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                           {g.name}
                        </div>
                      </div>
                    ))}
                    {getAssignedGuests(selectedRoom.roomNo, selectedRoom.property).length === 0 && (
                      <p className="text-sm text-stone-300 italic">No guests assigned yet.</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelectedRoom(null)} className="w-full py-6 bg-stone-900 text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-stone-800 transition-all">Close Suite View</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomMap;
