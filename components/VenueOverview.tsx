
import React from 'react';
import { MapPin, Wind, Waves, Building2, Hotel, Calendar, ShieldCheck, Maximize, TreePine, AlertCircle } from 'lucide-react';

const VenueOverview: React.FC = () => {
  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Property 1: Poolside Villa */}
      <section className="space-y-6">
        <div className="relative h-[300px] md:h-[450px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl group border-4 md:border-8 border-white">
          <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Villa A" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/10 to-transparent flex items-end p-6 md:p-16">
            <div className="max-w-2xl">
              <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">Estate Hub</span>
              <h2 className="text-3xl md:text-6xl font-serif font-bold text-white mb-2 leading-tight">Villa A: Poolside</h2>
              <p className="text-stone-300 text-sm md:text-xl font-light leading-relaxed hidden sm:block">The heart of our celebration. Featuring heritage rocking chairs and verandas for morning tea.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Property 2: Red Hall Villa */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
        <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl min-h-[300px]">
          <img src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Villa B" />
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg">
            <Building2 size={14} /> Red Heritage Villa
          </div>
        </div>
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-stone-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-2xl flex items-center justify-center">
              <Maximize className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl md:text-3xl font-serif font-bold text-stone-900 leading-tight">Grand Indoor Hall</h3>
              <p className="text-stone-400 font-bold uppercase text-[9px] tracking-widest">Sangeet Hub</p>
            </div>
          </div>
          <p className="text-stone-600 text-sm md:text-lg mb-6 leading-relaxed">
            Stunning Red Heritage House designated for indoor family gatherings and late-night rehearsals.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {['Indoor Chill Zones', 'Heritage Balconies', '5 Luxury Suites'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs font-bold text-stone-800 uppercase tracking-tight">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property 3: TreeHouse Nova */}
      <section className="flex flex-col lg:flex-row gap-6 md:gap-10">
        <div className="lg:w-2/3 bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-stone-200 flex flex-col md:flex-row shadow-lg">
          <div className="md:w-1/2 h-48 md:h-auto">
            <img src="https://images.unsplash.com/photo-1445013032360-91f0d0d3c64e?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="TreeHouse Nova" />
          </div>
          <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-green-600 font-black text-[9px] uppercase tracking-widest mb-4">
              <TreePine size={14} /> Boutique Stay
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-3">TreeHouse Nova</h3>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed mb-6">
              Boutique rooms in Cansaulim. Ideal for a quieter stay near the beach.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-stone-500 uppercase tracking-tight">
                <ShieldCheck size={14} className="text-green-500" /> Breakfast Included
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-stone-500 uppercase tracking-tight">
                <AlertCircle size={14} className="text-amber-500" /> Ala Carte Dining
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 bg-amber-50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col justify-center border border-amber-100">
          <p className="text-xs text-amber-900 leading-relaxed italic mb-4">
            "Recommended for accommodation only due to Ala Carte complexity."
          </p>
          <div className="bg-white p-4 rounded-2xl border border-amber-100">
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Base Rate</span>
            <div className="text-xl font-black text-stone-900">₹3,000 <span className="text-[10px] text-stone-400">+ TAX</span></div>
          </div>
        </div>
      </section>

      {/* Property 4: Marinha Dourada */}
      <section className="bg-stone-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <Hotel className="text-amber-500" size={32} />
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight">Marinha Dourada Partnership</h3>
          </div>
          <p className="text-stone-400 text-base md:text-xl mb-8 md:mb-12 font-light leading-relaxed">
            Complementing our villa stay with 22 Deluxe Rooms and a fully equipped AC Banquet Hall.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-6 md:p-8 bg-stone-800/50 rounded-[2rem] border border-stone-700">
              <Maximize className="text-amber-500 mb-4" size={24} />
              <h4 className="text-lg font-bold mb-2">Banquet Hall</h4>
              <p className="text-stone-400 text-xs md:text-sm">Ideal for the formal Gala Dinner. 10:00 PM music deadline applies.</p>
            </div>
            <div className="p-6 md:p-8 bg-stone-800/50 rounded-[2rem] border border-stone-700">
              <Calendar className="text-amber-500 mb-4" size={24} />
              <h4 className="text-lg font-bold mb-2">Deluxe Stays</h4>
              <p className="text-stone-400 text-xs md:text-sm">Overflow accommodation for friends at special corporate rates.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VenueOverview;
