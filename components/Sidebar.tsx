
import React from 'react';
import { 
  Users, 
  Bed, 
  Utensils, 
  Music, 
  GitBranch, 
  IndianRupee, 
  Sparkles,
  Map,
  X,
  Share2,
  Trees,
  Lock,
  MailCheck,
  LayoutDashboard,
  Globe,
  Rocket
} from 'lucide-react';
import { AppTab, UserRole } from '../types';
import { EVENT_CONFIG } from '../constants';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  role: UserRole;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, onLogout, isOpen, onClose }) => {
  const menuItems = [
    { id: 'portal', label: 'My Dashboard', icon: LayoutDashboard, plannerOnly: false, guestOnly: true },
    { id: 'master', label: 'Master List', icon: Users, plannerOnly: false },
    { id: 'rsvp-manager', label: 'RSVP Manager', icon: MailCheck, plannerOnly: true },
    { id: 'venue', label: 'Villa & Pool', icon: Map, plannerOnly: false },
    { id: 'rooms', label: 'Room Map', icon: Bed, plannerOnly: false },
    { id: 'meals', label: 'Meal Plan', icon: Utensils, plannerOnly: false },
    { id: 'sangeet', label: 'Sangeet Acts', icon: Music, plannerOnly: false },
    { id: 'tree', label: 'Interactive Tree', icon: GitBranch, plannerOnly: false },
    { id: 'budget', label: 'Budget Tracker', icon: IndianRupee, plannerOnly: true },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles, plannerOnly: true },
    { id: 'deployment', label: 'Go Live (GitHub)', icon: Rocket, plannerOnly: true },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-stone-900/50 z-[60] lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-[#1a1a1a] text-white z-[70] transition-transform duration-300 flex flex-col border-r border-[#D4AF37]/20
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-[#D4AF37]/10 relative overflow-hidden group">
          <Trees className="absolute -right-4 -bottom-4 text-[#D4AF37]/10 group-hover:scale-110 transition-transform duration-1000" size={80} />
          <h1 className="text-2xl font-serif font-bold text-[#D4AF37] tracking-tight">{EVENT_CONFIG.theme}</h1>
          <p className="text-[10px] text-[#B8860B] mt-1 uppercase tracking-[0.2em] font-black">
            {role === 'planner' ? 'Master Control' : 'Guest Preview Mode'}
          </p>
          <button onClick={onClose} className="lg:hidden absolute top-4 right-4 text-stone-500">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-grow mt-6 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = item.plannerOnly && role !== 'planner';
            
            // Filter logic: guestOnly items only show for guests, others show for both unless plannerOnly
            if (item.guestOnly && role !== 'guest') return null;

            return (
              <button
                key={item.id}
                onClick={() => !isLocked && setActiveTab(item.id as AppTab)}
                disabled={isLocked}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all relative overflow-hidden ${
                  isActive 
                    ? 'bg-[#D4AF37] text-[#1a1a1a] font-bold shadow-lg scale-[1.02]' 
                    : isLocked 
                      ? 'text-stone-700 cursor-not-allowed grayscale' 
                      : 'text-stone-400 hover:text-[#D4AF37] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={18} className={isActive ? 'text-[#1a1a1a]' : ''} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </div>
                {isLocked && <Lock size={12} className="text-stone-800" />}
              </button>
            );
          })}
        </nav>
        
        <div className="p-6 space-y-3 mt-auto border-t border-[#D4AF37]/10">
          {role === 'planner' && (
            <button 
              onClick={() => {
                const text = `${EVENT_CONFIG.title} Access:\nFull Planner: ${EVENT_CONFIG.fullAccessCode}\nGuest Preview: ${EVENT_CONFIG.guestAccessCode}`;
                navigator.clipboard.writeText(text);
                alert("Access codes copied to clipboard!");
              }}
              className="w-full flex items-center justify-between p-4 bg-[#D4AF37]/5 text-[#D4AF37] rounded-2xl border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10 transition-all group"
            >
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Distribution</p>
                <p className="text-xs font-bold">Copy Guest Codes</p>
              </div>
              <Share2 size={16} />
            </button>
          )}
          
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className={`w-2 h-2 rounded-full ${role === 'planner' ? 'bg-[#D4AF37]' : 'bg-stone-500'}`}></div>
            <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest">{role?.toUpperCase()}</p>
            <button onClick={onLogout} className="ml-auto text-stone-500 hover:text-red-400 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
