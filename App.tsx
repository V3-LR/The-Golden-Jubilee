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
import { Menu, ShieldCheck, UserPlus, EyeOff, CheckCircle, RefreshCw } from 'lucide-react';

const STABLE_KEY = 'ESTATE_PLANNER_STABLE_V1';
const MEDIA_KEY_ROOMS = 'ESTATE_PLANNER_ROOMS_V1';
const MEDIA_KEY_EVENTS = 'ESTATE_PLANNER_EVENTS_V1';
const SESSION_KEY = 'ESTATE_PLANNER_SESSION_STABLE';

/**
 * Image Compression Utility
 * Prevents "Blank Image" bug by staying within localStorage 5MB quota
 */
const compressImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1200;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% quality JPEG
    };
  });
};

const App: React.FC = () => {
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  useEffect(() => {
    if (userRole) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ role: userRole, guestId: activeGuestId, lastTab: activeTab }));
    }
  }, [userRole, activeGuestId, activeTab]);

  useEffect(() => { localStorage.setItem(STABLE_KEY, JSON.stringify(guests)); }, [guests]);
  useEffect(() => { localStorage.setItem(MEDIA_KEY_ROOMS, JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem(MEDIA_KEY_EVENTS, JSON.stringify(itinerary)); }, [itinerary]);

  const handleUpdateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setIsSyncing(true);
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    setTimeout(() => setIsSyncing(false), 200);
  }, []);

  const handleUpdateRoomImage = async (roomNo: string, property: string, newImage: string) => {
    setIsSyncing(true);
    const optimized = await compressImage(newImage);
    setRooms(prev => prev.map(r => (r.roomNo === roomNo && r.property === property) ? { ...r, image: optimized } : r));
    setTimeout(() => setIsSyncing(false), 200);
  };

  const handleUpdateEventImage = async (eventId: string, newImage: string) => {
    setIsSyncing(true);
    const optimized = await compressImage(newImage);
    setItinerary(prev => prev.map(e => e.id === eventId ? { ...e, image: optimized } : e));
    setTimeout(() => setIsSyncing(false), 200);
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
    window.location.href = window.location.origin + window.location.pathname;
  };

  const handleAddGuest = () => {
    const newGuest: Guest = {
      id: `g-${Date.now()}`,
      name: 'New Honored Guest',
      category: 'Friend',
      side: 'Common',
      property: 'Resort',
      roomNo: 'TBD',
      status: 'Pending',
      dietaryNote: 'Standard',
      sangeetAct: 'TBD',
      pickupScheduled: false,
      dressCode: 'Indo-Western Glitz',
      mealPlan: { lunch17: 'TBD', dinner18: 'TBD' }
    };
    setGuests(prev => [newGuest, ...prev]);
  };

  const forceSync = () => {
    setIsSyncing(true);
    setSaveIndicator(true);
    setTimeout(() => { setSaveIndicator(false); setIsSyncing(false); }, 1500);
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
          {userRole === 'planner' && (
            <div className="bg-stone-900 text-white p-5 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between border-2 border-[#D4AF37] shadow-2xl mb-10 gap-4">
              <div className="flex items-center gap-4">
                <ShieldCheck className="text-[#D4AF37]" size={24} />
                <p className="text-sm font-bold">Impersonating Guest: <span className="text-[#D4AF37]">{currentGuest.name}</span></p>
              </div>
              <button onClick={() => handleTabChange('master')} className="bg-[#D4AF37] text-stone-900 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <EyeOff size={16} /> Close Preview
              </button>
            </div>
          )}
          <GuestPortal 
            guest={currentGuest} 
            onUpdate={handleUpdateGuest} 
            roomDatabase={rooms}
            itinerary={itinerary}
            onUpdateEventImage={userRole === 'planner' ? handleUpdateEventImage : undefined}
            onUpdateRoomImage={userRole === 'planner' ? handleUpdateRoomImage : undefined}
          />
        </div>
      );
    }
    
    if (activeTab === 'master') {
      return (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
            <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">Master List</h2>
            {userRole === 'planner' && (
              <button onClick={handleAddGuest} className="bg-[#D4AF37] text-stone-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl">
                <UserPlus size={18} /> New Entry
              </button>
            )}
          </div>
          <DataTable 
            guests={deferredGuests} 
            onUpdate={handleUpdateGuest}
            columns={[
              { key: 'name', label: 'HONORED NAME', editable: userRole === 'planner' },
              { key: 'side', label: 'SIDE', editable: userRole === 'planner', type: 'select', options: ['Ladkiwale', 'Ladkewale', 'Common'] },
              { key: 'property', label: 'STAY', editable: userRole === 'planner', type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] },
              { key: 'roomNo', label: 'ROOM #', editable: userRole === 'planner' },
              { key: 'status', label: 'STATUS', editable: userRole === 'planner', type: 'select', options: ['Confirmed', 'Pending', 'Declined'] },
            ]}
          />
        </div>
      );
    }

    if (activeTab === 'rsvp-manager') return <RSVPManager guests={deferredGuests} onUpdate={handleUpdateGuest} role={userRole} onTeleport={handleTeleport} />;
    if (activeTab === 'venue') return <VenueOverview onUpdateRoomImage={userRole === 'planner' ? handleUpdateRoomImage : undefined} rooms={rooms} />;
    if (activeTab === 'rooms') return <RoomMap guests={deferredGuests} rooms={rooms} onUpdateImage={userRole === 'planner' ? handleUpdateRoomImage : undefined} />;
    if (activeTab === 'tree') return <TreeView guests={deferredGuests} />;
    if (activeTab === 'budget') return <BudgetTracker budget={budget} onUpdateBudget={(u) => setBudget(p => ({...p, ...u}))} guests={deferredGuests} isPlanner={userRole === 'planner'} />;
    if (activeTab === 'ai') return <AIPlanner guests={deferredGuests} />;

    return <div className="p-20 text-center font-serif text-stone-400">Loading...</div>;
  };

  const isStrictGuest = userRole === 'guest';

  return (
    <div className="min-h-screen bg-[#FCFAF2] flex flex-col lg:flex-row">
      {isPending && <div className="fixed top-0 left-0 w-full h-1 bg-[#D4AF37] z-[200] animate-pulse"></div>}
      {!isStrictGuest && <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} role={userRole} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      <main className={`flex-grow min-h-screen w-full transition-all ${!isStrictGuest ? 'lg:ml-64' : ''}`}>
        {!isStrictGuest && (
          <header className="flex items-center justify-between p-4 md:px-10 md:py-8 sticky top-0 bg-[#FCFAF2]/95 backdrop-blur-xl z-[40] border-b border-[#D4AF37]/10">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-[#B8860B]"><Menu size={24} /></button>
            <div className="flex items-center gap-3">
              {saveIndicator ? <div className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full"><CheckCircle size={16} className="text-[#D4AF37]" /> <span className="text-[10px] font-black uppercase">Synced</span></div> : <button onClick={forceSync} className="flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-full border-2 border-stone-100"><RefreshCw size={16} className={`text-[#D4AF37] ${isSyncing ? 'animate-spin' : ''}`} /> <span className="text-[10px] font-black uppercase">Save</span></button>}
            </div>
          </header>
        )}
        <div className={`${isStrictGuest ? 'w-full' : 'max-w-7xl mx-auto px-4 md:px-10 py-10'} ${isPending ? 'opacity-70 grayscale-[0.3]' : ''}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;