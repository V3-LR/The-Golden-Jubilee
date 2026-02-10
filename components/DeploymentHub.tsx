
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
  MessageSquare
} from 'lucide-react';

const DeploymentHub: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <div className="px-1">
        <h2 className="text-3xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">The <span className="text-[#B8860B]">Go-Live</span> Suite</h2>
        <p className="text-stone-500 text-lg italic mt-4 max-w-2xl">
          Instructions to move this from a preview to a real website that "Grandpa" and all your guests can access on their phones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-6 relative overflow-hidden group">
          <div className="w-16 h-16 bg-stone-900 text-[#D4AF37] rounded-3xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
            <Github size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900">Step 1: Gitshub</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Create a repository on GitHub. Take all the files in this directory and upload them to your new repo.
          </p>
          <ul className="space-y-3 pt-4">
            {['Create GitHub Account', 'New Repository', 'Upload App Files'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-stone-400">
                <CheckCircle size={14} className="text-green-500" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-6 relative overflow-hidden group">
          <div className="w-16 h-16 bg-[#0070f3] text-white rounded-3xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
            <Rocket size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900">Step 2: Vercel</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Connect your GitHub to Vercel.com. They will host your website for free and give you a real link like <code className="bg-stone-100 px-1 rounded">jubilee.vercel.app</code>.
          </p>
          <ul className="space-y-3 pt-4">
            {['Link GitHub to Vercel', 'Import Jubilee Project', 'Set Domain Name'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-stone-400">
                <CheckCircle size={14} className="text-[#0070f3]" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-stone-900 p-10 rounded-[3rem] shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="w-16 h-16 bg-[#D4AF37] text-stone-900 rounded-3xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
            <Key size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">Step 3: AI Key</h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            In Vercel Settings, add an Environment Variable named <code className="bg-white/10 px-1 rounded text-[#D4AF37]">API_KEY</code>. Paste your Gemini key there.
          </p>
          <ul className="space-y-3 pt-4">
            {['Go to Project Settings', 'Add API_KEY variable', 'Deploy to Production'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-stone-500">
                <Lock size={14} className="text-[#D4AF37]" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#FEF9E7] border-4 border-[#D4AF37] p-10 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center text-[#D4AF37] shadow-2xl shrink-0">
            <Globe size={48} />
          </div>
          <div className="flex-grow space-y-6 text-center lg:text-left">
            <h4 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-tight tracking-tight">
              Why do this?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#B8860B] font-black text-[10px] uppercase tracking-widest">
                  <Smartphone size={16} /> Real Mobile Access
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Once deployed, the <strong>RSVP Links</strong> in your Manager will actually work on your guest's phones. They can fill their details from anywhere.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#B8860B] font-black text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={16} /> Data Security
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  The names you set for <strong>Grandpa</strong> will be stored on a real database instead of just your local browser's memory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 bg-white rounded-[3rem] border border-stone-200 text-center space-y-6">
        <AlertTriangle size={40} className="mx-auto text-amber-500" />
        <h4 className="text-2xl font-serif font-bold text-stone-900">Final Verification</h4>
        <p className="text-stone-500 text-sm max-w-xl mx-auto italic">
          "Before you deploy, verify your Master List one last time. Ensure the Room Numbers and Meal Plans for your VIPs are exactly how you want them to appear on their phone screens."
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-3 bg-stone-900 text-white px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl"
        >
          Final Sync Check <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DeploymentHub;
