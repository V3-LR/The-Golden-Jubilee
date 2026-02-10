
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Guest, AppTab, Budget, UserRole } from './types';
import { INITIAL_GUESTS, INITIAL_BUDGET, EVENT_CONFIG } from './constants';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';
import TreeView from './components/TreeView';
import BudgetTracker from './components/BudgetTracker';
import AIPlanner from './components/AIPlanner';
import VenueOverview from './components/VenueOverview';
import RoomMap from './components/RoomMap';
import Login from './components/Login';
import RSVPManager from './components/RSVPManager';
import RSVPForm from './components/RSVPForm';
import GuestPortal from './components/GuestPortal';
import DeploymentHub from './components/DeploymentHub';
import { Menu, Save, UserPlus, RefreshCw, ShieldCheck, Lock, CloudSync } from 'lucide-react';

const STORAGE_ID = 'GOLDEN_JUBILEE_V10_PRO';
const G_KEY = `${STORAGE_ID}_GUESTS`;
const S_KEY = `${STORAGE_ID}_SESSION`;

const App: React.FC = () => {
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. MASTER DATA: The single source of truth for the entire estate
  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem(G_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error("Disk Load Error", e); }
    }
    return INITIAL_GUESTS;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(S_KEY);
    if (saved) {
      try { return JSON.parse(saved).role; } catch (e) { return null; }
    }
    return null;
  });

  const [persistedGuestId, setPersistedGuestId] = useState<string | null>(() => {
    const saved = localStorage.getItem(S_KEY);
    if (saved) {
      try { return JSON.parse(saved).guestId; } catch (e) { return null; }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('master');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [budget, setBudget] = useState<Budget>(INITIAL_BUDGET);

  // 2. AUTO-SYNC: Ensures that updates to names like "Grandpa" persist instantly
  useEffect(() => {
    localStorage.setItem(G_KEY, JSON.stringify(guests));
  }, [guests]);

  const persistSession = (role: UserRole, guestId?: string) => {
    const session = { role, guestId: guestId || persistedGuestId };
    localStorage.setItem(S_KEY, JSON.stringify(session));
    setUserRole(role);
    if (guestId) setPersistedGuestId(guestId);
  };

  const handleLogout = () => {
    localStorage.removeItem(S_KEY);
    setUserRole(null);
    setPersistedGuestId(null);
    window.location.reload();
  };

  const handleTeleport = (guestId: string) => {
    setPersistedGuestId(guestId);
    setUserRole('guest');
    setActiveTab('portal');
    persistSession('guest', guestId);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleUpdateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setIsSyncing(true);
    setGuests((prev) => 
      prev.map((guest) => (guest.id === id ? { ...guest, ...updates } : guest))
    );
    // Subtle delay to show the sync happened
    setTimeout(() => setIsSyncing(false), 800);
  }, []);

  const handleAddGuest = () => {
    const newGuest: Guest = {
      id: `guest-${Date.now()}`,
      name: 'Enter New Name...',
      category: 'Family',
      side: 'Common',
      property: 'Resort',
      roomNo: 'TBD',
      dietaryNote: 'Standard',
      sangeetAct: 'TBD',
      pickupScheduled: false,
      status: 'Pending',
      dressCode: 'Gold/Ivory',
      mealPlan: { lunch17: 'Goan Buffet', dinner18: 'Royal Thali' }
    };
    setGuests(prev => [...prev, newGuest]);
  };

  const forceSync = () => {
    localStorage.setItem(G_KEY, JSON.stringify(guests));
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  if (!userRole) {
    return <Login onLogin={(role, guestId) => {
      if (role === 'guest' && guestId) handleTeleport(guestId);
      else persistSession(role);
    }} />;
  }

  const renderContent = () => {
    // Ensuring the Guest Portal always reflects the latest Master Name
    const currentGuest = guests.find(g => g.id === persistedGuestId) || guests[0]; 

    if (activeTab === 'portal') return <GuestPortal guest={currentGuest} />;
    
    if (activeTab === 'master') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B8860B]">Master Authority Controller</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">Master Database</h2>
              <p className="text-stone-500 text-sm italic mt-2">Any edit to 'Name' here propagates instantly to Room Maps and Portals.</p>
            </div>
            {userRole === 'planner' && (
              <button 
                onClick={handleAddGuest}
                className="flex items-center gap-3 bg-[#D4AF37] text-stone-900 px-8 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all"
              >
                <UserPlus size={18} /> Add Family Member
              </button>
            )}
          </div>
          <DataTable 
            guests={guests} 
            onUpdate={handleUpdateGuest}
            columns={[
              { key: 'name', label: 'HONORED NAME', editable: userRole === 'planner' },
              { key: 'side', label: 'Side', editable: userRole === 'planner', type: 'select', options: ['Ladkiwale', 'Ladkewale', 'Common'] },
              { key: 'property', label: 'Stay', editable: userRole === 'planner', type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] },
              { key: 'roomNo', label: 'Room #', editable: userRole === 'planner' },
              { key: 'status', label: 'RSVP Status', editable: userRole === 'planner', type: 'select', options: ['Confirmed', 'Pending', 'Declined'] },
            ]}
          />
        </div>
      );
    }
    if (activeTab === 'rsvp-manager') return <RSVPManager guests={guests} onUpdate={handleUpdateGuest} role={userRole} onTeleport={handleTeleport} />;
    if (activeTab === 'venue') return <VenueOverview />;
    if (activeTab === 'rooms') return <RoomMap guests={guests} />;
    if (activeTab === 'meals') return (
      <div className="space-y-6">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 px-1">Culinary Logistics</h2>
        <p className="text-stone-400 text-sm italic mb-4">Names are synced from the Master List to prevent dietary mixups.</p>
        <DataTable guests={guests} onUpdate={handleUpdateGuest} columns={[
          { key: 'name', label: 'Guest Name' },
          { key: 'dietaryNote', label: 'Dietary Preference', editable: userRole === 'planner' },
          { key: 'roomNo', label: 'Room' },
          { key: 'property', label: 'Property' },
        ]} />
      </div>
    );
    if (activeTab === 'tree') return <TreeView guests={guests} />;
    if (activeTab === 'budget') return <BudgetTracker budget={budget} onUpdateBudget={(u) => setBudget(p => ({...p, ...u}))} guests={guests} isPlanner={userRole === 'planner'} />;
    if (activeTab === 'ai') return <AIPlanner guests={guests} />;
    if (activeTab === 'deployment') return <DeploymentHub />;

    return <div className="p-20 text-center font-serif text-stone-400">Loading Estate Data...</div>;
  };

  return (
    <div className="min-h-screen bg-[#FEF9E7] flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        role={userRole} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-grow min-h-screen lg:ml-64 w-full">
        <header className="flex items-center justify-between p-4 md:px-10 md:py-8 sticky top-0 bg-[#FEF9E7]/95 backdrop-blur-xl z-[40] border-b border-[#D4AF37]/10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-[#B8860B]"><Menu size={20} /></button>
            <div className="flex flex-col">
              <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1 transition-colors ${isSyncing ? 'text-amber-500' : 'text-[#B8860B]'}`}>
                {isSyncing ? 'Syncing Network...' : 'Estate Sync Active'}
              </span>
              <h2 className="text-sm md:text-xl font-serif font-bold text-stone-900">{EVENT_CONFIG.title}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {saveIndicator ? (
              <div className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl animate-in zoom-in">
                <ShieldCheck size={16} className="text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Saved to Cloud</span>
              </div>
            ) : (
              <button 
                onClick={forceSync}
                className={`flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-full border-2 border-stone-100 shadow-xl hover:border-[#D4AF37] transition-all group ${isSyncing ? 'animate-pulse' : ''}`}
              >
                <Lock size={16} className="text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Master Save</span>
              </button>
            )}
            
            <button 
              onClick={handleLogout}
              className="p-3 bg-white border border-stone-100 rounded-xl text-stone-300 hover:text-[#B8860B] transition-all shadow-sm"
              title="Reset Session"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
