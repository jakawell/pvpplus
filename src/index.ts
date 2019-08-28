import { Calculator } from './models';

// Run the calculator if file is run as a script
(async () => {
  await (new Calculator()).run();
})();
