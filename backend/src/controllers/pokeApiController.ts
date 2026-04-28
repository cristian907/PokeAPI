import { Request, Response } from 'express';
import { pokeApiService } from '../services/pokeApiService';

export const pokeApiController = {
  // Nuevo endpoint avanzado de búsqueda, filtros y paginación
  async searchAndFilterPokemons(req: Request, res: Response) {
    try {
      const query = req.query.query ? (req.query.query as string).toLowerCase() : '';
      const type = req.query.type as string;
      const generation = req.query.generation as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      // 1. Obtener la lista maestra
      let results = await pokeApiService.getAllPokemons();

      // 2. Filtrar por nombre (query)
      if (query) {
        results = results.filter(p => p.name.includes(query));
      }

      // 3. Filtrar por tipo
      if (type) {
        const typePokemons = await pokeApiService.getPokemonsByType(type);
        const typeSet = new Set(typePokemons);
        results = results.filter(p => typeSet.has(p.name));
      }

      // 4. Filtrar por generación
      if (generation) {
        const genPokemons = await pokeApiService.getPokemonsByGeneration(generation);
        const genSet = new Set(genPokemons);
        results = results.filter(p => genSet.has(p.name));
      }

      // 5. Paginar
      const total = results.length;
      const startIndex = (page - 1) * limit;
      const paginatedResults = results.slice(startIndex, startIndex + limit);

      res.json({
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        results: paginatedResults
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error searching and filtering pokemons' });
    }
  },

  async searchAndFilterMoves(req: Request, res: Response) {
    try {
      const query = req.query.query ? (req.query.query as string).toLowerCase() : '';
      const type = req.query.type as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      let results = await pokeApiService.getAllMoves();

      if (query) results = results.filter(p => p.name.includes(query));
      if (type) {
        const typeMoves = await pokeApiService.getMovesByType(type);
        const typeSet = new Set(typeMoves);
        results = results.filter(p => typeSet.has(p.name));
      }

      const total = results.length;
      const startIndex = (page - 1) * limit;
      res.json({
        total, page, limit, totalPages: Math.ceil(total / limit),
        results: results.slice(startIndex, startIndex + limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Error searching moves' });
    }
  },

  async searchAndFilterItems(req: Request, res: Response) {
    try {
      const query = req.query.query ? (req.query.query as string).toLowerCase() : '';
      const category = req.query.category as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      let results = await pokeApiService.getAllItems();

      if (query) results = results.filter(p => p.name.includes(query));
      if (category) {
        const catItems = await pokeApiService.getItemsByCategory(category);
        const catSet = new Set(catItems);
        results = results.filter(p => catSet.has(p.name));
      }

      const total = results.length;
      const startIndex = (page - 1) * limit;
      res.json({
        total, page, limit, totalPages: Math.ceil(total / limit),
        results: results.slice(startIndex, startIndex + limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Error searching items' });
    }
  },

  async searchAndFilterLocations(req: Request, res: Response) {
    try {
      const query = req.query.query ? (req.query.query as string).toLowerCase() : '';
      const region = req.query.region as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      let results = await pokeApiService.getAllLocations();

      if (query) results = results.filter(p => p.name.includes(query));
      if (region) {
        const regLocs = await pokeApiService.getLocationsByRegion(region);
        const regSet = new Set(regLocs);
        results = results.filter(p => regSet.has(p.name));
      }

      const total = results.length;
      const startIndex = (page - 1) * limit;
      res.json({
        total, page, limit, totalPages: Math.ceil(total / limit),
        results: results.slice(startIndex, startIndex + limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Error searching locations' });
    }
  },

  async getItemCategories(req: Request, res: Response) {
    try {
      const data = await pokeApiService.getItemCategories();
      res.json(data);
    } catch (error) { res.status(500).json({ error: 'Error fetching item categories' }); }
  },

  async getRegions(req: Request, res: Response) {
    try {
      const data = await pokeApiService.getRegions();
      res.json(data);
    } catch (error) { res.status(500).json({ error: 'Error fetching regions' }); }
  },

  async getTypes(req: Request, res: Response) {
    try {
      const data = await pokeApiService.getTypes();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching types' });
    }
  },

  async getPokemons(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const data = await pokeApiService.getPokemons(limit, offset);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching pokemons' });
    }
  },

  async getPokemonDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await pokeApiService.getPokemonByName(id as string);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching pokemon details' });
    }
  },

  async getPokemonEvolutionChain(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const data = await pokeApiService.getPokemonEvolutionChain(id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching pokemon evolution chain' });
    }
  },

  async getMoves(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const data = await pokeApiService.getMoves(limit, offset);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching moves' });
    }
  },

  async getMap(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const data = await pokeApiService.getMapLocations(limit, offset);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching map locations' });
    }
  },

  async getItems(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const data = await pokeApiService.getItems(limit, offset);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching items' });
    }
  },

  async getEvolutions(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const data = await pokeApiService.getEvolutions(limit, offset);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching evolutions' });
    }
  },

  async getGenerations(req: Request, res: Response) {
    try {
      const data = await pokeApiService.getGenerations();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching generations' });
    }
  },

  async getBerries(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const search = req.query.search ? (req.query.search as string).toLowerCase() : '';

      let allBerries = await pokeApiService.getAllBerries();

      if (search) {
        allBerries = allBerries.filter((i: any) => i.name.toLowerCase().includes(search));
      }

      const offset = (page - 1) * limit;
      const paginatedData = allBerries.slice(offset, offset + limit);

      res.json({
        count: allBerries.length,
        results: paginatedData,
        totalPages: Math.ceil(allBerries.length / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching berries' });
    }
  },

  async getBerryDetails(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const data = await pokeApiService.getBerryByName(id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching berry details' });
    }
  },

  async getMachines(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const search = req.query.search ? (req.query.search as string).toLowerCase() : '';

      let allMachines = await pokeApiService.getAllMachines();

      if (search) {
        allMachines = allMachines.filter((m: any) => m.id.includes(search));
      }

      const offset = (page - 1) * limit;
      const paginatedData = allMachines.slice(offset, offset + limit);

      res.json({
        count: allMachines.length,
        results: paginatedData,
        totalPages: Math.ceil(allMachines.length / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching machines' });
    }
  },

  async getMachineDetails(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const data = await pokeApiService.getMachineById(id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching machine details' });
    }
  }
};
