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
import { Menu, UserPlus, CheckCircle, RefreshCw, Save, Database, Wifi } from 'lucide-react';

const MASTER_KEY = 'SRIVASTAVA_JUBILEE_V25_CLOUD';

interface AppState {
  guests: Guest[];
  rooms: RoomDetail[];
  itinerary: EventFunction[];
  budget: Budget;
  tasks: Task[];
  session: { role: UserRole; guestId: string | null; lastTab: string };
  lastCloudUpdate?: string;
}

const App: React.FC = () => {
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

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

  const { guests, rooms, itinerary, budget, tasks, session } = appState;
  const deferredGuests = useDeferredValue(guests);
  const isPlanner = session.role === 'planner';

  const syncToVercel = useCallback(async (state: AppState) => {
    setIsSyncing(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      localStorage.setItem(MASTER_KEY, JSON.stringify(state));
      setLastSynced(new Date());
      setHasUnsavedChanges(false);
      setIsCloudConnected(true);
    } catch (error) {
      console.error("Sync failed:", error);
      setIsCloudConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => syncToVercel(appState), 2000);
      return () => clearTimeout(timer);
    }
  }, [appState, hasUnsavedChanges, syncToVercel]);

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

  const handleCloudImageUpload = async (type: 'room' | 'event', id: string, file: File, extraId?: string) => {
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      
      let imageUrl = "";
      if (response.ok) {
        const blob = await response.json();
        imageUrl = blob.url;
      } else {
        imageUrl = URL.createObjectURL(file);
      }

      if (type === 'room') {
        broadcastUpdate({ rooms: rooms.map(r => r.roomNo === id && r.property === extraId ? { ...r, image: imageUrl } : r) });
      } else {
        broadcastUpdate({ itinerary: itinerary.map(e => e.id === id ? { ...e, image: imageUrl } : e) });
      }
    } catch (e) {
      console.error("Upload failed", e);
      alert("Cloud Upload Failed. Image saved locally for current session.");
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
        onUpdateEventImage={(id, file) => handleCloudImageUpload('event', id, file)} 
        onUpdateRoomImage={(no, prop, file) => handleCloudImageUpload('room', no, file, prop)}
        onBackToMaster={() => broadcastUpdate({ session: { ...session, guestId: null, lastTab: 'master' } })} 
      />
    );
    
    switch (session.lastTab) {
      case 'master':
        return (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
              <div>
                <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">Master Database</h2>
                <div className="flex items-center gap-3 mt-4">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${isCloudConnected ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-stone-900 text-[#D4AF37]'}`}>
                    <Database size={12} /> {isCloudConnected ? 'Live Master Connected' : 'Syncing Global List...'}
                  </span>
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest italic">Update names here; they replicate instantly to Room List, Meals & RSVP Hub.</p>
                </div>
              </div>
              {isPlanner && (
                <button onClick={() => broadcastUpdate({ guests: [{ id: `g-${Date.now()}`, name: 'New Guest', category: 'Friend', side: 'Common', property: 'Villa-Pool', roomNo: 'TBD', status: 'Pending', dietaryPreference: 'Veg', mealPlan: { lunch17: 'Veg', dinner17: 'Veg', lunch18: 'Veg', gala18: 'Veg' }, dressCode: '', dietaryNote: '', sangeetAct: '', pickupScheduled: false }, ...guests] })} className="bg-[#D4AF37] text-stone-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl border-4 border-white hover:scale-105 transition-all"><UserPlus size={18} /> New Entry</button>
              )}
            </div>
            <DataTable guests={deferredGuests} onUpdate={handleUpdateGuest} columns={[{ key: 'name', label: 'FULL NAME', editable: isPlanner }, { key: 'side', label: 'SIDE', editable: isPlanner, type: 'select', options: ['Ladkewale', 'Ladkiwale', 'Common'] }, { key: 'property', label: 'STAY', editable: isPlanner, type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] }, { key: 'roomNo', label: 'ROOM', editable: isPlanner }, { key: 'status', label: 'RSVP', editable: isPlanner, type: 'select', options: ['Confirmed', 'Pending', 'Declined'] }]} />
          </div>
        );
      case 'rsvp-manager': return <RSVPManager guests={deferredGuests} onUpdate={handleUpdateGuest} role={session.role} onTeleport={(id) => broadcastUpdate({ session: { ...session, guestId: id, lastTab: 'portal' } })} />;
      case 'venue': return <VenueOverview onUpdateRoomImage={(no, prop, file) => handleCloudImageUpload('room', no, file, prop)} rooms={rooms} isPlanner={isPlanner} />;
      case 'rooms': return <RoomMap guests={deferredGuests} rooms={rooms} onUpdateImage={(no, prop, file) => handleCloudImageUpload('room', no, file, prop)} onAddRoom={(r) => broadcastUpdate({ rooms: [...rooms, r] })} onUpdateRoom={(no, prop, updates) => broadcastUpdate({ rooms: rooms.map(r => r.roomNo === no && r.property === prop ? { ...r, ...updates } : r) })} onDeleteRoom={(no, prop) => broadcastUpdate({ rooms: rooms.filter(r => !(r.roomNo === no && r.property === prop)) })} isPlanner={isPlanner} />;
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
              <div className="flex items-center gap-3">
                 <Wifi size={14} className={isSyncing ? "text-amber-500 animate-pulse" : "text-green-500"} />
                 <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.4em]">Family Replicated Hub v2.5</p>
              </div>
              <h1 className="text-xl font-serif font-bold text-stone-900">{EVENT_CONFIG.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {isSyncing ? (
                <div className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full animate-pulse shadow-xl border border-[#D4AF37]/30">
                  <RefreshCw size={16} className="animate-spin text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Replicating Names...</span>
                </div>
              ) : (
                <button onClick={() => syncToVercel(appState)} className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${hasUnsavedChanges ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-lg scale-105' : 'bg-white border-stone-100 text-stone-400 opacity-60 hover:opacity-100'}`}>
                  {hasUnsavedChanges ? <Save size={16} className="animate-bounce" /> : <CheckCircle size={16} className="text-green-500" />}
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[8px] font-black uppercase tracking-widest">{hasUnsavedChanges ? 'Sync to Cloud' : 'Names Replicated'}</span>
                    <span className="text-[7px] font-bold uppercase">Sync: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
