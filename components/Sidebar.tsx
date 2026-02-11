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
  LogOut,
  ListTodo,
  Heart
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
  const isPlanner = role === 'planner';

  const menuItems = [
    { id: 'master', label: 'Master List', icon: Users, plannerOnly: false },
    { id: 'rsvp-manager', label: 'RSVP Manager', icon: MailCheck, plannerOnly: true },
    { id: 'venue', label: 'Villa & Pool', icon: Map, plannerOnly: false },
    { id: 'rooms', label: 'Room Map', icon: Bed, plannerOnly: false },
    { id: 'meals', label: 'Meal Plan', icon: Utensils, plannerOnly: false },
    { id: 'tasks', label: 'Task Matrix', icon: ListTodo, plannerOnly: true },
    { id: 'tree', label: 'Interactive Tree', icon: GitBranch, plannerOnly: false },
    { id: 'budget', label: 'Budget Tracker', icon: IndianRupee, plannerOnly: true },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles, plannerOnly: true },
    { id: 'portal', label: 'View Invitation', icon: LayoutDashboard, plannerOnly: false },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-stone-900/60 z-[60] lg:hidden backdrop-blur-md animate-in fade-in" onClick={onClose} />
      )}

      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-[#1a1a1a] text-white z-[70] transition-transform duration-500 ease-out flex flex-col border-r border-[#D4AF37]/20
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-10 border-b border-[#D4AF37]/10 relative overflow-hidden group">
          <Heart className="absolute -right-6 -bottom-6 text-[#D4AF37]/5 group-hover:scale-125 transition-transform duration-1000" size={120} />
          <h1 className="text-xl font-serif font-bold text-[#D4AF37] tracking-tight relative z-10 leading-snug">
            {EVENT_CONFIG.title}
          </h1>
          <p className="text-[9px] text-[#B8860B] mt-2 uppercase tracking-[0.3em] font-black relative z-10">
            {isPlanner ? 'Organizer Hub' : 'Guest Preview'}
          </p>
          <button onClick={onClose} className="lg:hidden absolute top-6 right-6 text-[#D4AF37]/40 hover:text-[#D4AF37]">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1.5 flex-grow mt-6 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = item.plannerOnly && !isPlanner;
            
            return (
              <button
                key={item.id}
                onClick={() => !isLocked && setActiveTab(item.id as AppTab)}
                disabled={isLocked}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all relative overflow-hidden group ${
                  isActive 
                    ? 'bg-[#D4AF37] text-stone-900 font-bold shadow-[0_10px_20px_rgba(212,175,55,0.2)] scale-[1.02]' 
                    : isLocked 
                      ? 'text-stone-700 cursor-not-allowed grayscale' 
                      : 'text-stone-400 hover:text-[#D4AF37] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={18} className={isActive ? 'text-stone-900' : 'group-hover:scale-110 transition-transform'} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
                {isLocked && <Lock size={12} className="text-stone-800" />}
              </button>
            );
          })}
        </nav>
        
        <div className="p-6 space-y-3 mt-auto border-t border-[#D4AF37]/10 bg-black/20">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-stone-500 hover:text-red-400 hover:bg-red-400/5 transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest">Logout</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;