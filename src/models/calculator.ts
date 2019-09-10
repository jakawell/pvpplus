// tslint:disable: no-console
import { IGameMasterImportOptions } from '../interfaces';
import { GameMasterImport, PokemonSpecies, Move } from './';

export class Calculator {

  public speciesList: Map<string, PokemonSpecies> = new Map<string, PokemonSpecies>();
  public movesList: Map<string, Move> = new Map<string, Move>();

  /**
   * Run the calculator.
   */
  public async run(): Promise<void> {
    console.log('Importing latest Game Master...');
    const { speciesList, movesList } = await GameMasterImport.importGameMaster({
      download: true,
      downloadVersion: 'latest',
      saveFile: '../../master.json',
      save: true,
    } as IGameMasterImportOptions);

    for (const [id, pokemon] of speciesList) {
      console.log(
        `${id}:`
        + `\n  types: ${pokemon.types}`
        + `\n  fast:   ${pokemon.fastMoves}`
        + `\n  charge: ${pokemon.chargeMoves}`);
    }

    for (const [id, move] of movesList) {
      console.log(
        `${id}:`
        + `\n  type:   ${move.type}`
        + `\n  PVE:    ${move.pveStats.power}`
        + `\n  PVP:    ${move.pvpStats.power}`);
    }

    console.log('Done.');
  }
}
