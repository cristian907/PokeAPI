const API_URL = 'http://localhost:3001/api';

export const fetchFilteredPokemons = async (params: { query?: string, type?: string, generation?: string, page?: number, limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params.query) queryParams.append('query', params.query);
  if (params.type) queryParams.append('type', params.type);
  if (params.generation) queryParams.append('generation', params.generation);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const res = await fetch(`${API_URL}/pokemon/search?${queryParams.toString()}`);
  if (!res.ok) throw new Error('Error fetching filtered pokemons');
  return res.json();
};

export const fetchFilteredMoves = async (params: { query?: string, type?: string, page?: number, limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params.query) queryParams.append('query', params.query);
  if (params.type) queryParams.append('type', params.type);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  const res = await fetch(`${API_URL}/moves/search?${queryParams.toString()}`);
  if (!res.ok) throw new Error('Error fetching filtered moves');
  return res.json();
};

export const fetchFilteredItems = async (params: { query?: string, category?: string, page?: number, limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params.query) queryParams.append('query', params.query);
  if (params.category) queryParams.append('category', params.category);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  const res = await fetch(`${API_URL}/items/search?${queryParams.toString()}`);
  if (!res.ok) throw new Error('Error fetching filtered items');
  return res.json();
};

export const fetchFilteredLocations = async (params: { query?: string, region?: string, page?: number, limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params.query) queryParams.append('query', params.query);
  if (params.region) queryParams.append('region', params.region);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  const res = await fetch(`${API_URL}/map/search?${queryParams.toString()}`);
  if (!res.ok) throw new Error('Error fetching filtered locations');
  return res.json();
};

export const fetchTypes = async () => {
  const res = await fetch(`${API_URL}/types`);
  if (!res.ok) throw new Error('Error fetching types');
  return res.json();
};

export const fetchItemCategories = async () => {
  const res = await fetch(`${API_URL}/item-categories`);
  if (!res.ok) throw new Error('Error fetching item categories');
  return res.json();
};

export const fetchRegions = async () => {
  const res = await fetch(`${API_URL}/regions`);
  if (!res.ok) throw new Error('Error fetching regions');
  return res.json();
};

// ... Mantenemos las anteriores para otras páginas
export const fetchPokemons = async (limit = 20, offset = 0) => {
  const res = await fetch(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Error fetching pokemons');
  return res.json();
};

export const fetchPokemonDetails = async (id: string) => {
  const res = await fetch(`${API_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error('Error fetching pokemon details');
  return res.json();
};

export const fetchMoves = async (limit = 20, offset = 0) => {
  const res = await fetch(`${API_URL}/moves?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Error fetching moves');
  return res.json();
};

export const fetchMapLocations = async (limit = 20, offset = 0) => {
  const res = await fetch(`${API_URL}/map?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Error fetching map locations');
  return res.json();
};

export const fetchItems = async (limit = 20, offset = 0) => {
  const res = await fetch(`${API_URL}/items?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Error fetching items');
  return res.json();
};

export const fetchEvolutions = async (limit = 20, offset = 0) => {
  const res = await fetch(`${API_URL}/evolutions?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Error fetching evolutions');
  return res.json();
};

export const fetchGenerations = async () => {
  const res = await fetch(`${API_URL}/generations`);
  if (!res.ok) throw new Error('Error fetching generations');
  return res.json();
};

export const fetchFilteredBerries = async (params: { search?: string, page?: number, limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  const response = await fetch(`${API_URL}/berries?${queryParams.toString()}`);
  return response.json();
};

export const fetchFilteredMachines = async (params: { search?: string, page?: number, limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  const response = await fetch(`${API_URL}/machines?${queryParams.toString()}`);
  return response.json();
};

export const fetchPokemonEvolutionChain = async (id: string) => {
  const res = await fetch(`${API_URL}/pokemon/${id}/evolution`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error fetching evolution chain');
  return res.json();
};

export const fetchMoveDetails = async (name: string) => {
  const res = await fetch(`${API_URL}/moves/${name}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error fetching move details');
  return res.json();
};

export const fetchMapLocationDetails = async (name: string) => {
  const res = await fetch(`${API_URL}/map/${name}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error fetching location details');
  return res.json();
};

export const fetchItemDetails = async (name: string) => {
  const res = await fetch(`${API_URL}/items/${name}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error fetching item details');
  return res.json();
};

export const fetchBerryDetails = async (name: string) => {
  const res = await fetch(`${API_URL}/berries/${name}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error fetching berry details');
  return res.json();
};

export const fetchMachineDetails = async (id: string) => {
  const res = await fetch(`${API_URL}/machines/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error fetching machine details');
  return res.json();
};
