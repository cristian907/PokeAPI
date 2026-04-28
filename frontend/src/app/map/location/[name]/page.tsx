import Link from 'next/link';
import { fetchMapLocationDetails } from '@/services/api';

export default async function LocationDetail({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  let location;
  try {
    location = await fetchMapLocationDetails(resolvedParams.name);
  } catch (e) {
    return (
      <div className="text-center py-20 text-rose-500">
        <h1 className="text-3xl font-bold">Location not found</h1>
        <Link href="/map" className="mt-4 inline-block text-green-500 hover:underline">Return to Map</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <Link href={`/map/${location.region.name}`} className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors">
        &larr; Return to {location.region.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
      </Link>
      
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-700/50 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold capitalize text-white tracking-tight mb-2">
              {location.name.replace(/-/g, ' ')}
            </h1>
            <p className="text-green-400 font-medium capitalize flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Region: {location.region.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Location Areas</h2>
            {location.areas.length === 0 ? (
              <p className="text-slate-400 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">This location has no explorable areas registered.</p>
            ) : (
              <ul className="space-y-2">
                {location.areas.map((a: any) => (
                  <li key={a.name} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-slate-300 capitalize flex items-center before:content-['📍'] before:mr-3">
                    {a.name.replace(/-/g, ' ')}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
