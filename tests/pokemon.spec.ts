import { IPokemonTemplate } from '../src/interfaces';
import { Pokemon } from '../src/models';
import fakeGameMaster from './mockData/mockGameMaster.json';

let pokemon: Pokemon;

beforeEach(() => {
  pokemon = new Pokemon(fakeGameMaster.itemTemplates[0] as IPokemonTemplate);
});

test('should import all fields properly', () => {
  expect(pokemon.speciesId).toBe('VENUSAUR');
  expect(pokemon.form).toBe('SHADOW');
  expect(pokemon.id).toBe('VENUSAUR_SHADOW');
  expect(pokemon.types).toEqual(['GRASS', 'POISON']);
  expect(pokemon.fastMoves).toEqual(['RAZOR_LEAF_FAST', 'VINE_WHIP_FAST']);
  expect(pokemon.chargeMoves).toEqual(['SLUDGE_BOMB', 'PETAL_BLIZZARD', 'SOLAR_BEAM', 'RETURN', 'FRUSTRATION']);
  expect(pokemon.baseAttack).toBe(198);
  expect(pokemon.baseDefense).toBe(189);
  expect(pokemon.baseStamina).toBe(190);
});
