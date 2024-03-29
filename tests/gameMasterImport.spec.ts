import fs from 'fs';
import mockGameMaster from './mockData/mockGameMaster.json';
jest.spyOn(fs, 'writeFile').mockImplementation((file, data, callback) => {
  if ((file as string).endsWith('invalidFile.json')) {
    callback(new Error('Mock write error'));
  } else {
    callback(null);
  }
});
jest.spyOn(fs, 'readFile').mockImplementation((file, callback) => {
  if ((file as string).endsWith('invalidFile.json')) {
    callback(new Error('Mock read error'), new Buffer(''));
  } else if ((file as string).endsWith('invalidFormat.json')) {
    callback(null, Buffer.from('??'));
  } else {
    callback(null, Buffer.from(JSON.stringify(mockGameMaster)));
  }
});
import PokemongoGameMaster from 'pokemongo-game-master';
import { IGameMasterImportOptions } from '../src/interfaces';
import { GameMasterImport, PokemonSpecies, Move } from '../src/models';

beforeEach(() => {
  jest.spyOn(PokemongoGameMaster, 'getVersion').mockResolvedValue(mockGameMaster);
});

afterAll(() => {
  jest.restoreAllMocks();
});

function expectGoodLists(speciesList: Map<string, PokemonSpecies>, movesList: Map<string, Move>) {
  expect(speciesList.size).toBe(3);
  expect(Array.from<string>(speciesList.keys())).toEqual([
    'VENUSAUR_NORMAL',
    'BLASTOISE_NORMAL',
    'GIRATINA_ALTERED',
  ]);
  expect(movesList.size).toBe(2);
  expect(Array.from<string>(movesList.keys())).toEqual([
    'FRENZY_PLANT',
    'RAZOR_LEAF_FAST',
  ]);
}

test('should download and import game master', async () => {
  const options: IGameMasterImportOptions = {
    download: true,
    downloadVersion: 'latest',
    localSourcePath: './master.json',
    save: true,
    saveFile: './master.json',
  };
  const { speciesList, movesList } = await GameMasterImport.importGameMaster(options);
  expectGoodLists(speciesList, movesList);

  const importer = new GameMasterImport(options);
  const { speciesList: speciesListCons, movesList: movesListCons } = await importer.importGameMaster();
  expectGoodLists(speciesListCons, movesListCons);
});

test('should load file and import game master', async () => {
  const options: IGameMasterImportOptions = {
    download: false,
    downloadVersion: 'latest',
    localSourcePath: './master.json',
    save: true,
    saveFile: './master.json',
  };
  const { speciesList, movesList } = await GameMasterImport.importGameMaster(options);
  expectGoodLists(speciesList, movesList);

  const importer = new GameMasterImport(options);
  const { speciesList: speciesListCons, movesList: movesListCons } = await importer.importGameMaster();
  expectGoodLists(speciesListCons, movesListCons);
});

test('should accept no options', async () => {
  const { speciesList, movesList } = await GameMasterImport.importGameMaster();
  expectGoodLists(speciesList, movesList);

  const importer = new GameMasterImport();
  const { speciesList: speciesListCons, movesList: movesListCons } = await importer.importGameMaster();
  expectGoodLists(speciesListCons, movesListCons);
});

test('should fail for invalid save location', async () => {
  const options: IGameMasterImportOptions = {
    download: false,
    downloadVersion: 'latest',
    localSourcePath: './master.json',
    save: true,
    saveFile: 'invalidFile.json',
  };
  await expect(GameMasterImport.importGameMaster(options))
    .rejects.toHaveProperty('message', 'Failed to save game master to local file: Error: Mock write error');
});

test('should fail for no save location', async () => {
  const options: IGameMasterImportOptions = {
    download: false,
    downloadVersion: 'latest',
    localSourcePath: './master.json',
    save: true,
    saveFile: undefined,
  };
  await expect(GameMasterImport.importGameMaster(options))
    .rejects.toHaveProperty('message', 'No save path was provided. Set "options.saveFile"');
});

test('should fail for invalid local source path', async () => {
  const options: IGameMasterImportOptions = {
    download: false,
    downloadVersion: undefined,
    localSourcePath: 'invalidFile.json',
    save: true,
    saveFile: './master.json',
  };
  await expect(GameMasterImport.importGameMaster(options))
    .rejects.toHaveProperty('message', 'Failed to read game master from local file: Error: Mock read error');
});

test('should fail for no local source path', async () => {
  const options: IGameMasterImportOptions = {
    download: false,
    downloadVersion: undefined,
    localSourcePath: undefined,
    save: true,
    saveFile: './master.json',
  };
  await expect(GameMasterImport.importGameMaster(options))
    .rejects.toHaveProperty('message', 'No source path was provided. Set "options.localSourcePath".');
});

test('should fail for badly formatted local source path', async () => {
  const options: IGameMasterImportOptions = {
    download: false,
    downloadVersion: undefined,
    localSourcePath: 'invalidFormat.json',
    save: true,
    saveFile: './master.json',
  };
  await expect(GameMasterImport.importGameMaster(options))
    // tslint:disable-next-line: max-line-length
    .rejects.toHaveProperty('message', `Failed to read game master from local file: Error: Failed to parse game master from local file: SyntaxError: Unexpected token ? in JSON at position 0`);
});
