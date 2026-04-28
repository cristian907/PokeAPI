'use client';

import { useEffect, useState } from 'react';
import { fetchFilteredItems, fetchItemCategories } from '@/services/api';
import Link from 'next/link';

interface ItemEntry {
  name: string;
  url: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<ItemEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  const [categories, setCategories] = useState<{name: string}[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const catData = await fetchItemCategories();
        setCategories(catData.results);
      } catch (err) {
        console.error('Error loading item categories, retrying...', err);
        setTimeout(loadFilters, 3000);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchFilteredItems({
      query: debouncedQuery,
      category: selectedCategory,
      page: page,
      limit: 30
    })
      .then((data) => {
        setItems(data.results);
        setTotalPages(data.totalPages);
        setTotalItemsCount(data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [debouncedQuery, selectedCategory, page]);

  const handleFilterChange = (setter: any) => (e: any) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
            Items
          </h1>
          <p className="text-slate-400 text-sm">Showing {totalItemsCount} results</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Search item..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-500"
          />
          <select 
            value={selectedCategory} 
            onChange={handleFilterChange(setSelectedCategory)}
            className="bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none capitalize"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.name} value={c.name}>{c.name.replace(/-/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-rose-500">
          <p className="text-2xl mb-2 font-bold">Connection Error! 🔌</p>
          <p>Could not connect to the PokeAPI.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-2xl mb-2">No items found 😢</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((i) => (
              <Link 
                href={`/items/${i.name}`}
                key={i.name} 
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4 hover:bg-slate-700/50 hover:border-amber-500/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${i.name}.png`} alt={i.name} className="object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
                <h3 className="text-sm font-semibold text-white capitalize text-center">{i.name.replace(/-/g, ' ')}</h3>
              </Link>
            ))}
          </div>

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
                className="bg-slate-800 border border-slate-600 text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
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
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
