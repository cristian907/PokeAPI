import Link from 'next/link';
import { fetchItemDetails } from '@/services/api';

export default async function ItemDetail({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  let item;
  try {
    item = await fetchItemDetails(resolvedParams.name);
  } catch (e) {
    return (
      <div className="text-center py-20 text-rose-500">
        <h1 className="text-3xl font-bold">Item not found</h1>
        <Link href="/items" className="mt-4 inline-block text-amber-500 hover:underline">Return to Items</Link>
      </div>
    );
  }

  const flavorText = item.flavor_text_entries.find((f: any) => f.language.name === 'en')?.text 
                  || "No description available.";

  const effectText = item.effect_entries.find((e: any) => e.language.name === 'en')?.effect || "No detailed effect available.";

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <Link href="/items" className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors">
        &larr; Return to Items
      </Link>
      
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8">
        <div className="shrink-0 flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-slate-900/50 rounded-2xl border border-slate-700/50 flex items-center justify-center p-4">
            <img 
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`} 
              alt={item.name}
              className="w-full h-full object-contain drop-shadow-xl" 
            />
          </div>
          <span className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 font-semibold capitalize text-sm text-center">
            {item.category.name.replace(/-/g, ' ')}
          </span>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-extrabold capitalize text-white tracking-tight">{item.name.replace(/-/g, ' ')}</h1>
            <p className="text-amber-500 font-medium">Cost: <span className="text-white">{item.cost > 0 ? `₽${item.cost}` : 'Cannot be bought'}</span></p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-300 mb-2">Description</h3>
              <p className="text-slate-400 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                {flavorText.replace(/\n|\f/g, ' ')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-300 mb-2">Technical Effect</h3>
              <p className="text-slate-400 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                {effectText.replace(/\n|\f/g, ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
