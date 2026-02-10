import React, { useState, useCallback, useEffect } from 'react';
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
import { Menu, ShieldCheck, Lock, UserPlus, EyeOff } from 'lucide-react';

const STORAGE_ID = 'GOLDEN_JUBILEE_V12_SYNC';
const G_KEY = `${STORAGE_ID}_GUESTS`;
const S_KEY = `${STORAGE_ID}_SESSION`;

const App: React.FC = () => {
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. DATA STATE
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

  const [activeGuestId, setActiveGuestId] = useState<string | null>(() => {
    const saved = localStorage.getItem(S_KEY);
    if (saved) {
      try { return JSON.parse(saved).guestId; } catch (e) { return null; }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    const saved = localStorage.getItem(S_KEY);
    if (saved) {
      try { return JSON.parse(saved).lastTab || 'master'; } catch (e) { return 'master'; }
    }
    return 'master';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [budget, setBudget] = useState<Budget>(INITIAL_BUDGET);

  // 2. SESSION SYNC
  useEffect(() => {
    if (userRole) {
      localStorage.setItem(S_KEY, JSON.stringify({ 
        role: userRole, 
        guestId: activeGuestId, 
        lastTab: activeTab 
      }));
    }
  }, [userRole, activeGuestId, activeTab]);

  // 3. MAGIC LINK HANDLING & PERSISTENCE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guestIdFromUrl = params.get('id');
    
    if (guestIdFromUrl) {
      const exists = guests.find(g => g.id === guestIdFromUrl);
      if (exists) {
        // If they are already a planner, keep them as planner but show guest view
        if (!userRole) {
          setUserRole('guest');
        }
        setActiveGuestId(guestIdFromUrl);
        setActiveTab('portal');
      }
    }
  }, [guests, userRole]);

  // Sync Guests to storage on every change
  useEffect(() => {
    localStorage.setItem(G_KEY, JSON.stringify(guests));
  }, [guests]);

  const handleUpdateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setIsSyncing(true);
    setGuests((prev) => 
      prev.map((guest) => (guest.id === id ? { ...guest, ...updates } : guest))
    );
    // Mimic cloud sync delay
    setTimeout(() => setIsSyncing(false), 400);
  }, []);

  const handleTeleport = (guestId: string) => {
    setActiveGuestId(guestId);
    setActiveTab('portal');
  };

  const handleLogout = () => {
    localStorage.removeItem(S_KEY);
    window.location.href = window.location.origin + window.location.pathname;
  };

  const handleAddGuest = () => {
    const newGuest: Guest = {
      id: `guest-${Date.now()}`,
      name: 'New Honored Guest',
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
    localStorage.setItem(G_KEY, JSON.stringify(guests));
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  if (!userRole) {
    return <Login onLogin={(role, guestId) => {
      setUserRole(role);
      if (guestId) {
        setActiveGuestId(guestId);
        setActiveTab('portal');
      } else {
        setActiveTab('master');
      }
    }} />;
  }

  const renderContent = () => {
    const currentGuest = guests.find(g => g.id === activeGuestId) || guests[0]; 

    if (activeTab === 'portal') {
      return (
        <div className="space-y-4">
          {userRole === 'planner' && (
            <div className="bg-stone-900 text-white p-4 rounded-[2rem] flex items-center justify-between border-2 border-[#D4AF37] shadow-2xl mb-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#D4AF37]" size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Planner Preview: <strong className="text-[#D4AF37]">{currentGuest.name}</strong></span>
              </div>
              <button 
                onClick={() => setActiveTab('master')}
                className="bg-[#D4AF37] text-stone-900 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-colors"
              >
                <EyeOff size={14} /> Back to Master Admin
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
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B]">Master Authority Controller</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">Master Database</h2>
              <p className="text-stone-500 text-sm italic">Changes here sync instantly to Room Maps, Meal Plans, and Guest Invites.</p>
            </div>
            {userRole === 'planner' && (
              <button 
                onClick={handleAddGuest}
                className="flex items-center gap-4 bg-[#D4AF37] text-stone-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
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
              { key: 'side', label: 'FAMILY SIDE', editable: userRole === 'planner', type: 'select', options: ['Ladkiwale', 'Ladkewale', 'Common'] },
              { key: 'property', label: 'STAY', editable: userRole === 'planner', type: 'select', options: ['Villa-Pool', 'Villa-Hall', 'Resort', 'TreeHouse'] },
              { key: 'roomNo', label: 'ROOM #', editable: userRole === 'planner' },
              { key: 'status', label: 'RSVP STATUS', editable: userRole === 'planner', type: 'select', options: ['Confirmed', 'Pending', 'Declined'] },
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

    return <div className="p-20 text-center font-serif text-stone-400">Loading Estate Data...</div>;
  };

  // Sidebar is hidden ONLY for real guests (no planner session)
  const showSidebar = userRole === 'planner';

  return (
    <div className={`min-h-screen bg-[#FCFAF2] flex flex-col lg:flex-row`}>
      {showSidebar && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
          role={userRole} 
          onLogout={handleLogout} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      
      <main className={`flex-grow min-h-screen w-full transition-all duration-500 ${showSidebar ? 'lg:ml-64' : ''}`}>
        {showSidebar && (
          <header className="flex items-center justify-between p-4 md:px-10 md:py-8 sticky top-0 bg-[#FCFAF2]/95 backdrop-blur-xl z-[40] border-b border-[#D4AF37]/10">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-[#B8860B] hover:scale-110 transition-transform"><Menu size={24} /></button>
              <div className="flex flex-col">
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1 transition-colors ${isSyncing ? 'text-amber-500' : 'text-[#B8860B]'}`}>
                  {isSyncing ? 'Synchronizing Network...' : 'Estate Sync Online'}
                </span>
                <h2 className="text-sm md:text-xl font-serif font-bold text-stone-900">{EVENT_CONFIG.title}</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {saveIndicator ? (
                <div className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl animate-in zoom-in duration-300">
                  <ShieldCheck size={16} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Storage Locked</span>
                </div>
              ) : (
                <button 
                  onClick={forceSync}
                  className={`flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-full border-2 border-stone-100 shadow-xl hover:border-[#D4AF37] transition-all group ${isSyncing ? 'animate-pulse' : ''}`}
                >
                  <Lock size={16} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Snapshot</span>
                </button>
              )}
            </div>
          </header>
        )}

        <div className={`${!showSidebar ? 'w-full' : 'max-w-7xl mx-auto px-4 md:px-10 py-10'}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;