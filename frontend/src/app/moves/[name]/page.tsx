import Link from 'next/link';
import { fetchMoveDetails } from '@/services/api';

export default async function MoveDetail({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  let move;
  try {
    move = await fetchMoveDetails(resolvedParams.name);
  } catch (e) {
    return (
      <div className="text-center py-20 text-rose-500">
        <h1 className="text-3xl font-bold">Move not found</h1>
        <Link href="/moves" className="mt-4 inline-block text-blue-500 hover:underline">Return to Moves</Link>
      </div>
    );
  }

  const flavorText = move.flavor_text_entries.find((f: any) => f.language.name === 'en')?.flavor_text 
                  || "No description available.";

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <Link href="/moves" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
        &larr; Return to Moves
      </Link>
      
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-5xl font-extrabold capitalize text-white tracking-tight">{move.name.replace(/-/g, ' ')}</h1>
          <div className="flex gap-2">
            <span className="px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-400 font-semibold capitalize text-sm">
              Type: {move.type.name}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/50 text-indigo-400 font-semibold capitalize text-sm">
              Class: {move.damage_class.name}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 mb-8">
          <p className="text-xl text-slate-300 leading-relaxed italic">"{flavorText.replace(/\n|\f/g, ' ')}"</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm mb-1">Power</p>
            <p className="text-3xl font-bold text-white">{move.power || '-'}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm mb-1">Accuracy</p>
            <p className="text-3xl font-bold text-white">{move.accuracy ? `${move.accuracy}%` : '-'}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm mb-1">PP</p>
            <p className="text-3xl font-bold text-white">{move.pp}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm mb-1">Priority</p>
            <p className="text-3xl font-bold text-white">{move.priority}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
