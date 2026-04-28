import axios from 'axios';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

let allPokemonsCache: { name: string, url: string }[] = [];
let allMovesCache: { name: string, url: string }[] = [];
let allItemsCache: { name: string, url: string }[] = [];
let allLocationsCache: { name: string, url: string }[] = [];
let allBerriesCache: { name: string, url: string }[] = [];
let allMachinesCache: { url: string, id: string }[] = [];

const typesCache: Record<string, string[]> = {};
const genCache: Record<string, string[]> = {};
const itemCategoryCache: Record<string, string[]> = {};
const regionCache: Record<string, string[]> = {};

export const pokeApiService = {
  // Inicializa o devuelve la caché principal
  getAllPokemons: async () => {
    if (allPokemonsCache.length === 0) {
      console.log('Fetching all pokemons to cache...');
      try {
        const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=2000`);
        allPokemonsCache = response.data.results.filter((p: any) => {
          const id = parseInt(p.url.split('/').filter(Boolean).pop()!);
          return id < 10000;
        }).map((p: any) => {
          let name = p.name;
          const suffixesToRemove = [
            '-normal', '-shield', '-altered', '-incarnate', '-ordinary', 
            '-aria', '-average', '-50', '-meteor', '-plant', '-standard', 
            '-baile', '-midday', '-solo', '-hero', '-amped', '-single-strike'
          ];
          for (const suffix of suffixesToRemove) {
            if (name.endsWith(suffix)) {
              name = name.replace(suffix, '');
              break;
            }
          }
          return { ...p, name };
        });
      } catch (error) {
        console.error('Error fetching all pokemons:', error);
        throw new Error('PokeAPI is unreachable right now.');
      }
    }
    return allPokemonsCache;
  },

  getAllMoves: async () => {
    if (allMovesCache.length === 0) {
      try {
        const response = await axios.get(`${POKEAPI_BASE_URL}/move?limit=1000`);
        allMovesCache = response.data.results;
      } catch (error) { console.error('Error fetching moves:', error); }
    }
    return allMovesCache;
  },

  getAllItems: async () => {
    if (allItemsCache.length === 0) {
      try {
        const response = await axios.get(`${POKEAPI_BASE_URL}/item?limit=2500`);
        allItemsCache = response.data.results;
      } catch (error) { console.error('Error fetching items:', error); }
    }
    return allItemsCache;
  },

  getAllLocations: async () => {
    if (allLocationsCache.length === 0) {
      try {
        const response = await axios.get(`${POKEAPI_BASE_URL}/location?limit=1000`);
        allLocationsCache = response.data.results;
      } catch (error) { console.error('Error fetching locations:', error); }
    }
    return allLocationsCache;
  },

  getAllBerries: async () => {
    if (allBerriesCache.length === 0) {
      try {
        const response = await axios.get(`${POKEAPI_BASE_URL}/berry?limit=100`);
        allBerriesCache = response.data.results;
      } catch (error) { console.error('Error fetching berries:', error); }
    }
    return allBerriesCache;
  },

  getAllMachines: async () => {
    if (allMachinesCache.length === 0) {
      try {
        const response = await axios.get(`${POKEAPI_BASE_URL}/item-category/all-machines`);
        allMachinesCache = response.data.items.map((m: any) => ({
          url: m.url,
          id: m.name // Using the name (tm01) as the id for frontend compatibility
        }));
      } catch (error) { console.error('Error fetching machines:', error); }
    }
    return allMachinesCache;
  },

  // Obtiene los nombres de pokémon por tipo (ej. "fire")
  getPokemonsByType: async (type: string) => {
    if (!typesCache[type]) {
      const response = await axios.get(`${POKEAPI_BASE_URL}/type/${type}`);
      // La respuesta de tipo incluye "pokemon" -> [{ pokemon: { name, url }, slot }]
      typesCache[type] = response.data.pokemon.map((p: any) => p.pokemon.name);
    }
    return typesCache[type];
  },

  // Obtiene los nombres de pokémon por generación (ej. "1" o "generation-i")
  getPokemonsByGeneration: async (genId: string) => {
    if (!genCache[genId]) {
      const response = await axios.get(`${POKEAPI_BASE_URL}/generation/${genId}`);
      // La respuesta de generación incluye "pokemon_species" -> [{ name, url }]
      genCache[genId] = response.data.pokemon_species.map((p: any) => p.name);
    }
    return genCache[genId];
  },

  getMovesByType: async (type: string) => {
    if (!typesCache[`move_${type}`]) {
      const response = await axios.get(`${POKEAPI_BASE_URL}/type/${type}`);
      typesCache[`move_${type}`] = response.data.moves.map((m: any) => m.name);
    }
    return typesCache[`move_${type}`];
  },

  getItemsByCategory: async (category: string) => {
    if (!itemCategoryCache[category]) {
      const response = await axios.get(`${POKEAPI_BASE_URL}/item-category/${category}`);
      itemCategoryCache[category] = response.data.items.map((i: any) => i.name);
    }
    return itemCategoryCache[category];
  },

  getLocationsByRegion: async (region: string) => {
    if (!regionCache[region]) {
      const response = await axios.get(`${POKEAPI_BASE_URL}/region/${region}`);
      regionCache[region] = response.data.locations.map((l: any) => l.name);
    }
    return regionCache[region];
  },

  getItemCategories: async () => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/item-category?limit=100`);
    return response.data;
  },

  getRegions: async () => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/region?limit=20`);
    return response.data;
  },

  // Endpoint 1 original
  getPokemons: async (limit = 20, offset = 0) => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon`, { params: { limit, offset } });
    return response.data;
  },

  getPokemonByName: async (nameOrId: string) => {
    try {
      const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${nameOrId}`);
      return response.data;
    } catch (e: any) {
      // Si falla, probablemente es porque la forma base usa un sufijo en PokeAPI (ej. aegislash-shield).
      // Buscamos la especie, encontramos la variedad por defecto y usamos su URL.
      if (e.response && e.response.status === 404) {
        try {
          const speciesResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon-species/${nameOrId}`);
          const defaultVariety = speciesResponse.data.varieties.find((v: any) => v.is_default);
          if (defaultVariety) {
            const defaultResponse = await axios.get(defaultVariety.pokemon.url);
            return defaultResponse.data;
          }
        } catch (innerError) {
          throw innerError;
        }
      }
      throw e;
    }
  },

  getPokemonEvolutionChain: async (nameOrId: string) => {
    // 1. Get Pokemon Species
    const speciesRes = await axios.get(`${POKEAPI_BASE_URL}/pokemon-species/${nameOrId}`);
    const evolutionUrl = speciesRes.data.evolution_chain.url;
    
    // 2. Get Evolution Chain
    const evoRes = await axios.get(evolutionUrl);
    
    // Parse the chain
    const chain: any[] = [];
    let currentStage = evoRes.data.chain;
    
    while (currentStage) {
      // Find the ID from the species URL to construct image URL on frontend
      const speciesUrlParts = currentStage.species.url.split('/');
      const speciesId = speciesUrlParts[speciesUrlParts.length - 2];
      
      chain.push({
        name: currentStage.species.name,
        id: speciesId,
        min_level: currentStage.evolution_details[0]?.min_level || null,
        trigger: currentStage.evolution_details[0]?.trigger?.name || null,
        item: currentStage.evolution_details[0]?.item?.name || null
      });
      currentStage = currentStage.evolves_to[0]; // Assuming linear evolution for simplicity, though eevee has branches
    }
    
    return chain;
  },

  getMoveByName: async (nameOrId: string) => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/move/${nameOrId}`);
    return response.data;
  },

  getItemByName: async (nameOrId: string) => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/item/${nameOrId}`);
    return response.data;
  },

  getLocationByName: async (nameOrId: string) => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/location/${nameOrId}`);
    return response.data;
  },

  getBerryByName: async (nameOrId: string) => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/berry/${nameOrId}`);
    return response.data;
  },

  getMachineById: async (id: string) => {
    // For this refactor, id is actually the item name (e.g. tm01)
    const response = await axios.get(`${POKEAPI_BASE_URL}/item/${id}`);
    return response.data;
  },

  getMoves: async (limit = 20, offset = 0) => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/move`, { params: { limit, offset } });
    return response.data;
  },

  getMapLocations: async (limit = 20, offset = 0) => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/location`, { params: { limit, offset } });
    return response.data;
  },

  getItems: async (limit = 20, offset = 0) => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/item`, { params: { limit, offset } });
    return response.data;
  },

  getEvolutions: async (limit = 20, offset = 0) => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/evolution-chain`, { params: { limit, offset } });
    return response.data;
  },

  getGenerations: async () => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/generation`);
    return response.data;
  },
  
  getTypes: async () => {
    const response = await axios.get(`${POKEAPI_BASE_URL}/type`);
    return response.data;
  }
};
