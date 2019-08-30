import { Calculator } from '../src/models';
import { IGameMaster } from '../src/interfaces';
import fakeGameMaster from './mockData/mockGameMaster.json';

let calculator: Calculator;

beforeEach(() => {
  calculator = new Calculator();
});

test('should download game master', async () => {
  await calculator.downloadGameMaster();
  expect(calculator.master).not.toBeNull();
  expect((calculator.master as IGameMaster).itemTemplates.length).toBeGreaterThan(0);
});

test('should import game master', async () => {
  await calculator.importGameMaster(fakeGameMaster as IGameMaster);
  expect(calculator.pokemonList.size).toEqual(1);
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
