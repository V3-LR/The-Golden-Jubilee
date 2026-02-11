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
import { Menu, UserPlus, CheckCircle, RefreshCw, Database, Users, Utensils, Save, LifeBuoy, AlertCircle, ShieldAlert } from 'lucide-react';

// STABLE KEY - DO NOT CHANGE
const PERMANENT_KEY = 'SRIVASTAVA_GOLDEN_JUBILEE_MASTER_V4';
const SYNC_INTERVAL = 15000; // 15 seconds

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
  const [showRescueSuccess, setShowRescueSuccess] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 1. ADVANCED RECOVERY ENGINE
  const runDeepRescue = useCallback(() => {
    console.log("Deep Scan Initialized...");
    let bestFoundState: AppState | null = null;
    let maxRealNames = -1;

    // We look for ANY key that might contain Srivastava data
    const possibleKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('SRIVASTAVA') || key.includes('ANNIVERSARY') || key.includes('JUBILEE'))) {
        possibleKeys.push(key);
      }
    }

    possibleKeys.forEach(key => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.guests)) {
            // Calculate "Value" of this data (count guests with non-default names)
            const realNames = parsed.guests.filter((g: any) => 
              g.name && !g.name.includes('Guest ') && g.name !== 'New Guest' && g.name !== 'Mummy' && g.name !== 'Papa'
            ).length;
            
            if (realNames > maxRealNames) {
              maxRealNames = realNames;
              bestFoundState = parsed;
              console.log(`Recovery: Found better candidate in ${key} (${realNames} names)`);
            }
          }
        }
      } catch (e) { console.warn("Parse error during rescue", e); }
    });
    
    return bestFoundState;
  }, []);

  const [appState, setAppState] = useState<AppState>(() => {
    // Attempt normal load
    const saved = localStorage.getItem(PERMANENT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.guests?.length > 0) return parsed;
      } catch (e) { console.error("Load Error", e); }
    }

    // Auto-Rescue on first run if empty
    const recovered = runDeepRescue();
    if (recovered) return recovered;

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
  const isPlanner = session.role === 'planner';

  // Manual Trigger for Recovery
  const handleManualRescue = () => {
    const found = runDeepRescue();
    if (found) {
      setAppState(prev => ({ ...found, session: prev.session }));
      performSync(found);
      setShowRescueSuccess(true);
      setTimeout(() => setShowRescueSuccess(false), 5000);
    } else {
      alert("Deep scan found no saved data. Ensure you are using the same browser as before.");
    }
  };

  const performSync = useCallback((stateToSave: AppState) => {
    setIsSyncing(true);
    setStorageError(null);
    try {
      const serialized = JSON.stringify(stateToSave);
      localStorage.setItem(PERMANENT_KEY, serialized);
      setLastSynced(new Date());
      setHasUnsavedChanges(false);
    } catch (e: any) {
      console.error("Storage Error:", e);
      if (e.name === 'QuotaExceededError' || e.message?.includes('quota')) {
        setStorageError("Storage is FULL. Please do not add more photos, or delete some existing ones to save your guest list.");
      } else {
        setStorageError("Critical Sync Error. Your data may not be saving.");
      }
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  }, []);

  // Save changes automatically when they occur
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeout = setTimeout(() => performSync(appState), 2000);
      return () => clearTimeout(timeout);
    }
  }, [appState, hasUnsavedChanges, performSync]);

  const broadcastUpdate = useCallback((updatesOrFn: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => {
    setAppState((prev: AppState) => {
      const updates = typeof updatesOrFn === 'function' ? updatesOrFn(prev) : updatesOrFn;
      const newState = { ...prev, ...updates };
      setHasUnsavedChanges(true);
      return newState;
    });
  }, []);

  const handleUpdateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setAppState((prev: AppState) => {
      const newGuests = prev.guests.map((g: Guest) => (g.id === id ? { ...g, ...updates } : g));
      setHasUnsavedChanges(true);
      return { ...prev, guests: newGuests };
    });
  }, []);

  // Magic Link handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setAppState(prev => {
        const found = prev.guests.find(g => g.id === id);
        if (found) return { ...prev, session: { ...prev.session, role: prev.session.role === 'planner' ? 'planner' : 'guest', guestId: id, lastTab: 'portal' }};
        return prev;
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
    setIsLoaded(true);
  }, []);

  if (!session.role) return <Login onLogin={(r, id) => broadcastUpdate({ session: { ...session, role: r, guestId: id || null, lastTab: id ? 'portal' : 'master' } })} />;

  const renderContent = () => {
    const currentGuest = deferredGuests.find((g: Guest) => g.id === session.guestId) || (session.role === 'planner' ? deferredGuests[0] : null);
    
    if (session.role === 'guest' && !currentGuest) return <Login onLogin={(r, id) => broadcastUpdate({ session: { ...session, role: r, guestId: id || null, lastTab: 'portal' } })} />;

    if (session.lastTab === 'portal') return (
      <GuestPortal 
        guest={currentGuest!} 
        onUpdate={handleUpdateGuest} 
        roomDatabase={rooms} 
        itinerary={itinerary} 
        isPlanner={isPlanner} 
        onUpdateEventImage={(id, img) => broadcastUpdate(prev => ({ itinerary: prev.itinerary.map(e => e.id === id ? { ...e, image: img } : e) }))} 
        onUpdateRoomImage={(no, prop, img) => broadcastUpdate(prev => ({ rooms: prev.rooms.map(r => r.roomNo === no && r.property === prop ? { ...r, image: img } : r) }))} 
        onBackToMaster={() => broadcastUpdate({ session: { ...session, guestId: null, lastTab: 'master' } })} 
      />
    );
    
    if (session.lastTab === 'master') return (
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
          <div><h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">Master List</h2><p className="text-stone-500 italic mt-2">Global Source of Truth.</p></div>
          {isPlanner && (
            <div className="flex flex-wrap gap-4">
               <button onClick={handleManualRescue} className="bg-amber-50 text-amber-700 px-6 py-5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-amber-200 flex items-center gap-2 hover:bg-amber-100 transition-all">
                  <LifeBuoy size={18} /> Deep-Rescue Names
               </button>
               <button onClick={() => broadcastUpdate(prev => ({ guests: [{ id: `g-${Date.now()}`, name: 'New Guest', category: 'Friend', side: 'Common', property: 'Villa-Pool', roomNo: 'TBD', status: 'Pending', dietaryPreference: 'Veg', mealPlan: { lunch17: 'Veg', dinner17: 'Veg', lunch18: 'Veg', gala18: 'Veg' }, dressCode: '', dietaryNote: '', sangeetAct: '', pickupScheduled: false }, ...prev.guests] }))} className="bg-[#D4AF37] text-stone-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl border-4 border-white hover:scale-105 transition-all"><UserPlus size={18} /> Add Guest</button>
            </div>
          )}
        </div>
        
        {storageError && (
          <div className="bg-red-600 text-white p-6 rounded-[2rem] flex items-center gap-4 shadow-2xl animate-pulse">
             <ShieldAlert size={24} />
             <p className="font-black uppercase tracking-widest text-xs">{storageError}</p>
          </div>
        )}

        {showRescueSuccess && (
          <div className="bg-green-600 text-white p-6 rounded-[2rem] flex items-center gap-4 shadow-xl">
             <CheckCircle size={24} />
             <p className="font-black uppercase tracking-widest text-xs">Legacy Data Recovered Successfully!</p>
          </div>
        )}

        <DataTable guests={deferredGuests} onUpdate={handleUpdateGuest} columns={[{ key: 'name', label: 'FULL NAME', editable: isPlanner }, { key: 'familyMembers', label: 'PAX & DIET', render: (g) => <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-stone-800 uppercase">{(g.familyMembers?.length || 0) + 1} Pax</span><span className="text-[8px] font-black bg-stone-100 text-stone-500 px-2 py-0.5 rounded">{g.dietaryPreference || 'Veg'}</span></div> }, { key: 'property', label: 'STAY', editable: isPlanner, type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] }, { key: 'roomNo', label: 'ROOM', editable: isPlanner }, { key: 'status', label: 'RSVP', editable: isPlanner, type: 'select', options: ['Confirmed', 'Pending', 'Declined'] }]} />
      </div>
    );
    if (session.lastTab === 'rsvp-manager') return <RSVPManager guests={deferredGuests} onUpdate={handleUpdateGuest} role={session.role} onTeleport={(id) => broadcastUpdate({ session: { ...session, guestId: id, lastTab: 'portal' } })} />;
    if (session.lastTab === 'venue') return <VenueOverview onUpdateRoomImage={(no, prop, img) => broadcastUpdate(prev => ({ rooms: prev.rooms.map(r => r.roomNo === no && r.property === prop ? { ...r, image: img } : r) }))} rooms={rooms} isPlanner={isPlanner} />;
    if (session.lastTab === 'rooms') return <RoomMap guests={deferredGuests} rooms={rooms} onUpdateImage={(no, prop, img) => broadcastUpdate(prev => ({ rooms: prev.rooms.map(r => r.roomNo === no && r.property === prop ? { ...r, image: img } : r) }))} onAddRoom={(r) => broadcastUpdate(p => ({ rooms: [...p.rooms, r] }))} onUpdateRoom={(no, prop, updates) => broadcastUpdate(p => ({ rooms: p.rooms.map(r => r.roomNo === no && r.property === prop ? { ...r, ...updates } : r) }))} onDeleteRoom={(no, prop) => broadcastUpdate(p => ({ rooms: p.rooms.filter(r => !(r.roomNo === no && r.property === prop)) }))} isPlanner={isPlanner} />;
    if (session.lastTab === 'meals') return <MealPlan guests={deferredGuests} budget={budget} onUpdate={handleUpdateGuest} isPlanner={isPlanner} />;
    if (session.lastTab === 'tasks') return <TaskMatrix tasks={tasks} onUpdateTasks={(t) => broadcastUpdate({ tasks: t })} isPlanner={isPlanner} />;
    if (session.lastTab === 'tree') return <TreeView guests={deferredGuests} />;
    if (session.lastTab === 'budget') return <BudgetTracker budget={budget} onUpdateBudget={(u) => broadcastUpdate(prev => ({ budget: { ...prev.budget, ...u } }))} guests={deferredGuests} isPlanner={isPlanner} onFinalizePath={(path) => broadcastUpdate(p => ({ tasks: path === 'Villa' ? [...p.tasks, ...VILLA_TASKS] : p.tasks, budget: { ...p.budget, selectedPath: path, committedSpend: path === 'Villa' ? 310000 : 485500 } }))} />;
    if (session.lastTab === 'ai') return <AIPlanner guests={deferredGuests} />;
    if (session.lastTab === 'inventory') return <InventoryManager guests={deferredGuests} inventory={budget.inventory || []} onUpdate={(inv) => broadcastUpdate(prev => ({ budget: { ...prev.budget, inventory: inv } }))} isPlanner={isPlanner} />;
    return <div className="p-20 text-center font-serif text-stone-400">Loading...</div>;
  };

  return (
    <div className="min-h-screen bg-[#FCFAF2] flex flex-col lg:flex-row">
      {session.role === 'planner' && (
        <Sidebar activeTab={session.lastTab as AppTab} setActiveTab={(t) => broadcastUpdate({ session: { ...session, lastTab: t } })} role={session.role} onLogout={() => broadcastUpdate({ session: { role: null, guestId: null, lastTab: 'master' } })} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
      
      <main className={`flex-grow min-h-screen w-full transition-all ${session.role === 'planner' ? 'lg:ml-64' : ''}`}>
        {session.role === 'planner' && (
          <header className="flex items-center justify-between p-4 md:px-10 md:py-8 sticky top-0 bg-[#FCFAF2]/95 backdrop-blur-xl z-[100] border-b border-[#D4AF37]/10">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-[#B8860B]"><Menu size={24} /></button>
            <div className="hidden md:block cursor-pointer" onClick={() => broadcastUpdate({ session: { ...session, lastTab: 'master', guestId: null } })}>
              <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.4em]">Sunehri Saalgira Online</p>
              <h1 className="text-xl font-serif font-bold text-stone-900">{EVENT_CONFIG.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {isSyncing ? (
                <div className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full animate-pulse">
                  <RefreshCw size={16} className="animate-spin text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Saving...</span>
                </div>
              ) : (
                <button 
                  onClick={() => performSync(appState)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${
                    hasUnsavedChanges 
                    ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-lg scale-105' 
                    : 'bg-white border-stone-100 text-stone-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  {hasUnsavedChanges ? <Save size={16} className="animate-bounce" /> : <CheckCircle size={16} className="text-green-500" />}
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[8px] font-black uppercase tracking-widest">
                      {hasUnsavedChanges ? 'Draft (Sync Now)' : 'All Synced'}
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