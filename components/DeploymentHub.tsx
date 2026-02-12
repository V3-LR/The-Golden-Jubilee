import React from 'react';
import { 
  Globe, 
  Github, 
  Rocket, 
  Key, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  ShieldCheck,
  Smartphone,
  Database
} from 'lucide-react';

const DeploymentHub: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <div className="px-1">
        <h2 className="text-3xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">The <span className="text-[#B8860B]">Cloud</span> Deployment</h2>
        <p className="text-stone-500 text-lg italic mt-4 max-w-2xl">
          Move your master data from your computer to the Srivastava Cloud.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-6 relative overflow-hidden group">
          <div className="w-16 h-16 bg-stone-900 text-[#D4AF37] rounded-3xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
            <Github size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900">Step 1: Code</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Upload these files to your GitHub repository. Vercel will auto-detect the changes and build the site.
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-6 relative overflow-hidden group">
          <div className="w-16 h-16 bg-[#0070f3] text-white rounded-3xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
            <Database size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900">Step 2: Supabase</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Create a Supabase project. Create a bucket named <code className="bg-stone-100 px-1 rounded">images</code> and a table named <code className="bg-stone-100 px-1 rounded">plans</code>.
          </p>
        </div>

        <div className="bg-stone-900 p-10 rounded-[3rem] shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="w-16 h-16 bg-[#D4AF37] text-stone-900 rounded-3xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
            <Key size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">Step 3: Secrets</h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            In Vercel, add: <code className="bg-white/10 px-1 rounded text-[#D4AF37]">VITE_SUPABASE_URL</code>, <code className="bg-white/10 px-1 rounded text-[#D4AF37]">VITE_SUPABASE_ANON_KEY</code>, and <code className="bg-white/10 px-1 rounded text-[#D4AF37]">API_KEY</code>.
          </p>
        </div>
      </div>

      <div className="bg-[#FEF9E7] border-4 border-[#D4AF37] p-10 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center text-[#D4AF37] shadow-2xl shrink-0">
            <Globe size={48} />
          </div>
          <div className="flex-grow space-y-6 text-center lg:text-left">
            <h4 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-tight tracking-tight">
              Ready for Goa?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#B8860B] font-black text-[10px] uppercase tracking-widest">
                  <Smartphone size={16} /> RSVP Mobile Sync
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Your guests will open the site, RSVP on their phones, and you'll see the <strong>Master List</strong> update in real-time.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#B8860B] font-black text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={16} /> Persistent Storage
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  All names, room assignments, and meal plans are stored securely in Supabase. Refreshing the browser won't lose your work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentHub;