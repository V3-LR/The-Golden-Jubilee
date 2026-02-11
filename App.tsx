import React, { useState, useCallback, useEffect, useTransition, useDeferredValue } from 'react';
import { Guest, AppTab, Budget, UserRole, EventFunction, RoomDetail } from './types';
import { INITIAL_GUESTS, INITIAL_BUDGET, EVENT_CONFIG, ITINERARY as STATIC_ITINERARY, ROOM_DATABASE as STATIC_ROOMS } from './constants';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';
import TreeView from './components/TreeView';
import BudgetTracker from './components/BudgetTracker';
import AIPlanner from './components/AIPlanner';
import VenueOverview from './components/VenueOverview';
import RoomMap from './components/RoomMap';
import Login from './components/Login';
import RSVPManager from './components/RSVPManager';
import GuestPortal from './components/GuestPortal';
import { Menu, ShieldCheck, UserPlus, EyeOff, CheckCircle, RefreshCw, Camera, Download, AlertTriangle, Hammer } from 'lucide-react';

const STABLE_KEY = 'ESTATE_PLANNER_STABLE_V6';
const MEDIA_KEY_ROOMS = 'ESTATE_PLANNER_ROOMS_V6';
const MEDIA_KEY_EVENTS = 'ESTATE_PLANNER_EVENTS_V6';
const SESSION_KEY = 'ESTATE_PLANNER_SESSION_V6';

/**
 * Ultra-Aggressive Image Compression
 * Downscales to 600px and 0.5 quality to ensure we NEVER hit the 5MB quota
 */
const compressImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 600; 
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }
      resolve(canvas.toDataURL('image/jpeg', 0.5)); 
    };
    img.onerror = () => resolve(base64Str);
  });
};

