import React, { useState, useRef } from 'react';
import { Guest, RoomDetail, PropertyType } from '../types';
import { Users, CheckCircle2, Circle, Home, Building2, Hotel, TreePine, Camera, Plus, Trash2, X, Edit3 } from 'lucide-react';

interface RoomMapProps {
  guests: Guest[];
  rooms: RoomDetail[];
  onUpdateImage: (roomNo: string, property: string, base64: string) => void;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingUploadRoom) {
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
    e.preventDefault();
    setPendingUploadRoom(room);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 10);
  };

  const getOccupancyInfo = (room: RoomDetail) => {
    const assignedGuests = guests.filter(g => g.roomNo === room.roomNo && g.property === room.property && g.status === 'Confirmed');
    
    let adultCount = 0;
    let kidCount = 0;
    
    assignedGuests.forEach(g => {
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
    if (confirm(`Are you sure you want to remove Room ${room.roomNo} from ${room.property}?`)) {
      onDeleteRoom(room.roomNo, room.property as PropertyType);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="px-1">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">Property <br/><span className="text-[#B8860B]">Occupancy</span></h2>
          <p className="text-stone-500 italic text-sm md:text-lg mt-2">Allocating {rooms.length} Heritage Rooms. (Kids &lt; 11 stay with parents).</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200 overflow-x-auto max-w-full no-scrollbar">
            {(['All', 'Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] as const).map((prop) => (
              <button
                key={prop}
                onClick={() => setFilter(prop)}
                className={`px-4 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === prop ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {prop.replace('-', ' ')}
              </button>
            ))}
          </div>
          {isPlanner && (
            <button 
              onClick={() => setShowAddRoom(true)}
              className="bg-[#D4AF37] text-stone-900 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
            >
              <Plus size={16} /> Add Suite
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
        {filteredRooms.map((room) => {
          const { adultCount, kidCount, isFull } = getOccupancyInfo(room);
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
                  <Icon size={12} className="text-amber-500" /> {room.property} #{room.roomNo}
                </div>
                {isPlanner && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button 
                      onClick={(e) => triggerUpload(e, room)}
                      className="bg-white text-stone-900 px-4 py-2 rounded-full border border-stone-100 shadow-lg flex items-center gap-2 font-black text-[9px] uppercase tracking-widest hover:scale-110 transition-all"
                    >
                      <Camera size={12} /> Photo
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, room)}
                      className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-3 group-hover:text-[#B8860B] transition-colors">{room.title}</h3>
                <div className="mt-auto flex items-center justify-between border-t border-stone-50 pt-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-stone-400">
                      <Users size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{adultCount} / 2 Adults {kidCount > 0 ? `+ ${kidCount} Kids` : ''}</span>
                    </div>
                  </div>
                  {isFull ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-stone-100" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-stone-900/90 z-[600] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 border-4 border-[#D4AF37] animate-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-serif font-bold text-stone-900">Add New Inventory</h3>
                 <button onClick={() => setShowAddRoom(false)}><X size={24} className="text-stone-400" /></button>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest mb-2 block">Property Location</label>
                    <select 
                      className="w-full bg-stone-50 border p-4 rounded-2xl text-[10px] font-black uppercase"
                      value={newRoomData.property}
                      onChange={(e) => setNewRoomData({...newRoomData, property: e.target.value as PropertyType})}
                    >
                       <option value="Villa-Pool">Villa Poolside</option>
                       <option value="Villa-Hall">Villa Red Hall</option>
                       <option value="Resort">Marinha Dourada</option>
                       <option value="TreeHouse">Garden Treehouse</option>
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest mb-2 block">Room Number</label>
                       <input 
                         type="text" 
                         placeholder="e.g. 106"
                         className="w-full bg-stone-50 border p-4 rounded-2xl text-xs font-bold"
                         value={newRoomData.roomNo}
                         onChange={(e) => setNewRoomData({...newRoomData, roomNo: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest mb-2 block">Room Type</label>
                       <select 
                         className="w-full bg-stone-50 border p-4 rounded-2xl text-[10px] font-black uppercase"
                         value={newRoomData.type}
                         onChange={(e) => setNewRoomData({...newRoomData, type: e.target.value as any})}
                       >
                          <option value="Master">Master Suite</option>
                          <option value="Standard">Standard</option>
                          <option value="Twin">Twin Bed</option>
                          <option value="Suite">Junior Suite</option>
                       </select>
                    </div>
                 </div>
                 <div>
                    <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest mb-2 block">Room Name / Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Garden View Suite"
                      className="w-full bg-stone-50 border p-4 rounded-2xl text-xs font-bold"
                      value={newRoomData.title}
                      onChange={(e) => setNewRoomData({...newRoomData, title: e.target.value})}
                    />
                 </div>
                 <button 
                   onClick={handleCreateRoom}
                   className="w-full bg-stone-900 text-white py-5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all mt-4"
                 >
                   Confirm New Suite
                 </button>
              </div>
           </div>
        </div>
      )}

      {selectedRoom && (
        <div className="fixed inset-0 bg-stone-900/98 z-[500] flex items-center justify-center p-4 md:p-10" onClick={() => setSelectedRoom(null)}>
          <div className="bg-white rounded-[3rem] md:rounded-[5rem] max-w-5xl w-full overflow-hidden flex flex-col lg:flex-row animate-in zoom-in duration-500 border-8 border-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="lg:w-1/2 h-64 lg:h-auto relative">
              <img src={selectedRoom.image} className="w-full h-full object-cover" alt={selectedRoom.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>
              {isPlanner && (
                <button 
                  onClick={(e) => triggerUpload(e, selectedRoom)}
                  className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md text-stone-900 px-6 py-3 rounded-full flex items-center gap-2 font-black text-[10px] uppercase shadow-2xl"
                >
                  <Camera size={16} /> Update Photo
                </button>
              )}
            </div>
            <div className="lg:w-2/5 p-10 md:p-20 flex flex-col justify-center overflow-y-auto">
              <span className="text-[#B8860B] font-black text-[10px] uppercase tracking-[0.5em] mb-4">Detailed View</span>
              
              {isPlanner ? (
                <input 
                  type="text"
                  value={selectedRoom.title}
                  onChange={(e) => onUpdateRoom(selectedRoom.roomNo, selectedRoom.property as PropertyType, { title: e.target.value })}
                  className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4 bg-stone-50 p-2 rounded-xl w-full border-b-2 border-[#D4AF37]"
                />
              ) : (
                <h3 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-8 leading-tight">{selectedRoom.title}</h3>
              )}

              {isPlanner && (
                <textarea 
                  value={selectedRoom.description}
                  onChange={(e) => onUpdateRoom(selectedRoom.roomNo, selectedRoom.property as PropertyType, { description: e.target.value })}
                  className="text-stone-500 italic text-sm mb-8 bg-stone-50 p-4 rounded-xl w-full border border-stone-100"
                  rows={3}
                />
              )}

              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Honored Residents</h4>
                  <div className="space-y-3">
                    {guests.filter(g => g.roomNo === selectedRoom.roomNo && g.property === selectedRoom.property).map(g => (
                      <div key={g.id} className="flex flex-col p-5 bg-stone-50 rounded-2xl border border-stone-100 font-black text-stone-900 uppercase tracking-widest text-xs">
                        <div className="flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                           {g.name}
                        </div>
                        {g.familyMembers && g.familyMembers.length > 0 && (
                          <div className="mt-3 ml-6 flex flex-wrap gap-2">
                             {g.familyMembers.map((fm, idx) => (
                               <span key={idx} className={`px-2 py-1 rounded-md text-[8px] border ${fm.age < 11 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-stone-200 text-stone-500'}`}>
                                 {fm.name} ({fm.age < 11 ? 'KID' : 'ADULT'})
                               </span>
                             ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {guests.filter(g => g.roomNo === selectedRoom.roomNo && g.property === selectedRoom.property).length === 0 && (
                      <p className="text-sm text-stone-300 italic">No guests assigned to this room.</p>
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
