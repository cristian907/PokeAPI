import { Router } from 'express';
import { pokeApiController } from '../controllers/pokeApiController';

const router = Router();

// Endpoints avanzados de búsqueda
router.get('/pokemon/search', pokeApiController.searchAndFilterPokemons);
router.get('/moves/search', pokeApiController.searchAndFilterMoves);
router.get('/items/search', pokeApiController.searchAndFilterItems);
router.get('/map/search', pokeApiController.searchAndFilterLocations);

// Filtros
router.get('/types', pokeApiController.getTypes);
router.get('/item-categories', pokeApiController.getItemCategories);
router.get('/regions', pokeApiController.getRegions);

// Endpoint 1: Pokemon
router.get('/pokemon', pokeApiController.getPokemons);
router.get('/pokemon/:id', pokeApiController.getPokemonDetails);
router.get('/pokemon/:id/evolution', pokeApiController.getPokemonEvolutionChain);

// Endpoint 2: Moves
router.get('/moves', pokeApiController.getMoves);
router.get('/moves/:id', async (req, res) => {
  try { res.json(await require('../services/pokeApiService').pokeApiService.getMoveByName(req.params.id)); }
  catch(e) { res.status(500).json({error: "Error"}); }
});

// Endpoint 3: Map
router.get('/map', pokeApiController.getMap);
router.get('/map/:id', async (req, res) => {
  try { res.json(await require('../services/pokeApiService').pokeApiService.getLocationByName(req.params.id)); }
  catch(e) { res.status(500).json({error: "Error"}); }
});

// Endpoint 4: Items
router.get('/items', pokeApiController.getItems);
router.get('/items/:id', async (req, res) => {
  try { res.json(await require('../services/pokeApiService').pokeApiService.getItemByName(req.params.id)); }
  catch(e) { res.status(500).json({error: "Error"}); }
});

// Endpoint 5: Berries
router.get('/berries', pokeApiController.getBerries);
router.get('/berries/:id', pokeApiController.getBerryDetails);

// Endpoint 6: Machines
router.get('/machines', pokeApiController.getMachines);
router.get('/machines/:id', pokeApiController.getMachineDetails);

// Endpoint 7: Evolutions
router.get('/evolutions', pokeApiController.getEvolutions);

// Endpoint 8: Generations
router.get('/generations', pokeApiController.getGenerations);

export default router;
