import Image from 'next/image';
import Link from 'next/link';
import { fetchPokemonDetails, fetchPokemonEvolutionChain } from '@/services/api';

interface EvolutionStage {
  name: string;
  id: string;
  min_level: number | null;
  trigger: string | null;
  item: string | null;
}

export default async function PokemonDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let pokemon;
  let evolutionChain: EvolutionStage[] = [];

  try {
    pokemon = await fetchPokemonDetails(resolvedParams.id);
    
    try {
      evolutionChain = await fetchPokemonEvolutionChain(pokemon.species.name);
    } catch (evoErr) {
      // It's okay if evolution fails, we just won't show it
      console.warn("Could not fetch evolution chain", evoErr);
    }
  } catch (e) {
    console.error("Error fetching pokemon details for", resolvedParams.id, e);
    return (
      <div className="text-center py-20 text-rose-500">
        <h1 className="text-3xl font-bold">Pokémon not found</h1>
        <Link href="/" className="mt-4 inline-block text-emerald-500 hover:underline">Return to Pokédex</Link>
      </div>
    );
  }

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default;
  const shinyUrl = pokemon.sprites?.other?.['official-artwork']?.front_shiny || pokemon.sprites?.front_shiny;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors">
        &larr; Return to Pokédex
      </Link>
      
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-64 h-64 relative shrink-0">
            {imageUrl && <Image src={imageUrl} alt={pokemon.name} fill className="object-contain drop-shadow-2xl" unoptimized />}
          </div>
          
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-end gap-3 justify-center md:justify-start">
              <h1 className="text-5xl font-extrabold capitalize text-white tracking-tight">{pokemon.name}</h1>
              <span className="text-2xl text-slate-400 font-bold mb-1">#{String(pokemon.id).padStart(3, '0')}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {pokemon.types.map((t: any) => (
                <span key={t.type.name} className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-semibold capitalize text-sm">
                  {t.type.name}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                <p className="text-slate-400 text-sm">Height</p>
                <p className="text-2xl font-bold text-white">{pokemon.height / 10} m</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                <p className="text-slate-400 text-sm">Weight</p>
                <p className="text-2xl font-bold text-white">{pokemon.weight / 10} kg</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Base Stats</h2>
            <div className="space-y-3">
              {pokemon.stats.map((s: any) => (
                <div key={s.stat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400 capitalize">{s.stat.name.replace('-', ' ')}</span>
                    <span className="text-white font-bold">{s.base_stat}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Abilities</h2>
            <div className="space-y-3">
              {pokemon.abilities.map((a: any) => (
                <div key={a.ability.name} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
                  <span className="text-lg font-semibold text-white capitalize">{a.ability.name.replace('-', ' ')}</span>
                  {a.is_hidden && <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">Hidden</span>}
                </div>
              ))}
            </div>
            {shinyUrl && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Shiny Form</h2>
                <div className="w-32 h-32 relative bg-slate-900/50 rounded-2xl border border-slate-700/50 flex items-center justify-center p-2">
                  <Image src={shinyUrl} alt={`${pokemon.name} shiny`} fill className="object-contain" unoptimized />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Evolution Chain Section */}
        {evolutionChain.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Evolution Chain</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              {evolutionChain.map((evo: EvolutionStage, index: number) => (
                <div key={evo.name} className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                  {/* Arrow for the next evolution */}
                  {index > 0 && (
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="hidden md:block text-2xl">&rarr;</div>
                      <div className="md:hidden text-2xl">&darr;</div>
                      {evo.min_level && <span className="text-xs font-semibold bg-slate-800 px-2 py-1 rounded mt-1">Lvl {evo.min_level}</span>}
                      {evo.item && <span className="text-xs font-semibold bg-slate-800 px-2 py-1 rounded mt-1 capitalize">{evo.item.replace('-', ' ')}</span>}
                    </div>
                  )}
                  
                  {/* Evolution Stage Card */}
                  <Link href={`/pokemon/${evo.name}`} className="group relative bg-slate-900/50 rounded-2xl border border-slate-700/50 p-4 flex flex-col items-center hover:border-emerald-500/50 hover:bg-slate-800 transition-all cursor-pointer">
                    <div className="w-24 h-24 relative mb-2 group-hover:scale-110 transition-transform">
                      <Image 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                        alt={evo.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-white font-bold capitalize">{evo.name}</span>
                    <span className="text-slate-500 text-xs">#{String(evo.id).padStart(3, '0')}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
