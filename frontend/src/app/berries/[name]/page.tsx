import Link from 'next/link';
import { fetchBerryDetails } from '@/services/api';

export default async function BerryDetail({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  let berry;
  try {
    berry = await fetchBerryDetails(resolvedParams.name);
  } catch (e) {
    return (
      <div className="text-center py-20 text-rose-500">
        <h1 className="text-3xl font-bold">Berry not found</h1>
        <Link href="/berries" className="mt-4 inline-block text-pink-500 hover:underline">Return to Berries</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <Link href="/berries" className="inline-flex items-center text-pink-400 hover:text-pink-300 transition-colors">
        &larr; Return to Berries
      </Link>
      
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8">
        
        <div className="shrink-0 flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-slate-900/50 rounded-2xl border border-slate-700/50 flex items-center justify-center p-6 shadow-inner relative group">
            <div className="absolute inset-0 bg-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img 
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berry.name}-berry.png`} 
              alt={berry.name}
              className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          <span className="px-5 py-2 rounded-full bg-pink-500/20 border border-pink-500/50 text-pink-400 font-bold capitalize text-sm">
            Firmness: {berry.firmness.name.replace(/-/g, ' ')}
          </span>
        </div>

        <div className="flex-1 space-y-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-5xl font-extrabold capitalize text-white tracking-tight">{berry.name} Berry</h1>
            <p className="text-slate-400 font-medium">Growth Time: <span className="text-white">{berry.growth_time} hours per stage</span></p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-center">
              <p className="text-slate-400 text-xs mb-1">Max Harvest</p>
              <p className="text-2xl font-bold text-white">{berry.max_harvest}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-center">
              <p className="text-slate-400 text-xs mb-1">Size</p>
              <p className="text-2xl font-bold text-white">{berry.size} mm</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-center">
              <p className="text-slate-400 text-xs mb-1">Smoothness</p>
              <p className="text-2xl font-bold text-white">{berry.smoothness}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-center">
              <p className="text-slate-400 text-xs mb-1">Soil Dryness</p>
              <p className="text-2xl font-bold text-white">{berry.soil_dryness}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Flavor Profile</h3>
            <div className="space-y-3 bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
              {berry.flavors.map((f: any) => {
                const colors: Record<string, string> = {
                  spicy: 'bg-red-500',
                  dry: 'bg-blue-500',
                  sweet: 'bg-pink-500',
                  bitter: 'bg-green-500',
                  sour: 'bg-yellow-500'
                };
                return (
                  <div key={f.flavor.name} className="flex items-center gap-4">
                    <span className="w-16 text-sm font-semibold text-slate-300 capitalize">{f.flavor.name}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${colors[f.flavor.name] || 'bg-slate-400'}`} 
                        style={{ width: `${Math.min(100, (f.potency / 40) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right text-sm font-bold text-white">{f.potency}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
