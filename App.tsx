import React, { useState, useCallback, useEffect, useTransition, useDeferredValue } from 'react';
import { Guest, AppTab, Budget, UserRole, EventFunction, RoomDetail, Task } from './types';
import { INITIAL_GUESTS, INITIAL_BUDGET, EVENT_CONFIG, ITINERARY as STATIC_ITINERARY, ROOM_DATABASE as STATIC_ROOMS, VILLA_TASKS } from './constants';
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
import MealPlan from './components/MealPlan';
import TaskMatrix from './components/TaskMatrix';
import { Menu, UserPlus, CheckCircle, RefreshCw, Hammer, Database } from 'lucide-react';

// ABSOLUTE SOURCE OF TRUTH KEYS
const STORAGE_KEY = 'SRIVASTAVA_ANNIVERSARY_FINAL';
const LEGACY_KEY = 'ESTATE_PLANNER_STABLE_V1';

interface AppState {
  guests: Guest[];
  rooms: RoomDetail[];
  itinerary: EventFunction[];
  budget: Budget;
  tasks: Task[];
  session: { role: UserRole; guestId: string | null; lastTab: string };
}

const App: React.FC = () => {
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 1. HARDENED INITIALIZATION LOGIC
  const [appState, setAppState] = useState<AppState>(() => {
    const primary = localStorage.getItem(STORAGE_KEY);
    const legacy = localStorage.getItem(LEGACY_KEY);
    
    const saved = primary || legacy;
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure we don't return an empty object/array if parsing succeeded but data is hollow
        if (parsed && parsed.guests && parsed.guests.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Data recovery failed, attempting next fallback", e);
      }
    }
    
    // Default fallback to static constants only if no storage found
    return {
      guests: INITIAL_GUESTS,
      rooms: STATIC_ROOMS,
      itinerary: STATIC_ITINERARY,
      budget: INITIAL_BUDGET,
      tasks: [],
      session: { role: null, guestId: null, lastTab: 'master' }
    };
  });

  const { guests, rooms, itinerary, budget, tasks, session } = appState;
  const deferredGuests = useDeferredValue(guests);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isPlanner = session.role === 'planner';

  // 2. MULTI-TAB SYNC LISTENER
  useEffect(() => {
    const handleGlobalSync = (e: StorageEvent | Event) => {
      // If it's a real storage event from another tab OR our manual dispatch
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (rawData) {
        try {
          const freshData = JSON.parse(rawData);
          setAppState(freshData);
        } catch (err) {
          console.error("Failed to sync cross-tab data", err);
        }
      }
    };

    window.addEventListener('storage', handleGlobalSync);
    return () => window.removeEventListener('storage', handleGlobalSync);
  }, []);

  // 3. PERSISTENCE HOOK (Writes to Absolute Key)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  // Unified State Broadcast Update
  const broadcastUpdate = (updates: Partial<AppState>) => {
    setAppState((prev: AppState) => {
      const newState = { ...prev, ...updates };
      // Manual dispatch to trigger sync in current tab if needed, 
      // but primarily ensures consistency across the app ecosystem
      window.dispatchEvent(new Event('storage'));
      return newState;
    });
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 1500);
  };

  const updateGuests = (newGuests: Guest[]) => {
    const confirmedPax = newGuests.filter(g => g.status === 'Confirmed').length;
    broadcastUpdate({
      guests: newGuests,
      budget: { ...appState.budget, finalCateringPax: confirmedPax }
    });
  };

  const handleUpdateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    const newGuests = guests.map((g: Guest) => (g.id === id ? { ...g, ...updates } : g));
    updateGuests(newGuests);
  }, [guests]);

  const handleFinalizePath = (path: 'Villa' | 'Resort') => {
    const newTasks = path === 'Villa' ? [...appState.tasks, ...VILLA_TASKS] : appState.tasks;
    const committedAmount = path === 'Villa' ? 310000 : 485500;
    broadcastUpdate({
      tasks: newTasks,
      budget: {
        ...appState.budget,
        selectedPath: path,
        committedSpend: committedAmount
      }
    });
  };

  const handleEmergencyBackup = () => {
    const dataStr = JSON.stringify(appState, null, 2);
    navigator.clipboard.writeText(dataStr);
    alert("Emergency Backup Success! Data copied. Save this in your notes.");
  };

  const handleLogin = (role: UserRole, guestId?: string) => {
    broadcastUpdate({
      session: { ...appState.session, role, guestId: guestId || null, lastTab: guestId ? 'portal' : 'master' }
    });
  };

  const handleLogout = () => {
    broadcastUpdate({
      session: { role: null, guestId: null, lastTab: 'master' }
    });
  };

  const handleTabChange = useCallback((tab: AppTab) => {
    setIsSidebarOpen(false);
    broadcastUpdate({
      session: { ...appState.session, lastTab: tab }
    });
  }, [appState.session]);

  const handleTeleport = (guestId: string) => {
    broadcastUpdate({
      session: { ...appState.session, guestId, lastTab: 'portal' }
    });
  };

  if (!session.role) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    const currentGuest = deferredGuests.find((g: Guest) => g.id === session.guestId) || deferredGuests[0];

    if (session.lastTab === 'portal') {
      return (
        <GuestPortal 
          guest={currentGuest} 
          onUpdate={handleUpdateGuest} 
          roomDatabase={rooms}
          itinerary={itinerary}
          isPlanner={isPlanner}
          onUpdateEventImage={(id: string, img: string) => broadcastUpdate({ itinerary: itinerary.map((e: EventFunction) => e.id === id ? { ...e, image: img } : e) })}
          onUpdateRoomImage={(no: string, prop: string, img: string) => broadcastUpdate({ rooms: rooms.map((r: RoomDetail) => (r.roomNo === no && r.property === prop) ? { ...r, image: img } : r) })}
          onBackToMaster={() => handleTabChange('master')}
        />
      );
    }
    
    if (session.lastTab === 'master') {
      return (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
            <div>
              <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight tracking-tight">Master List</h2>
              <p className="text-stone-500 italic mt-2">The permanent source of truth for all 45 guests.</p>
            </div>
            {isPlanner && (
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleEmergencyBackup}
                  className="bg-stone-900 text-white px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-black transition-all"
                >
                  <Database size={16} className="text-[#D4AF37]" /> Emergency Backup
                </button>
                <button 
                  onClick={() => updateGuests([{ id: `g-${Date.now()}`, name: 'New Guest', category: 'Friend', side: 'Common', property: 'Resort', roomNo: 'TBD', status: 'Pending', mealPlan: { lunch17: '', dinner18: '' }, dressCode: '', dietaryNote: '', sangeetAct: '', pickupScheduled: false }, ...guests])} 
                  className="bg-[#D4AF37] text-stone-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl border-4 border-white hover:scale-105 transition-all"
                >
                  <UserPlus size={18} /> New Guest
                </button>
              </div>
            )}
          </div>
          <DataTable 
            guests={deferredGuests} 
            onUpdate={handleUpdateGuest}
            columns={[
              { key: 'name', label: 'FULL NAME', editable: isPlanner },
              { key: 'side', label: 'SIDE', editable: isPlanner, type: 'select', options: ['Ladkiwale', 'Ladkewale', 'Common'] },
              { key: 'property', label: 'STAY', editable: isPlanner, type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] },
              { key: 'roomNo', label: 'ROOM', editable: isPlanner },
              { key: 'status', label: 'RSVP', editable: isPlanner, type: 'select', options: ['Confirmed', 'Pending', 'Declined'] },
            ]}
          />
        </div>
      );
    }

    if (session.lastTab === 'rsvp-manager') return <RSVPManager guests={deferredGuests} onUpdate={handleUpdateGuest} role={session.role} onTeleport={handleTeleport} />;
    if (session.lastTab === 'venue') return <VenueOverview onUpdateRoomImage={(no: string, prop: string, img: string) => broadcastUpdate({ rooms: rooms.map((r: RoomDetail) => (r.roomNo === no && r.property === prop) ? { ...r, image: img } : r) })} rooms={rooms} isPlanner={isPlanner} />;
    if (session.lastTab === 'rooms') return <RoomMap guests={deferredGuests} rooms={rooms} onUpdateImage={(no: string, prop: string, img: string) => broadcastUpdate({ rooms: rooms.map((r: RoomDetail) => (r.roomNo === no && r.property === prop) ? { ...r, image: img } : r) })} isPlanner={isPlanner} />;
    if (session.lastTab === 'meals') return <MealPlan guests={deferredGuests} onUpdate={handleUpdateGuest} isPlanner={isPlanner} />;
    if (session.lastTab === 'tasks') return <TaskMatrix tasks={tasks} onUpdateTasks={(t: Task[]) => broadcastUpdate({ tasks: t })} isPlanner={isPlanner} />;
    if (session.lastTab === 'tree') return <TreeView guests={deferredGuests} />;
    if (session.lastTab === 'budget') return (
      <BudgetTracker 
        budget={budget} 
        onUpdateBudget={(u) => broadcastUpdate({ budget: { ...budget, ...u } })} 
        guests={deferredGuests} 
        isPlanner={isPlanner} 
        onFinalizePath={handleFinalizePath}
      />
    );
    if (session.lastTab === 'ai') return <AIPlanner guests={deferredGuests} />;

    return <div className="p-20 text-center font-serif text-stone-400">Loading...</div>;
  };

  const isStrictGuest = session.role === 'guest';

  return (
    <div className="min-h-screen bg-[#FCFAF2] flex flex-col lg:flex-row">
      {!isStrictGuest && <Sidebar activeTab={session.lastTab as AppTab} setActiveTab={handleTabChange} role={session.role} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      <main className={`flex-grow min-h-screen w-full transition-all ${!isStrictGuest ? 'lg:ml-64' : ''}`}>
        {!isStrictGuest && (
          <header className="flex items-center justify-between p-4 md:px-10 md:py-8 sticky top-0 bg-[#FCFAF2]/95 backdrop-blur-xl z-[100] border-b border-[#D4AF37]/10">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-[#B8860B]"><Menu size={24} /></button>
            <div className="hidden md:block text-center lg:text-left">
              <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.4em]">Sunehri Saalgira Hub</p>
              <h1 className="text-xl font-serif font-bold text-stone-900">{EVENT_CONFIG.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {isPlanner && (
                <div className="flex items-center gap-2 bg-[#D4AF37] text-stone-900 px-4 py-2 rounded-full shadow-md mr-2">
                   <Hammer size={14} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Master Planner</span>
                </div>
              )}
              {saveIndicator ? (
                <div className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full animate-in zoom-in"><CheckCircle size={16} className="text-[#D4AF37]" /> <span className="text-[10px] font-black uppercase">Protected & Synced</span></div>
              ) : (
                <div className="flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-full border-2 border-stone-100 opacity-50">
                  <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} /> 
                  <span className="text-[10px] font-black uppercase">Source of Truth</span>
                </div>
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