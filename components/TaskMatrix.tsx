import React from 'react';
import { Task, TaskOwner } from '../types';
import { ListTodo, User, CheckCircle, Clock, Hammer, ShieldCheck, ChevronRight, UserCircle2, ArrowRight, UserSquare2, Zap, Smartphone, Plane } from 'lucide-react';

interface TaskMatrixProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  isPlanner: boolean;
}

const TaskMatrix: React.FC<TaskMatrixProps> = ({ tasks, onUpdateTasks, isPlanner }) => {
  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    onUpdateTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const owners: TaskOwner[] = ['Husband', 'Brother', 'Planner', 'TBD'];

  // Professional mapping for Ground Leads
  const leads = [
    { 
      id: 'Husband', 
      label: 'Logistics Lead', 
      initial: 'HB', 
      desc: 'Financials & Transport', 
      tasks: ['Dabolim Pickup Sync', 'Vendor Final Payments', 'Flight Coordination'],
      color: 'bg-blue-600'
    },
    { 
      id: 'Brother', 
      label: 'Production Lead', 
      initial: 'YB', 
      desc: 'Ground Ops & Sound', 
      tasks: ['DJ Savio Soundcheck', 'Haldi Decor Sync', 'LED Floor Setup'],
      color: 'bg-orange-600'
    },
    { 
      id: 'Planner', 
      label: 'Ops & Experience', 
      initial: 'ME', 
      desc: 'Guest Concierge', 
      tasks: ['Room Assignment Sync', 'Patrika Flow', 'Meal Approvals'],
      color: 'bg-[#D4AF37]'
    }
  ];

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div>
          <h2 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 leading-tight tracking-tight">Coordination <br/><span className="text-[#B8860B]">Matrix</span></h2>
          <p className="text-stone-500 text-lg italic mt-3">Strategic delegation between the core team Leads.</p>
        </div>
        <div className="bg-stone-900 text-white p-8 rounded-3xl border-2 border-[#D4AF37] shadow-xl flex items-center gap-8">
           <div className="text-center border-r border-white/10 pr-8">
              <p className="text-[9px] font-black uppercase text-[#D4AF37] mb-1">Personnel</p>
              <div className="flex -space-x-3 mt-2">
                 {leads.map(l => (
                   <div key={l.id} className={`w-10 h-10 rounded-full border-4 border-stone-900 flex items-center justify-center text-[9px] font-black text-white ${l.color}`}>
                      {l.initial}
                   </div>
                 ))}
              </div>
           </div>
           <div className="text-center">
              <p className="text-[9px] font-black uppercase text-[#D4AF37] mb-1">Efficiency</p>
              <p className="text-2xl font-serif font-bold">{tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0}%</p>
           </div>
        </div>
      </div>

      {/* Leads Duty Briefing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {leads.map((l) => (
           <div key={l.id} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-8 group hover:scale-[1.02] transition-all relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 ${l.color} opacity-[0.03] rounded-bl-full`}></div>
              <div className="flex items-center gap-4">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${l.color} shadow-lg`}>
                    <ShieldCheck size={28} />
                 </div>
                 <div>
                    <h4 className="text-xl font-serif font-bold text-stone-900">{l.label}</h4>
                    <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest">{l.id === 'Planner' ? 'You' : l.id}</p>
                 </div>
              </div>
              <p className="text-stone-500 text-sm font-bold italic leading-relaxed">"{l.desc}"</p>
              <div className="space-y-4 pt-6 border-t border-stone-50">
                 {l.tasks.map((taskName, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-stone-200"></div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-stone-700">{taskName}</span>
                    </div>
                 ))}
              </div>
           </div>
         ))}
      </div>

      {/* The Master Task List */}
      <div className="bg-white rounded-[3.5rem] border border-stone-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#FCFAF2] text-stone-500 text-[10px] uppercase tracking-[0.3em] font-black">
              <tr>
                <th className="px-10 py-8">Operational Task</th>
                <th className="px-10 py-8">Lead Assignment</th>
                <th className="px-10 py-8 text-right">Progress Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-[#FCFAF2]/50 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-start gap-4 max-w-lg">
                       <div className={`mt-1 p-3 rounded-2xl ${task.title.includes('Pickup') ? 'bg-blue-50 text-blue-600' : task.vendorRef ? 'bg-amber-50 text-amber-600' : 'bg-stone-50 text-stone-400'}`}>
                          {task.title.includes('Pickup') ? <Plane size={20} /> : task.vendorRef ? <Zap size={20} /> : <ListTodo size={20} />}
                       </div>
                       <div className="flex flex-col">
                          <span className="font-bold text-stone-900 text-xl group-hover:text-[#B8860B] transition-colors">{task.title}</span>
                          <span className="text-sm text-stone-500 italic mt-1 font-light leading-relaxed">{task.description}</span>
                          {task.cost && (
                            <span className="mt-2 text-[8px] font-black uppercase tracking-widest bg-stone-900 text-[#D4AF37] px-3 py-1 rounded-full w-fit">Authorized: ₹{task.cost.toLocaleString()}</span>
                          )}
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {isPlanner ? (
                      <div className="flex items-center gap-3">
                        <select
                          className={`appearance-none bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer ${
                            task.owner === 'TBD' ? 'text-stone-300 italic' : 'text-stone-900'
                          }`}
                          value={task.owner}
                          onChange={(e) => handleUpdateTask(task.id, { owner: e.target.value as TaskOwner })}
                        >
                          {owners.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <UserSquare2 size={16} className="text-stone-300" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <UserCircle2 size={24} className="text-[#D4AF37]" />
                        <span className="text-sm font-black uppercase tracking-widest text-stone-900">{task.owner}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => handleUpdateTask(task.id, { status: task.status === 'Completed' ? 'Pending' : 'Completed' })}
                      className={`inline-flex items-center gap-3 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                        task.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-white text-stone-400 border-stone-100 hover:border-[#D4AF37]'
                      }`}
                    >
                      {task.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {task.status}
                    </button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-10 py-24 text-center space-y-4">
                     <Smartphone size={54} className="mx-auto text-stone-200" />
                     <p className="text-stone-400 italic text-lg">"Finalize your choice in the Budget tab to activate Ground Lead assignments."</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskMatrix;