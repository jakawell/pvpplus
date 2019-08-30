import { IPveMoveTemplate, IPvpMoveTemplate } from '../src/interfaces';
import { Move } from '../src/models';
import fakeGameMaster from './mockData/mockGameMaster.json';

let pokemon: Move;

beforeEach(() => {
  pokemon = new Move(
    fakeGameMaster.itemTemplates[4] as IPveMoveTemplate,
    fakeGameMaster.itemTemplates[3] as unknown as IPvpMoveTemplate,
  );
});

test('should import all fields properly', () => {
  expect(pokemon.id).toBe('FRENZY_PLANT');
  expect(pokemon.type).toBe('GRASS');

  expect(pokemon.powerPve).toBe(100);
  expect(pokemon.energyPve).toBe(-50);
  expect(pokemon.castTimePve).toBe(2600);

  expect(pokemon.powerPvp).toBe(100);
  expect(pokemon.energyPvp).toBe(-45);
  expect(pokemon.turnsPvp).toBe(1);
});
