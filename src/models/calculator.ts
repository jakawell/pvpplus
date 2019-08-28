// tslint:disable: no-console
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import PokemongoGameMaster from 'pokemongo-game-master';
import { IGameMaster, IPokemonTemplate } from '../interfaces';
import { Pokemon } from './';

const writeFile = promisify(fs.writeFile);

export class Calculator {

  public pokemonList: Map<string, Pokemon> = new Map<string, Pokemon>();
  public master: IGameMaster | null = null;

  private noNormalForm: string[] = [
    'BURMY',
    'WORMADAM',
    'CHERRIM',
    'SHELLOS',
    'GASTRODON',
    'GIRATINA',
    'SHAYMIN',
  ];

  /**
   * Download the latest game master file and update "this.master" with the value.
   * @returns Promise<void>
   */
  public async downloadGameMaster(): Promise<void> {
    this.master = (await PokemongoGameMaster.getVersion('latest', 'json')) as IGameMaster;
  }

  /**
   * Load the provided game master data into the system.
   * @param gameMaster the game master to import
   */
  public async importGameMaster(gameMaster: IGameMaster): Promise<void> {
    for (const template of gameMaster.itemTemplates) {
      if (template.templateId.startsWith('V') && template.templateId.substring(6, 13) === 'POKEMON') {
        const pokemon = new Pokemon(template as IPokemonTemplate);
        // for normal forms that have no normal form, ignore
        if (pokemon.form === 'NORMAL' && this.noNormalForm.includes(pokemon.species)) {
          continue;
        }
        // for normal and non-shadow/purified forms, add it if we haven't added it yet
        if (!pokemon.form.endsWith('SHADOW')
          && !pokemon.form.endsWith('PURIFIED')
          && !this.pokemonList.has(pokemon.id)) {
          this.pokemonList.set(pokemon.id, pokemon);

        // replace normal form moves with shadow moves, since they have the same moves plus more
        } else if (pokemon.form.endsWith('SHADOW')) {
          const normalPokemon: Pokemon | undefined = this.pokemonList.get(
            Pokemon.generateId(pokemon.species, 'NORMAL'),
          );
          if (normalPokemon) {
            (normalPokemon as Pokemon).chargeMoves = pokemon.chargeMoves;
          } else {
            pokemon.form = 'NORMAL';
            this.pokemonList.set(pokemon.id, pokemon);
          }
        }
      }
    }
  }

  /**
   * Run the calculator.
   */
  public async run(): Promise<void> {
    console.log('Downloading latest Game Master...');
    await this.downloadGameMaster();
    await this.saveGameMaster();

    console.log('Importing data...');
    await this.importGameMaster(this.master as IGameMaster);

    for (const [id, pokemon] of this.pokemonList) {
      console.log(
        `${id}:`
        + `\n  types: ${pokemon.types}`
        + `\n  fast:   ${pokemon.fastMoves}`
        + `\n  charge: ${pokemon.chargeMoves}`);
    }

    console.log('Done.');
  }

  private async saveGameMaster() {
    await writeFile(path.join(__dirname, '../master.json'), JSON.stringify(this.master, null, 2));
  }
}
