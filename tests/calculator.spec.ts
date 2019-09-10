import { Calculator } from '../src/models';

let calculator = new Calculator();

beforeAll(() => {
  calculator = new Calculator();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('should run the calculator', async () => {
  const runSpy = jest.spyOn(calculator, 'run');
  console.log = jest.fn(); // tslint:disable-line: no-console
  await calculator.run();
  expect(runSpy).toHaveBeenCalled();
  expect(console.log).toHaveBeenCalled(); // tslint:disable-line: no-console
});
