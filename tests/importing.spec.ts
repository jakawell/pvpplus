import { Calculator } from '../src/models';
import { IGameMaster } from '../src/interfaces';

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
  await calculator.downloadGameMaster();
  await calculator.importGameMaster(calculator.master as IGameMaster);
  expect(calculator.pokemonList.size).toBeGreaterThanOrEqual(550);
});
