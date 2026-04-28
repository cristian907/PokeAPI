import Link from 'next/link';
import { fetchMachineDetails } from '@/services/api';

export default async function MachineDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let item;
  let allVariations = [];

  try {
    // 1. Fetch the item (e.g. tm01)
    item = await fetchMachineDetails(resolvedParams.id);

    // 2. Fetch details of all machine variations in parallel
    if (item.machines && item.machines.length > 0) {
      const variationsPromises = item.machines.map((m: any) => 
        fetch(m.machine.url).then(r => r.json())
      );
      allVariations = await Promise.all(variationsPromises);
    }
    
  } catch (e) {
    return (
      <div className="text-center py-20 text-rose-500">
        <h1 className="text-3xl font-bold">Machine not found</h1>
        <Link href="/machines" className="mt-4 inline-block text-cyan-500 hover:underline">Return to Machines</Link>
      </div>
    );
  }

  // Get the default sprite provided by PokeAPI
  const spriteUrl = item.sprites?.default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <Link href="/machines" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
        &larr; Return to Machines
      </Link>
      
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8">
        <div className="shrink-0 flex flex-col items-center gap-4">
          <div className="w-40 h-40 bg-slate-900/50 rounded-2xl border border-slate-700/50 flex items-center justify-center p-4">
            <img 
              src={spriteUrl} 
              alt={item.name}
              className="w-full h-full object-contain drop-shadow-xl scale-150" 
            />
          </div>
          <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-semibold uppercase text-sm text-center">
            {item.name}
          </span>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-5xl font-extrabold uppercase text-white tracking-tight">{item.name}</h1>
            <p className="text-cyan-500 font-medium text-lg mt-2">
              Technical Machine / Hidden Machine
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl text-cyan-300 text-sm">
              <p>Machines (TMs/HMs/TRs) are items that teach specific moves to Pokémon. Because games change over time, <strong>{item.name.toUpperCase()}</strong> may teach completely different moves depending on the Generation or Version of the game you are playing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Variations by Game Table */}
      {allVariations.length > 0 ? (
        <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-cyan-400">⚡</span> Variations by Game
          </h2>
          
          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-800 text-xs uppercase text-slate-300 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Game Version</th>
                  <th className="px-6 py-4 font-semibold">Move Taught</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {allVariations.map((v: any) => (
                  <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 capitalize font-medium text-slate-300">
                      {v.version_group.name.replace(/-/g, ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/moves/${v.move.name}`} className="text-cyan-400 hover:text-cyan-300 capitalize font-medium hover:underline">
                        {v.move.name.replace(/-/g, ' ')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl mt-8 text-center">
          <p className="text-slate-400">No game variations found for this machine.</p>
        </div>
      )}
    </div>
  );
}
