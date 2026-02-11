import React, { useState, useCallback, useEffect, useTransition, useDeferredValue, useRef } from 'react';
import { Guest, AppTab, Budget, UserRole, EventFunction, RoomDetail, Task, EventCatering, InventoryItem, PropertyType } from './types';
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
import InventoryManager from './components/InventoryManager';
import { Menu, UserPlus, CheckCircle, RefreshCw, Hammer, Database, Users, Utensils, Save } from 'lucide-react';

// ABSOLUTE SOURCE OF TRUTH KEY
const STORAGE_KEY = 'SRIVASTAVA_ANNIVERSARY_FINAL';
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface AppState {
  guests: Guest[];
  rooms: RoomDetail[];
  itinerary: EventFunction[];
  budget: Budget;
  tasks: Task[];
  session: { role: UserRole; guestId: string | null; lastTab: string };
}

const App: React.FC = () => {
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPending, startTransition] = useTransition();
  const syncTimerRef = useRef<number | null>(null);

  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.guests && parsed.guests.length > 0) return parsed;
      } catch (e) {
        console.error("Data recovery failed", e);
      }
    }
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

  // MAGIC LINK DETECTION: Detects ?id=guest-xyz in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlGuestId = params.get('id');
    
    if (urlGuestId) {
      const guestExists = guests.some(g => g.id === urlGuestId);
      if (guestExists) {
        setAppState(prev => ({
          ...prev,
          session: {
            ...prev.session,
            role: 'guest',
            guestId: urlGuestId,
            lastTab: 'portal'
          }
        }));
        // Optional: Clean up URL after successful login
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Master Sync Function
  const performSync = useCallback((stateToSave: AppState) => {
    setIsSyncing(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      setLastSynced(new Date());
      setHasUnsavedChanges(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Sync failed", e);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  }, []);

  // Automatic Sync Interval: 5 Minutes
  useEffect(() => {
    syncTimerRef.current = window.setInterval(() => {
      setAppState(current => {
        performSync(current);
        return current;
      });
    }, SYNC_INTERVAL);

    return () => {
      if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    };
  }, [performSync]);

  useEffect(() => {
    const handleGlobalSync = (e: StorageEvent | Event) => {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (rawData) {
        try {
          const freshData = JSON.parse(rawData);
          setAppState(freshData);
          setLastSynced(new Date());
          setHasUnsavedChanges(false);
        } catch (err) { console.error("Sync error", err); }
      }
    };
    window.addEventListener('storage', handleGlobalSync);
    return () => window.removeEventListener('storage', handleGlobalSync);
  }, []);

  const broadcastUpdate = (updatesOrFn: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => {
    setAppState((prev: AppState) => {
      const updates = typeof updatesOrFn === 'function' ? updatesOrFn(prev) : updatesOrFn;
      const newState = { ...prev, ...updates };
      setHasUnsavedChanges(true);
      return newState;
    });
  };

  const calculateCateringPax = (currentGuests: Guest[]) => {
    const events = ['lunch17', 'dinner17', 'lunch18', 'gala18'] as const;
    const result: Record<string, EventCatering> = {};

    events.forEach(ev => {
      let adultVeg = 0, adultNonVeg = 0, kidVeg = 0, kidNonVeg = 0;
      currentGuests.forEach(g => {
        if (g.status === 'Confirmed') {
          const gPref = (g.mealPlan[ev] as any) || g.dietaryPreference || 'Veg';
          if (gPref === 'Veg') adultVeg++; else adultNonVeg++;
          g.familyMembers?.forEach(f => {
            const fPref = f.mealPlan ? f.mealPlan[ev] : (f.dietaryPreference || 'Veg');
            if (f.age < 11) { if (fPref === 'Veg') kidVeg++; else kidNonVeg++; }
            else { if (fPref === 'Veg') adultVeg++; else adultNonVeg++; }
          });
        }
      });
      result[ev] = { adultVeg, adultNonVeg, kidVeg, kidNonVeg };
    });

    const gala = result['gala18'];
    return {
      adults: gala.adultVeg + gala.adultNonVeg,
      kids: gala.kidVeg + gala.kidNonVeg,
      breakdown: result as any
    };
  };

  const handleUpdateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setAppState((prev: AppState) => {
      const newGuests = prev.guests.map((g: Guest) => (g.id === id ? { ...g, ...updates } : g));
      const { adults, kids, breakdown } = calculateCateringPax(newGuests);
      setHasUnsavedChanges(true);
      return {
        ...prev,
        guests: newGuests,
        budget: {
          ...prev.budget,
          finalCateringPax: adults,
          finalCateringKidsPax: kids,
          cateringBreakdown: breakdown,
        }
      };
    });
  }, []);

  const handleUpdateInventory = (inventory: InventoryItem[]) => {
    broadcastUpdate({ budget: { ...budget, inventory } });
  };

  const handleAddRoom = (newRoom: RoomDetail) => {
    broadcastUpdate({ rooms: [...rooms, newRoom] });
  };

  const handleDeleteRoom = (roomNo: string, property: PropertyType) => {
    broadcastUpdate({ rooms: rooms.filter(r => !(r.roomNo === roomNo && r.property === property)) });
  };

  const handleUpdateRoom = (roomNo: string, property: PropertyType, updates: Partial<RoomDetail>) => {
    broadcastUpdate({
      rooms: rooms.map(r => (r.roomNo === roomNo && r.property === property) ? { ...r, ...updates } : r)
    });
  };

  const handleFinalizePath = (path: 'Villa' | 'Resort') => {
    const newTasks = path === 'Villa' ? [...appState.tasks, ...VILLA_TASKS] : appState.tasks;
    const committedAmount = path === 'Villa' ? 310000 : 485500;
    broadcastUpdate({
      tasks: newTasks,
      budget: { ...appState.budget, selectedPath: path, committedSpend: committedAmount }
    });
  };

  const handleManualSync = () => {
    performSync(appState);
  };

  if (!session.role) return <Login onLogin={(r, id) => broadcastUpdate({ session: { ...session, role: r, guestId: id || null, lastTab: id ? 'portal' : 'master' } })} />;

  const renderContent = () => {
    const currentGuest = deferredGuests.find((g: Guest) => g.id === session.guestId) || (session.role === 'planner' ? deferredGuests[0] : null);
    
    // If guest role but no guest found, force login
    if (session.role === 'guest' && !currentGuest) return <Login onLogin={(r, id) => broadcastUpdate({ session: { ...session, role: r, guestId: id || null, lastTab: 'portal' } })} />;

    if (session.lastTab === 'portal') return <GuestPortal guest={currentGuest!} onUpdate={handleUpdateGuest} roomDatabase={rooms} itinerary={itinerary} isPlanner={isPlanner} onUpdateEventImage={(id, img) => broadcastUpdate({ itinerary: itinerary.map(e => e.id === id ? { ...e, image: img } : e) })} onUpdateRoomImage={(no, prop, img) => handleUpdateRoom(no, prop as PropertyType, { image: img })} onBackToMaster={() => broadcastUpdate({ session: { ...session, lastTab: 'master' } })} />;
    if (session.lastTab === 'master') return (
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
          <div><h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">Master List</h2><p className="text-stone-500 italic mt-2">Source of Truth for Mummy & Papa's 50th.</p></div>
          {isPlanner && <button onClick={() => broadcastUpdate({ guests: [{ id: `g-${Date.now()}`, name: 'New Guest', category: 'Friend', side: 'Common', property: 'Villa-Pool', roomNo: 'TBD', status: 'Pending', dietaryPreference: 'Veg', mealPlan: { lunch17: 'Veg', dinner17: 'Veg', lunch18: 'Veg', gala18: 'Veg' }, dressCode: '', dietaryNote: '', sangeetAct: '', pickupScheduled: false }, ...guests] })} className="bg-[#D4AF37] text-stone-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl border-4 border-white hover:scale-105 transition-all"><UserPlus size={18} /> New Guest</button>}
        </div>
        <DataTable guests={deferredGuests} onUpdate={handleUpdateGuest} columns={[{ key: 'name', label: 'FULL NAME', editable: isPlanner }, { key: 'familyMembers', label: 'PAX & DIET', render: (g) => <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-stone-800 uppercase">{(g.familyMembers?.length || 0) + 1} Pax</span><span className="text-[8px] font-black bg-stone-100 text-stone-500 px-2 py-0.5 rounded">{g.dietaryPreference || 'Veg'}</span></div> }, { key: 'property', label: 'STAY', editable: isPlanner, type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] }, { key: 'roomNo', label: 'ROOM', editable: isPlanner }, { key: 'status', label: 'RSVP', editable: isPlanner, type: 'select', options: ['Confirmed', 'Pending', 'Declined'] }]} />
      </div>
    );
    if (session.lastTab === 'rsvp-manager') return <RSVPManager guests={deferredGuests} onUpdate={handleUpdateGuest} role={session.role} onTeleport={(id) => broadcastUpdate({ session: { ...session, guestId: id, lastTab: 'portal' } })} />;
    if (session.lastTab === 'venue') return <VenueOverview onUpdateRoomImage={(no, prop, img) => handleUpdateRoom(no, prop as PropertyType, { image: img })} rooms={rooms} isPlanner={isPlanner} />;
    if (session.lastTab === 'rooms') return <RoomMap guests={deferredGuests} rooms={rooms} onUpdateImage={(no, prop, img) => handleUpdateRoom(no, prop as PropertyType, { image: img })} onAddRoom={handleAddRoom} onUpdateRoom={handleUpdateRoom} onDeleteRoom={handleDeleteRoom} isPlanner={isPlanner} />;
    if (session.lastTab === 'meals') return <MealPlan guests={deferredGuests} budget={budget} onUpdate={handleUpdateGuest} isPlanner={isPlanner} />;
    if (session.lastTab === 'tasks') return <TaskMatrix tasks={tasks} onUpdateTasks={(t) => broadcastUpdate({ tasks: t })} isPlanner={isPlanner} />;
    if (session.lastTab === 'tree') return <TreeView guests={deferredGuests} />;
    if (session.lastTab === 'budget') return <BudgetTracker budget={budget} onUpdateBudget={(u) => broadcastUpdate({ budget: { ...budget, ...u } })} guests={deferredGuests} isPlanner={isPlanner} onFinalizePath={handleFinalizePath} />;
    if (session.lastTab === 'ai') return <AIPlanner guests={deferredGuests} />;
    if (session.lastTab === 'inventory') return <InventoryManager guests={deferredGuests} inventory={budget.inventory || []} onUpdate={handleUpdateInventory} isPlanner={isPlanner} />;
    return <div className="p-20 text-center font-serif text-stone-400">Loading...</div>;
  };

  return (
    <div className="min-h-screen bg-[#FCFAF2] flex flex-col lg:flex-row">
      {session.role !== 'guest' && <Sidebar activeTab={session.lastTab as AppTab} setActiveTab={(t) => broadcastUpdate({ session: { ...session, lastTab: t } })} role={session.role} onLogout={() => broadcastUpdate({ session: { role: null, guestId: null, lastTab: 'master' } })} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      <main className={`flex-grow min-h-screen w-full transition-all ${session.role !== 'guest' ? 'lg:ml-64' : ''}`}>
        {session.role !== 'guest' && (
          <header className="flex items-center justify-between p-4 md:px-10 md:py-8 sticky top-0 bg-[#FCFAF2]/95 backdrop-blur-xl z-[100] border-b border-[#D4AF37]/10">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-[#B8860B]"><Menu size={24} /></button>
            <div className="hidden md:block"><p className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.4em]">Sunehri Saalgira Online</p><h1 className="text-xl font-serif font-bold text-stone-900">{EVENT_CONFIG.title}</h1></div>
            <div className="flex items-center gap-3">
              {isSyncing ? (
                <div className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full animate-pulse">
                  <RefreshCw size={16} className="animate-spin text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Syncing Master...</span>
                </div>
              ) : (
                <button 
                  onClick={handleManualSync}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${
                    hasUnsavedChanges 
                    ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-lg scale-105' 
                    : 'bg-white border-stone-100 text-stone-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  {hasUnsavedChanges ? <Save size={16} className="animate-bounce" /> : <CheckCircle size={16} className="text-green-500" />}
                  <div className="flex flex-col items-start">
                    <span className="text-[8px] font-black uppercase tracking-widest">
                      {hasUnsavedChanges ? 'Draft Changes (Sync Now)' : 'Master Synced'}
                    </span>
                    <span className="text-[7px] font-bold uppercase">
                      Last: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </button>
              )}
            </div>
          </header>
        )}
        <div className={`${session.role === 'guest' ? 'w-full' : 'max-w-7xl mx-auto px-4 md:px-10 py-10'}`}>{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;