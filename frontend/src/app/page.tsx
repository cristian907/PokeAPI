'use client';

import { useEffect, useState } from 'react';
import { fetchFilteredPokemons, fetchTypes, fetchGenerations } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';

interface PokemonItem {
  name: string;
  url: string;
}

export default function PokemonPage() {
  const [pokemons, setPokemons] = useState<PokemonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // States para los filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('');
  
  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Opciones para los selects
  const [types, setTypes] = useState<{name: string}[]>([]);
  const [generations, setGenerations] = useState<{name: string, url: string}[]>([]);

  // Debounce state para búsqueda
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Cargar opciones de filtros al inicio (con reintento si falla por problemas de red)
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [typesData, genData] = await Promise.all([
          fetchTypes(),
          fetchGenerations()
        ]);
        setTypes(typesData.results);
        setGenerations(genData.results);
      } catch (err) {
        console.error('Error loading filters, retrying in 3s...', err);
        setTimeout(loadFilters, 3000);
      }
    };
    loadFilters();
  }, []);

  // Manejar el debounce de la barra de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1); // Volver a la primera página al buscar
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Ejecutar la búsqueda cuando los filtros o la página cambian
  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchFilteredPokemons({
      query: debouncedQuery,
      type: selectedType,
      generation: selectedGeneration ? getGenId(selectedGeneration) : '',
      page: page,
      limit: 20
    })
      .then((data) => {
        setPokemons(data.results);
        setTotalPages(data.totalPages);
        setTotalItems(data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [debouncedQuery, selectedType, selectedGeneration, page]);

  // Helpers
  const getPokemonId = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };

  const getGenId = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };

  const handleFilterChange = (setter: any) => (e: any) => {
    setter(e.target.value);
    setPage(1); // Reset a pagina 1
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header y Filtros */}
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500 mb-2">
            National Pokédex
          </h1>
          <p className="text-slate-400 text-sm">Showing {totalItems} results</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
          />
          <select 
            value={selectedType} 
            onChange={handleFilterChange(setSelectedType)}
            className="bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none capitalize"
          >
            <option value="">All Types</option>
            {types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
          <select 
            value={selectedGeneration} 
            onChange={handleFilterChange(setSelectedGeneration)}
            className="bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none capitalize"
          >
            <option value="">All Generations</option>
            {generations.map((g, i) => <option key={g.name} value={g.url}>Gen {i + 1}</option>)}
          </select>
        </div>
      </div>

      {/* Grid de Resultados */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-rose-500">
          <p className="text-2xl mb-2 font-bold">Connection Error! 🔌</p>
          <p>Could not connect to the PokeAPI. Please check your internet connection.</p>
        </div>
      ) : pokemons.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-2xl mb-2">No Pokémon found 😢</p>
          <p>Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {pokemons.map((p) => {
              const id = getPokemonId(p.url);
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
              return (
                <Link 
                  href={`/pokemon/${p.name}`}
                  key={p.name} 
                  className="group relative bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/10 p-4 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)] cursor-pointer overflow-hidden block"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="absolute top-0 right-0 text-xs font-bold text-slate-500 bg-slate-900/50 px-2 py-1 rounded-bl-lg rounded-tr-lg">
                      #{id.padStart(3, '0')}
                    </span>
                    <div className="w-24 h-24 relative mb-4 mt-2 drop-shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Image 
                        src={imageUrl} 
                        alt={p.name} 
                        fill 
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <h3 className="text-lg font-bold text-white capitalize tracking-wide">{p.name}</h3>
                  </div>
                </Link>
              );
            })}
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
                className="bg-slate-800 border border-slate-600 text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
