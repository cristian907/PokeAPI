'use client';

import { useEffect, useState } from 'react';
import { fetchRegions } from '@/services/api';
import Link from 'next/link';

export default function MapPage() {
  const [regions, setRegions] = useState<{name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const regData = await fetchRegions();
        setRegions(regData.results);
        setLoading(false);
      } catch (err) {
        console.error('Error loading regions, retrying...', err);
        setTimeout(loadFilters, 3000);
      }
    };
    loadFilters();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
          Pokémon Regions
        </h1>
        <p className="text-slate-400 text-lg">Select a region to explore its locations and routes.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {regions.map((r) => (
            <Link 
              href={`/map/${r.name}`}
              key={r.name} 
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 hover:bg-slate-700/50 hover:border-green-500/50 transition-all cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center gap-4 group"
            >
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="text-xl font-bold text-white capitalize text-center">{r.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
