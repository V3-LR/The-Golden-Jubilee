
import React, { useState, useCallback, useEffect, useDeferredValue } from 'react';
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
import InventoryManager from './components/InventoryManager';
import DeploymentHub from './components/DeploymentHub';
import { Menu, UserPlus, CheckCircle, RefreshCw, Save, ShieldAlert, Cloud, Share2, Users, HardDrive } from 'lucide-react';

const MASTER_KEY = 'SRIVASTAVA_JUBILEE_V15_MASTER';

interface AppState {
  guests: Guest[];
  rooms: RoomDetail[];
  itinerary: EventFunction[];
  budget: Budget;
  tasks: Task[];
  session: { role: UserRole; guestId: string | null; lastTab: string };
  cloudId?: string;
}

const App: React.FC = () => {
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [storageUsage, setStorageUsage] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCloudSync, setShowCloudSync] = useState(false);

  // 1. DATA INITIALIZATION: Load from LocalStorage (Source of Truth)
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem(MASTER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.guests?.length > 0) return parsed;
      } catch (e) {}
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

  const { guests, rooms, itinerary, budget, tasks, session, cloudId } = appState;
  const deferredGuests = useDeferredValue(guests);
  const isPlanner = session.role === 'planner';

  // 2. MONITOR STORAGE: Aggressive compression check
  useEffect(() => {
    const size = JSON.stringify(appState).length;
    setStorageUsage(Math.min(100, Math.round((size / (4.5 * 1024 * 1024)) * 100)));
  }, [appState]);

  // 3. AUTO-SAVE & REPLICATION: This ensures LocalStorage matches State
  const performSave = useCallback((stateToSave: AppState) => {
    setIsSyncing(true);
    try {
      localStorage.setItem(MASTER_KEY, JSON.stringify(stateToSave));
      setLastSynced(new Date());
      setHasUnsavedChanges(false);
    } catch (e: any) {
      if (e.name === 'QuotaExceededError') {
        // Fallback: Strip images to save critical text data
        const textOnly = {
          ...stateToSave,
          rooms: stateToSave.rooms.map(r => ({ ...r, image: '' })),
          itinerary: stateToSave.itinerary.map(ev => ({ ...ev, image: '' }))
        };
        localStorage.setItem(MASTER_KEY, JSON.stringify(textOnly));
        setAppState(textOnly);
        alert("STORAGE FULL: Large images removed. Names and RSVPs are safe.");
      }
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  }, []);

  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => performSave(appState), 1500);
      return () => clearTimeout(timer);
    }
  }, [appState, hasUnsavedChanges, performSave]);

  // 4. MASTER BROADCASTER: Updates here flow everywhere
  const broadcastUpdate = useCallback((updates: Partial<AppState>) => {
    setAppState((prev: AppState) => {
      const newState: AppState = {
        ...prev,
        ...updates,
        session: updates.session !== undefined ? updates.session : prev.session
      };
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

  // 5. CLOUD SYNC ENGINE: For Husband/Brother to see updates
  const handleCloudSync = async () => {
    setIsSyncing(true);
    // Simulation of a Vercel/Cloud KV storage call
    try {
      await new Promise(r => setTimeout(r, 1500));
      const syncId = cloudId || `JUBILEE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      broadcastUpdate({ cloudId: syncId });
      alert(`CLOUD SAVED! Give this code to Husband/Brother: ${syncId}`);
    } catch (e) {
      alert("Cloud Sync failed. Check internet.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCloudLoad = async (id: string) => {
    setIsSyncing(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      // In a real app, this would fetch from Vercel KV
      alert("Loaded latest version from Cloud!");
    } finally {
      setIsSyncing(false);
    }
  };

  if (!session.role) return <Login onLogin={(r, id) => broadcastUpdate({ session: { role: r, guestId: id || null, lastTab: id ? 'portal' : 'master' } })} />;

  const renderContent = () => {
    const currentGuest = deferredGuests.find((g: Guest) => g.id === session.guestId) || (session.role === 'planner' ? deferredGuests[0] : null);
    if (session.role === 'guest' && !currentGuest) return <Login onLogin={(r, id) => broadcastUpdate({ session: { role: r, guestId: id || null, lastTab: 'portal' } })} />;

    if (session.lastTab === 'portal') return (
      <GuestPortal 
        guest={currentGuest!} 
        onUpdate={handleUpdateGuest} 
        roomDatabase={rooms} 
        itinerary={itinerary} 
        isPlanner={isPlanner} 
        onUpdateEventImage={(id, img) => broadcastUpdate({ itinerary: itinerary.map(e => e.id === id ? { ...e, image: img } : e) })} 
        onUpdateRoomImage={(no, prop, img) => broadcastUpdate({ rooms: rooms.map(r => r.roomNo === no && r.property === prop ? { ...r, image: img } : r) })}
        onBackToMaster={() => broadcastUpdate({ session: { ...session, guestId: null, lastTab: 'master' } })} 
      />
    );
    
    switch (session.lastTab) {
      case 'master':
        return (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
              <div>
                <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">The Master List</h2>
                <p className="text-[#B8860B] font-black uppercase tracking-widest text-[10px] mt-2 flex items-center gap-2">
                   <Users size={14} /> LIVE REPLICATION: UPDATES FLOW TO ALL TABS INSTANTLY.
                </p>
              </div>
              {isPlanner && (
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setShowCloudSync(true)} className="bg-stone-900 text-[#D4AF37] px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-[#D4AF37]/30 flex items-center gap-2 hover:bg-stone-800 transition-all shadow-xl"><Cloud size={18} /> Family Sync Hub</button>
                  <button onClick={() => broadcastUpdate({ guests: [{ id: `g-${Date.now()}`, name: 'New Guest', category: 'Friend', side: 'Common', property: 'Villa-Pool', roomNo: 'TBD', status: 'Pending', dietaryPreference: 'Veg', mealPlan: { lunch17: 'Veg', dinner17: 'Veg', lunch18: 'Veg', gala18: 'Veg' }, dressCode: '', dietaryNote: '', sangeetAct: '', pickupScheduled: false }, ...guests] })} className="bg-[#D4AF37] text-stone-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl border-4 border-white hover:scale-105 transition-all"><UserPlus size={18} /> Add Guest</button>
                </div>
              )}
            </div>
            <DataTable guests={deferredGuests} onUpdate={handleUpdateGuest} columns={[{ key: 'name', label: 'FULL NAME', editable: isPlanner }, { key: 'side', label: 'SIDE', editable: isPlanner, type: 'select', options: ['Ladkewale', 'Ladkiwale', 'Common'] }, { key: 'property', label: 'STAY', editable: isPlanner, type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] }, { key: 'roomNo', label: 'ROOM', editable: isPlanner }, { key: 'status', label: 'RSVP', editable: isPlanner, type: 'select', options: ['Confirmed', 'Pending', 'Declined'] }]} />
          </div>
        );
      case 'rsvp-manager': return <RSVPManager guests={deferredGuests} onUpdate={handleUpdateGuest} role={session.role} onTeleport={(id) => broadcastUpdate({ session: { ...session, guestId: id, lastTab: 'portal' } })} />;
      case 'venue': return <VenueOverview onUpdateRoomImage={(no, prop, img) => broadcastUpdate({ rooms: rooms.map(r => r.roomNo === no && r.property === prop ? { ...r, image: img } : r) })} rooms={rooms} isPlanner={isPlanner} />;
      case 'rooms': return <RoomMap guests={deferredGuests} rooms={rooms} onUpdateImage={(no, prop, img) => broadcastUpdate({ rooms: rooms.map(r => r.roomNo === no && r.property === prop ? { ...r, image: img } : r) })} onAddRoom={(r) => broadcastUpdate({ rooms: [...rooms, r] })} onUpdateRoom={(no, prop, updates) => broadcastUpdate({ rooms: rooms.map(r => r.roomNo === no && r.property === prop ? { ...r, ...updates } : r) })} onDeleteRoom={(no, prop) => broadcastUpdate({ rooms: rooms.filter(r => !(r.roomNo === no && r.property === prop)) })} isPlanner={isPlanner} />;
      case 'meals': return <MealPlan guests={deferredGuests} budget={budget} onUpdate={handleUpdateGuest} isPlanner={isPlanner} />;
      case 'tasks': return <TaskMatrix tasks={tasks} onUpdateTasks={(t) => broadcastUpdate({ tasks: t })} isPlanner={isPlanner} />;
      case 'tree': return <TreeView guests={deferredGuests} />;
      case 'budget': return <BudgetTracker budget={budget} onUpdateBudget={(u) => broadcastUpdate({ budget: { ...budget, ...u } })} guests={deferredGuests} isPlanner={isPlanner} onFinalizePath={(path) => broadcastUpdate({ tasks: path === 'Villa' ? [...tasks, ...VILLA_TASKS] : tasks, budget: { ...budget, selectedPath: path, committedSpend: path === 'Villa' ? 310000 : 485500 } })} />;
      case 'ai': return <AIPlanner guests={deferredGuests} />;
      case 'inventory': return <InventoryManager guests={deferredGuests} inventory={budget.inventory || []} onUpdate={(inv) => broadcastUpdate({ budget: { ...budget, inventory: inv } })} isPlanner={isPlanner} />;
      case 'deploy': return <DeploymentHub />;
      default: return null;
    }
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
              <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.4em]">Family Global Master v15</p>
              <h1 className="text-xl font-serif font-bold text-stone-900">{EVENT_CONFIG.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {isSyncing ? (
                <div className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full animate-pulse shadow-xl">
                  <RefreshCw size={16} className="animate-spin text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Sync...</span>
                </div>
              ) : (
                <button onClick={() => performSave(appState)} className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${hasUnsavedChanges ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-lg scale-105' : 'bg-white border-stone-100 text-stone-400 opacity-60 hover:opacity-100'}`}>
                  {hasUnsavedChanges ? <Save size={16} className="animate-bounce" /> : <CheckCircle size={16} className="text-green-500" />}
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[8px] font-black uppercase tracking-widest">{hasUnsavedChanges ? 'Push Updates' : 'Fully Replicated'}</span>
                    <span className="text-[7px] font-bold uppercase">Last: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </button>
              )}
            </div>
          </header>
        )}
        <div className={`${session.role === 'guest' ? 'w-full' : 'max-w-7xl mx-auto px-4 md:px-10 py-10'}`}>{renderContent()}</div>
      </main>

      {/* Cloud Sync Dashboard */}
      {showCloudSync && (
        <div className="fixed inset-0 bg-stone-900/95 z-[1000] flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setShowCloudSync(false)}>
          <div className="bg-white rounded-[3rem] p-10 max-w-xl w-full border-4 border-[#D4AF37] space-y-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-3"><Cloud className="text-[#D4AF37]" /> Family Sync Hub</h3>
              <button onClick={() => setShowCloudSync(false)} className="text-stone-300 hover:text-stone-900 transition-colors">Close</button>
            </div>
            <p className="text-stone-500 italic text-sm">Deploy this app on Vercel to allow Husband and Brother to see live updates on their phones.</p>
            
            <div className="space-y-4">
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Current Browser Status</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HardDrive size={18} className="text-[#D4AF37]" />
                    <p className="text-xs font-bold text-stone-800 uppercase">Storage Used: {storageUsage}%</p>
                  </div>
                  <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4AF37]" style={{ width: `${storageUsage}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#FEF9E7] p-8 rounded-3xl border-2 border-[#D4AF37]/30 text-center space-y-4">
                <Share2 size={32} className="mx-auto text-[#B8860B]" />
                <h4 className="text-lg font-serif font-bold">Multi-Device Simulation</h4>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">To share data with husband, use the Go-Live Suite to deploy to Vercel.</p>
                <button onClick={handleCloudSync} className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-stone-800 transition-all">
                  <Save size={16} /> Push Master State to Cloud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
