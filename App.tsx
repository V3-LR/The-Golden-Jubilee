import React, { useState, useCallback, useEffect, useTransition, useDeferredValue } from 'react';
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
import GuestPortal from './components/GuestPortal';
import { Menu, ShieldCheck, UserPlus, EyeOff, CheckCircle, RefreshCw } from 'lucide-react';

/**
 * PERSISTENCE ARCHITECTURE V2
 * We use a stable key for all future versions.
 * If data is missing, we "scavenge" older keys.
 */
const STABLE_KEY = 'ESTATE_PLANNER_STABLE_V1';
const PREVIOUS_KEYS = [
  'GOLDEN_JUBILEE_V15_MASTER_GUESTS',
  'GOLDEN_JUBILEE_V14_SYNC_GUESTS',
  'GOLDEN_JUBILEE_V13_STABLE_GUESTS'
];
const SESSION_KEY = 'ESTATE_PLANNER_SESSION_STABLE';

const App: React.FC = () => {
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 1. DATA INITIALIZATION & MIGRATION ENGINE
  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem(STABLE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error("Stable Load Error", e); }
    }

    for (const oldKey of PREVIOUS_KEYS) {
      const oldData = localStorage.getItem(oldKey);
      if (oldData) {
        try {
          const parsed = JSON.parse(oldData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localStorage.setItem(STABLE_KEY, oldData);
            return parsed;
          }
        } catch (e) { /* silent fail */ }
      }
    }

    return INITIAL_GUESTS;
  });

  // Use deferred value for heavy rendering components to improve INP
  const deferredGuests = useDeferredValue(guests);

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try { return JSON.parse(saved).role; } catch (e) { return null; }
    }
    return null;
  });

  const [activeGuestId, setActiveGuestId] = useState<string | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try { return JSON.parse(saved).guestId; } catch (e) { return null; }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try { return JSON.parse(saved).lastTab || 'master'; } catch (e) { return 'master'; }
    }
    return 'master';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [budget, setBudget] = useState<Budget>(INITIAL_BUDGET);

  // 2. AUTOMATED PERSISTENCE EFFECTS
  useEffect(() => {
    if (userRole) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ 
        role: userRole, 
        guestId: activeGuestId, 
        lastTab: activeTab,
        lastActive: new Date().toISOString()
      }));
    }
  }, [userRole, activeGuestId, activeTab]);

  useEffect(() => {
    localStorage.setItem(STABLE_KEY, JSON.stringify(guests));
  }, [guests]);

  // 3. MASTER UPDATE HANDLER (REPLICATION ENGINE)
  const handleUpdateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setIsSyncing(true);
    setGuests((prev) => 
      prev.map((guest) => (guest.id === id ? { ...guest, ...updates } : guest))
    );
    setTimeout(() => setIsSyncing(false), 200);
  }, []);

  // Optimized Tab Switcher to prevent INP blocking
  const handleTabChange = useCallback((tab: AppTab) => {
    setIsSidebarOpen(false); // Immediate UI response
    startTransition(() => {
      setActiveTab(tab); // Concurrent background render
    });
  }, []);

  const handleTeleport = (guestId: string) => {
    setActiveGuestId(guestId);
    handleTabChange('portal');
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = window.location.origin + window.location.pathname;
  };

  const handleAddGuest = () => {
    const newGuest: Guest = {
      id: `guest-${Date.now()}`,
      name: 'Honored Guest Name',
      category: 'Family',
      side: 'Common',
      property: 'Resort',
      roomNo: 'TBD',
      dietaryNote: 'Standard',
      sangeetAct: 'TBD',
      pickupScheduled: false,
      status: 'Pending',
      dressCode: 'Indo-Western Glitz',
      mealPlan: { lunch17: 'Goan Buffet', dinner18: 'Royal Thali' }
    };
    setGuests(prev => [newGuest, ...prev]);
  };

  const forceSync = () => {
    setIsSyncing(true);
    localStorage.setItem(STABLE_KEY, JSON.stringify(guests));
    setSaveIndicator(true);
    setTimeout(() => {
      setSaveIndicator(false);
      setIsSyncing(false);
    }, 1500);
  };

  if (!userRole) {
    return <Login onLogin={(role, guestId) => {
      setUserRole(role);
      if (guestId) {
        setActiveGuestId(guestId);
        handleTabChange('portal');
      } else {
        handleTabChange('master');
      }
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
                <div className="p-2 bg-[#D4AF37]/20 rounded-xl">
                  <ShieldCheck className="text-[#D4AF37]" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]/60">Planner Authority</p>
                  <p className="text-sm font-bold">Impersonating Guest: <span className="text-[#D4AF37]">{currentGuest.name}</span></p>
                </div>
              </div>
              <button 
                onClick={() => handleTabChange('master')}
                className="w-full sm:w-auto bg-[#D4AF37] text-stone-900 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg"
              >
                <EyeOff size={16} /> Close Preview
              </button>
            </div>
          )}
          <GuestPortal guest={currentGuest} onUpdate={handleUpdateGuest} />
        </div>
      );
    }
    
    if (activeTab === 'master') {
      return (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B]">Core Authority Database</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">Master List</h2>
              <p className="text-stone-500 text-sm italic">Edit names here to update all maps, invitations, and meal logs across the app.</p>
            </div>
            {userRole === 'planner' && (
              <button 
                onClick={handleAddGuest}
                className="flex items-center gap-4 bg-[#D4AF37] text-stone-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                <UserPlus size={18} /> New Entry
              </button>
            )}
          </div>
          <DataTable 
            guests={deferredGuests} 
            onUpdate={handleUpdateGuest}
            columns={[
              { key: 'name', label: 'HONORED NAME', editable: userRole === 'planner' },
              { key: 'side', label: 'FAMILY SIDE', editable: userRole === 'planner', type: 'select', options: ['Ladkiwale', 'Ladkewale', 'Common'] },
              { key: 'paxCount', label: 'PAX', render: (g) => <span className="font-black text-stone-900">{g.paxCount || 1}</span> },
              { key: 'property', label: 'STAY', editable: userRole === 'planner', type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] },
              { key: 'roomNo', label: 'ROOM #', editable: userRole === 'planner' },
              { key: 'status', label: 'STATUS', editable: userRole === 'planner', type: 'select', options: ['Confirmed', 'Pending', 'Declined'] },
            ]}
          />
        </div>
      );
    }

    if (activeTab === 'rsvp-manager') return <RSVPManager guests={deferredGuests} onUpdate={handleUpdateGuest} role={userRole} onTeleport={handleTeleport} />;
    if (activeTab === 'venue') return <VenueOverview />;
    if (activeTab === 'rooms') return <RoomMap guests={deferredGuests} />;
    if (activeTab === 'meals') return (
      <div className="space-y-6">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 px-1">Culinary Log</h2>
        <DataTable guests={deferredGuests} onUpdate={handleUpdateGuest} columns={[
          { key: 'name', label: 'Guest Name' },
          { key: 'dietaryNote', label: 'Dietary Preference', editable: userRole === 'planner' },
          { key: 'roomNo', label: 'Room' },
          { key: 'property', label: 'Property' },
        ]} />
      </div>
    );
    if (activeTab === 'tree') return <TreeView guests={deferredGuests} />;
    if (activeTab === 'budget') return <BudgetTracker budget={budget} onUpdateBudget={(u) => setBudget(p => ({...p, ...u}))} guests={deferredGuests} isPlanner={userRole === 'planner'} />;
    if (activeTab === 'ai') return <AIPlanner guests={deferredGuests} />;

    return <div className="p-20 text-center font-serif text-stone-400">Loading Estate Data...</div>;
  };

  const isStrictGuest = userRole === 'guest';

  return (
    <div className={`min-h-screen bg-[#FCFAF2] flex flex-col lg:flex-row`}>
      {/* Golden Transition Progress Indicator */}
      {isPending && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent z-[200] animate-pulse pointer-events-none"></div>
      )}

      {!isStrictGuest && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          role={userRole} 
          onLogout={handleLogout} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      
      <main className={`flex-grow min-h-screen w-full transition-all duration-500 ${!isStrictGuest ? 'lg:ml-64' : ''}`}>
        {!isStrictGuest && (
          <header className="flex items-center justify-between p-4 md:px-10 md:py-8 sticky top-0 bg-[#FCFAF2]/95 backdrop-blur-xl z-[40] border-b border-[#D4AF37]/10">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-[#B8860B] hover:scale-110 transition-transform"><Menu size={24} /></button>
              <div className="flex flex-col">
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1 transition-colors ${isSyncing ? 'text-amber-500' : 'text-[#B8860B]'}`}>
                  {isSyncing ? 'Propagating Changes...' : 'Local Storage Secured'}
                </span>
                <h2 className="text-sm md:text-xl font-serif font-bold text-stone-900 uppercase tracking-tighter">{EVENT_CONFIG.title}</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {saveIndicator ? (
                <div className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl animate-in zoom-in duration-300">
                  <CheckCircle size={16} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Network Synced</span>
                </div>
              ) : (
                <button 
                  onClick={forceSync}
                  className={`flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-full border-2 border-stone-100 shadow-xl hover:border-[#D4AF37] transition-all group ${isSyncing ? 'animate-pulse' : ''}`}
                >
                  <RefreshCw size={16} className={`text-[#D4AF37] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Master Save</span>
                </button>
              )}
            </div>
          </header>
        )}

        <div className={`${isStrictGuest ? 'w-full' : 'max-w-7xl mx-auto px-4 md:px-10 py-10'} ${isPending ? 'opacity-70 grayscale-[0.3] pointer-events-none transition-all duration-300' : 'transition-all duration-300'}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;