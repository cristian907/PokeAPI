'use client';

import { useEffect, useState } from 'react';
import { fetchFilteredLocations } from '@/services/api';
import Link from 'next/link';

// Usamos React.use() o await de params en Next 15+ para rutas de cliente
export default function RegionLocationsPage({ params }: { params: Promise<{ region: string }> }) {
  const [locations, setLocations] = useState<{name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionName, setRegionName] = useState('');

  useEffect(() => {
    const loadLocations = async () => {
      const resolvedParams = await params;
      setRegionName(resolvedParams.region);
      try {
        // Fetch locations for this specific region
        const data = await fetchFilteredLocations({
          region: resolvedParams.region,
          page: 1,
          limit: 200 // Get all for the region
        });
        setLocations(data.results);
        setLoading(false);
      } catch (err) {
        console.error('Error loading region locations', err);
        setLoading(false);
      }
    };
    loadLocations();
  }, [params]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <Link href="/map" className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors">
        &larr; Return to Regions
      </Link>
      
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 mb-2 capitalize">
          {regionName} Region
        </h1>
        <p className="text-slate-400 text-lg">Explore all routes and cities in this region.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-2xl mb-2">No locations found in this region 😢</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {locations.map((l) => (
            <Link 
              href={`/map/location/${l.name}`}
              key={l.name} 
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4 hover:bg-slate-700/50 hover:border-green-500/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg flex items-center justify-center min-h-[80px]"
            >
              <h3 className="text-sm font-semibold text-white capitalize text-center">{l.name.replace(/-/g, ' ')}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
