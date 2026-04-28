'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchFilteredMachines } from '@/services/api';
import Link from 'next/link';

interface MachineItem {
  id: string;
  url: string;
}

export default function MachinesPage() {
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const loadMachines = async (currentPage: number, currentSearch: string) => {
    setLoading(true);
    try {
      const data = await fetchFilteredMachines({
        page: currentPage,
        limit: 20,
        search: currentSearch
      });
      setMachines(data.results);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error loading machines:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMachines(page, search);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setPage(1);
      loadMachines(1, val);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header & Search */}
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Machines</h1>
          <p className="text-slate-400 font-medium">Find all TMs and TRs</p>
        </div>
        
        <div className="w-full md:w-auto flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search by TM/HM/TR name..." 
            value={search}
            onChange={handleSearch}
            className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : machines.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-2xl mb-2">No machines found 😢</p>
          <p>Try searching with another ID.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {machines.map((m) => (
              <Link 
                href={`/machines/${m.id}`}
                key={m.id} 
                className="group relative bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/10 p-4 hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.3)] cursor-pointer overflow-hidden block"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 relative mb-3 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-slate-900/50 rounded-full border border-slate-700">
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${m.id}.png`}
                      alt={m.id}
                      className="w-12 h-12 object-contain"
                      onError={(e) => { e.currentTarget.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png' }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">{m.id}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center items-center gap-4 py-8">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              &larr; Previous
            </button>
            <div className="flex items-center gap-2 text-slate-400 font-medium bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700">
              <span>Page</span>
              <select 
                value={page} 
                onChange={(e) => setPage(Number(e.target.value))}
                className="bg-slate-800 border border-slate-600 text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
              >
                {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(pageNum => (
                  <option key={pageNum} value={pageNum}>{pageNum}</option>
                ))}
              </select>
              <span>of {totalPages || 1}</span>
            </div>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
