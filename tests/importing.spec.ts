import util from 'util';
jest.spyOn(util, 'promisify').mockReturnValue(async () => { return; });
import PokemongoGameMaster from 'pokemongo-game-master';
import { Calculator } from '../src/models';
import { IGameMaster } from '../src/interfaces';
import mockGameMaster from './mockData/mockGameMaster.json';

let calculator: Calculator;

beforeEach(() => {
  calculator = new Calculator();
  jest.spyOn(PokemongoGameMaster, 'getVersion').mockResolvedValue(mockGameMaster);
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('should download game master', async () => {
  await calculator.downloadGameMaster();
  expect(calculator.master).not.toBeNull();
  expect((calculator.master as IGameMaster).itemTemplates.length).toBe(11);
});

test('should import game master', async () => {
  await calculator.importGameMaster(mockGameMaster as IGameMaster);
  expect(calculator.pokemonList.size).toEqual(3);
  expect(Array.from<string>(calculator.pokemonList.keys())).toEqual([
    'VENUSAUR_NORMAL',
    'BLASTOISE_NORMAL',
    'GIRATINA_ALTERED',
  ]);

  expect(calculator.movesList.size).toEqual(2);
});

test('should run the calculator', async () => {
  const downloadSpy = jest.spyOn(calculator, 'downloadGameMaster');
  const importSpy = jest.spyOn(calculator, 'importGameMaster');
  console.log = jest.fn(); // tslint:disable-line: no-console
  await calculator.run();
  expect(downloadSpy).toHaveBeenCalled();
  expect(importSpy).toHaveBeenCalled();
  expect(console.log).toHaveBeenCalled(); // tslint:disable-line: no-console
});