const App: React.FC = () => {
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem(STABLE_KEY);
    try { return saved ? JSON.parse(saved) : INITIAL_GUESTS; } catch (e) { return INITIAL_GUESTS; }
  });

  const [rooms, setRooms] = useState<RoomDetail[]>(() => {
    const saved = localStorage.getItem(MEDIA_KEY_ROOMS);
    try { return saved ? JSON.parse(saved) : STATIC_ROOMS; } catch (e) { return STATIC_ROOMS; }
  });

  const [itinerary, setItinerary] = useState<EventFunction[]>(() => {
    const saved = localStorage.getItem(MEDIA_KEY_EVENTS);
    try { return saved ? JSON.parse(saved) : STATIC_ITINERARY; } catch (e) { return STATIC_ITINERARY; }
  });

  const deferredGuests = useDeferredValue(guests);

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    try { return saved ? JSON.parse(saved).role : null; } catch (e) { return null; }
  });

  const [activeGuestId, setActiveGuestId] = useState<string | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    try { return saved ? JSON.parse(saved).guestId : null; } catch (e) { return null; }
  });

  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    try { return saved ? JSON.parse(saved).lastTab || 'master' : 'master'; } catch (e) { return 'master'; }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [budget, setBudget] = useState<Budget>(INITIAL_BUDGET);

  const isPlanner = userRole === 'planner';

  // Safe Save Wrapper
  const safeSave = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      setError("Browser storage is full! Please use fewer/smaller custom images.");
      console.error("Storage error:", e);
    }
  };

  useEffect(() => {
    if (userRole) {
      safeSave(SESSION_KEY, { role: userRole, guestId: activeGuestId, lastTab: activeTab });
    }
  }, [userRole, activeGuestId, activeTab]);

  useEffect(() => { safeSave(STABLE_KEY, guests); }, [guests]);
  useEffect(() => { safeSave(MEDIA_KEY_ROOMS, rooms); }, [rooms]);
  useEffect(() => { safeSave(MEDIA_KEY_EVENTS, itinerary); }, [itinerary]);

  const handleUpdateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }, []);

  const handleUpdateRoomImage = async (roomNo: string, property: string, newImage: string) => {
    setIsSyncing(true);
    const optimized = await compressImage(newImage);
    setRooms(prev => prev.map(r => (r.roomNo === roomNo && r.property === property) ? { ...r, image: optimized } : r));
    setSaveIndicator(true);
    setTimeout(() => { setIsSyncing(false); setSaveIndicator(false); }, 800);
  };

  const handleUpdateEventImage = async (eventId: string, newImage: string) => {
    setIsSyncing(true);
    const optimized = await compressImage(newImage);
    setItinerary(prev => prev.map(e => e.id === eventId ? { ...e, image: optimized } : e));
    setSaveIndicator(true);
    setTimeout(() => { setIsSyncing(false); setSaveIndicator(false); }, 800);
  };

  const handleTabChange = useCallback((tab: AppTab) => {
    setIsSidebarOpen(false);
    startTransition(() => { setActiveTab(tab); });
  }, []);

  const handleTeleport = (guestId: string) => {
    setActiveGuestId(guestId);
    handleTabChange('portal');
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!userRole) {
    return <Login onLogin={(role, guestId) => {
      setUserRole(role);
      if (guestId) { setActiveGuestId(guestId); handleTabChange('portal'); } 
      else { handleTabChange('master'); }
    }} />;
  }

  const renderContent = () => {
    const currentGuest = deferredGuests.find(g => g.id === activeGuestId) || deferredGuests[0]; 

    if (activeTab === 'portal') {
      return (
        <div className="space-y-4">
          {isPlanner && (
            <div className="bg-stone-900 text-white p-5 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between border-2 border-[#D4AF37] shadow-2xl mb-10 gap-4">
              <div className="flex items-center gap-4">
                <ShieldCheck className="text-[#D4AF37]" size={24} />
                <p className="text-sm font-bold">Previewing as: <span className="text-[#D4AF37]">{currentGuest.name}</span></p>
              </div>
              <button onClick={() => handleTabChange('master')} className="bg-[#D4AF37] text-stone-900 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <EyeOff size={16} /> Exit Preview
              </button>
            </div>
          )}
          <GuestPortal 
            guest={currentGuest} 
            onUpdate={handleUpdateGuest} 
            roomDatabase={rooms}
            itinerary={itinerary}
            isPlanner={isPlanner}
            onUpdateEventImage={handleUpdateEventImage}
            onUpdateRoomImage={handleUpdateRoomImage}
          />
        </div>
      );
    }
    
    if (activeTab === 'master') {
      return (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
            <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">Master List</h2>
            {isPlanner && (
              <button onClick={() => setGuests(p => [{ id: `g-${Date.now()}`, name: 'New Guest', category: 'Friend', side: 'Common', property: 'Resort', roomNo: 'TBD', status: 'Pending', mealPlan: { lunch17: '', dinner18: '' }, dressCode: '', dietaryNote: '', sangeetAct: '', pickupScheduled: false }, ...p])} className="bg-[#D4AF37] text-stone-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl">
                <UserPlus size={18} /> New Entry
              </button>
            )}
          </div>
          <DataTable 
            guests={deferredGuests} 
            onUpdate={handleUpdateGuest}
            columns={[
              { key: 'name', label: 'HONORED NAME', editable: isPlanner },
              { key: 'side', label: 'SIDE', editable: isPlanner, type: 'select', options: ['Ladkiwale', 'Ladkewale', 'Common'] },
              { key: 'property', label: 'STAY', editable: isPlanner, type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] },
              { key: 'roomNo', label: 'ROOM #', editable: isPlanner },
              { key: 'status', label: 'STATUS', editable: isPlanner, type: 'select', options: ['Confirmed', 'Pending', 'Declined'] },
            ]}
          />
        </div>
      );
    }

    if (activeTab === 'rsvp-manager') return <RSVPManager guests={deferredGuests} onUpdate={handleUpdateGuest} role={userRole} onTeleport={handleTeleport} />;
    if (activeTab === 'venue') return <VenueOverview onUpdateRoomImage={handleUpdateRoomImage} rooms={rooms} isPlanner={isPlanner} />;
    if (activeTab === 'rooms') return <RoomMap guests={deferredGuests} rooms={rooms} onUpdateImage={handleUpdateRoomImage} isPlanner={isPlanner} />;
    if (activeTab === 'tree') return <TreeView guests={deferredGuests} />;
    if (activeTab === 'budget') return <BudgetTracker budget={budget} onUpdateBudget={(u) => setBudget(p => ({...p, ...u}))} guests={deferredGuests} isPlanner={isPlanner} />;
    if (activeTab === 'ai') return <AIPlanner guests={deferredGuests} />;

    return <div className="p-20 text-center font-serif text-stone-400">Loading...</div>;
  };

  const isStrictGuest = userRole === 'guest';

  return (
    <div className="min-h-screen bg-[#FCFAF2] flex flex-col lg:flex-row">
      {!isStrictGuest && <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} role={userRole} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      <main className={`flex-grow min-h-screen w-full transition-all ${!isStrictGuest ? 'lg:ml-64' : ''}`}>
        {!isStrictGuest && (
          <header className="flex items-center justify-between p-4 md:px-10 md:py-8 sticky top-0 bg-[#FCFAF2]/95 backdrop-blur-xl z-[100] border-b border-[#D4AF37]/10">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-[#B8860B]"><Menu size={24} /></button>
            <div className="hidden md:block">
              <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.4em]">Estate Sync Online</p>
              <h1 className="text-xl font-serif font-bold text-stone-900">{EVENT_CONFIG.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {isPlanner && (
                <div className="flex items-center gap-2 bg-[#D4AF37] text-stone-900 px-4 py-2 rounded-full shadow-md mr-2">
                   <Hammer size={14} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Master Planner Mode</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase">
                  <AlertTriangle size={14} /> Storage Full
                </div>
              )}
              {saveIndicator ? (
                <div className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full"><CheckCircle size={16} className="text-[#D4AF37]" /> <span className="text-[10px] font-black uppercase">Saved</span></div>
              ) : (
                <div className="flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-full border-2 border-stone-100 opacity-50"><RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} /> <span className="text-[10px] font-black uppercase">Live Sync</span></div>
              )}
            </div>
          </header>
        )}
        <div className={`${isStrictGuest ? 'w-full' : 'max-w-7xl mx-auto px-4 md:px-10 py-10'}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;