
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
import { Menu, UserPlus, CheckCircle, RefreshCw, Database, Users, Utensils, Save, LifeBuoy, AlertCircle, ShieldAlert, Trash2 } from 'lucide-react';

// STABLE KEY - 永久存储主键
const PERMANENT_KEY = 'SRIVASTAVA_GOLDEN_JUBILEE_MASTER_V5';
const SYNC_INTERVAL = 15000; 

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
  
  // 1. 深度救援引擎：扫描所有可能的历史版本
  const runDeepRescue = useCallback(() => {
    console.log("Deep Scan Initialized...");
    let bestFoundState: AppState | null = null;
    let maxRealNames = -1;

    const keys = Object.keys(localStorage);
    const possibleKeys = keys.filter(k => k.includes('SRIVASTAVA') || k.includes('ANNIVERSARY') || k.includes('JUBILEE'));

    possibleKeys.forEach(key => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as AppState;
          if (parsed && Array.isArray(parsed.guests)) {
            const realNames = parsed.guests.filter((g: any) => 
              g.name && !g.name.includes('Guest ') && g.name !== 'New Guest' && g.name !== 'Mummy' && g.name !== 'Papa'
            ).length;
            
            if (realNames > maxRealNames) {
              maxRealNames = realNames;
              bestFoundState = parsed;
            }
          }
        }
      } catch (e) { /* 忽略损坏的键 */ }
    });
    
    return bestFoundState;
  }, []);

  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem(PERMANENT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppState;
        if (parsed?.guests?.length > 0) return parsed;
      } catch (e) { console.error("Load Error", e); }
    }

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

  const handleManualRescue = () => {
    const found = runDeepRescue();
    if (found) {
      setAppState(prev => ({ ...found, session: prev.session }));
      setShowRescueSuccess(true);
      setHasUnsavedChanges(true);
      setTimeout(() => setShowRescueSuccess(false), 5000);
    } else {
      alert("深度扫描未发现任何旧数据。请确保您使用的是之前的浏览器。");
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
      if (e.name === 'QuotaExceededError' || e.message?.toLowerCase().includes('quota')) {
        setStorageError("存储已满：高清照片占用了太多空间。请使用下方按钮“清理照片”以找回名单数据。");
      } else {
        setStorageError("同步失败：无法保存数据。");
      }
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  }, []);

  // 紧急工具：清除照片以释放空间，保留名单
  const purgePhotos = () => {
    if (confirm("这将移除所有手动上传的照片以释放空间，但您的宾客名单、RSVP和备注将安全保留。是否继续？")) {
      const cleanItinerary = itinerary.map(e => ({ ...e, image: STATIC_ITINERARY.find(s => s.id === e.id)?.image || '' }));
      const cleanRooms = rooms.map(r => ({ ...r, image: STATIC_ROOMS.find(s => s.roomNo === r.roomNo)?.image || '' }));
      
      setAppState(prev => ({
        ...prev,
        itinerary: cleanItinerary,
        rooms: cleanRooms
      }));
      setHasUnsavedChanges(true);
      setStorageError(null);
    }
  };

  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeout = setTimeout(() => performSync(appState), 2000);
      return () => clearTimeout(timeout);
    }
  }, [appState, hasUnsavedChanges, performSync]);

  // 修复 TS2698 编译错误：通过显式对象映射
  const broadcastUpdate = useCallback((updatesOrFn: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => {
    setAppState((prev: AppState) => {
      const updates = typeof updatesOrFn === 'function' ? updatesOrFn(prev) : updatesOrFn;
      const newState: AppState = { ...prev, ...(updates as object) };
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
  }, []);

  if (!session.role) return <Login onLogin={(r, id) => broadcastUpdate({ session: { ...session, role: r, guestId: id || null, lastTab: id ? 'portal' : 'master' } })} />;

  // Combined content renderer for different tabs
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
        /* Fix: Correct parameters and structure for onUpdateRoomImage */
        onUpdateRoomImage={(roomNo, property, img) => broadcastUpdate(prev => ({ rooms: prev.rooms.map(r => r.roomNo === roomNo && r.property === property ? { ...r, image: img } : r) }))}
        onBackToMaster={() => broadcastUpdate({ session: { ...session, lastTab: 'master' } })}
      />
    );

    switch (session.lastTab) {
      case 'master':
        return (
          <DataTable 
            guests={deferredGuests} 
            onUpdate={handleUpdateGuest} 
            columns={[
              { key: 'name', label: 'Name', editable: true },
              { key: 'category', label: 'Type', editable: true, type: 'select', options: ['VIP', 'Family', 'Friend', 'Planner'] },
              { key: 'side', label: 'Side', editable: true, type: 'select', options: ['Ladkewale', 'Ladkiwale', 'Common'] },
              { key: 'status', label: 'Status', editable: true, type: 'select', options: ['Confirmed', 'Pending', 'Declined'] },
              { key: 'property', label: 'Property', editable: true, type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] },
              { key: 'roomNo', label: 'Room', editable: true }
            ]}
          />
        );
      case 'rsvp-manager':
        return <RSVPManager guests={deferredGuests} onUpdate={handleUpdateGuest} role={session.role} onTeleport={(id) => broadcastUpdate({ session: { ...session, guestId: id, lastTab: 'portal' } })} />;
      case 'venue':
        return <VenueOverview rooms={rooms} isPlanner={isPlanner} onUpdateRoomImage={(roomNo, property, img) => broadcastUpdate(prev => ({ rooms: prev.rooms.map(r => r.roomNo === roomNo && r.property === property ? { ...r, image: img } : r) }))} />;
      case 'rooms':
        return (
          <RoomMap 
            guests={deferredGuests} 
            rooms={rooms} 
            isPlanner={isPlanner} 
            onUpdateImage={(roomNo, property, img) => broadcastUpdate(prev => ({ rooms: prev.rooms.map(r => r.roomNo === roomNo && r.property === property ? { ...r, image: img } : r) }))}
            onAddRoom={(room) => broadcastUpdate(prev => ({ rooms: [...prev.rooms, room] }))}
            onUpdateRoom={(roomNo, property, updates) => broadcastUpdate(prev => ({ rooms: prev.rooms.map(r => r.roomNo === roomNo && r.property === property ? { ...r, ...updates } : r) }))}
            onDeleteRoom={(roomNo, property) => broadcastUpdate(prev => ({ rooms: prev.rooms.filter(r => !(r.roomNo === roomNo && r.property === property)) }))}
          />
        );
      case 'meals':
        return <MealPlan guests={deferredGuests} budget={budget} onUpdate={handleUpdateGuest} isPlanner={isPlanner} />;
      case 'inventory':
        return <InventoryManager guests={deferredGuests} inventory={budget.inventory || []} onUpdate={(inv) => broadcastUpdate({ budget: { ...budget, inventory: inv } })} isPlanner={isPlanner} />;
      case 'tasks':
        return <TaskMatrix tasks={tasks} onUpdateTasks={(newTasks) => broadcastUpdate({ tasks: newTasks })} isPlanner={isPlanner} />;
      case 'tree':
        return <TreeView guests={deferredGuests} />;
      case 'budget':
        return <BudgetTracker budget={budget} guests={deferredGuests} onUpdateBudget={(u) => broadcastUpdate({ budget: { ...budget, ...u } })} isPlanner={isPlanner} onFinalizePath={(path) => broadcastUpdate({ budget: { ...budget, selectedPath: path } })} />;
      case 'ai':
        return <AIPlanner guests={deferredGuests} />;
      default:
        return <div className="p-10 text-center text-stone-400 italic">Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar 
        activeTab={session.lastTab as AppTab} 
        setActiveTab={(t) => broadcastUpdate({ session: { ...session, lastTab: t } })} 
        role={session.role} 
        onLogout={() => broadcastUpdate({ session: { role: null, guestId: null, lastTab: 'master' } })}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-grow lg:ml-64 p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-stone-600">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            {isSyncing && <RefreshCw size={16} className="text-amber-600 animate-spin" />}
            {!isSyncing && !hasUnsavedChanges && <CheckCircle size={16} className="text-green-600" />}
            {hasUnsavedChanges && <RefreshCw size={16} className="text-stone-300" />}
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              Synced: {lastSynced.toLocaleTimeString()}
            </span>
          </div>
        </header>

        {storageError && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-between text-red-600">
            <div className="flex items-center gap-3">
              <ShieldAlert size={20} />
              <p className="text-xs font-bold uppercase tracking-widest">{storageError}</p>
            </div>
            <button onClick={purgePhotos} className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Cleanup Storage</button>
          </div>
        )}

        {showRescueSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-100 rounded-2xl flex items-center gap-3 text-green-600 animate-in slide-in-from-top-4">
            <Database size={20} />
            <p className="text-xs font-bold uppercase tracking-widest">Rescue Successful: Restored older data version.</p>
          </div>
        )}

        <div className="animate-in fade-in duration-500">
          {renderContent()}
        </div>
        
        {isPlanner && session.lastTab === 'master' && (
          <div className="fixed bottom-8 right-8 flex flex-col gap-3">
             <button 
              onClick={() => broadcastUpdate(prev => ({ guests: [...prev.guests, { id: `guest-${Date.now()}`, name: 'New Guest', category: 'Friend', side: 'Common', property: 'Villa-Pool', roomNo: '102', status: 'Pending', dietaryNote: 'Standard Veg', sangeetAct: 'TBD', pickupScheduled: false, dressCode: 'TBD', mealPlan: { lunch17: 'Veg', dinner17: 'Veg', lunch18: 'Veg', gala18: 'Veg' } }] }))}
              className="bg-stone-900 text-[#D4AF37] p-5 rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-white"
            >
              <UserPlus size={24} />
            </button>
            <button 
              onClick={handleManualRescue}
              className="bg-white text-stone-400 p-5 rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-stone-100 hover:text-amber-600"
              title="Emergency Deep Data Rescue"
            >
              <LifeBuoy size={24} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
