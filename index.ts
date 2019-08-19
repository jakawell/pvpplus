// tslint:disable: no-console
import PokemongoGameMaster from 'pokemongo-game-master';
import { IGameMaster, IPokemonTemplate } from './interfaces';
import { Pokemon } from './models';

export default class Calculator {

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
   * Run the calculator.
   */
  public async run(): Promise<void> {
    const pokemonList: Map<string, Pokemon> = new Map<string, Pokemon>();

    console.log('Downloading latest Game Master...');
    const master: IGameMaster = (await PokemongoGameMaster.getVersion('latest', 'json')) as IGameMaster;

    console.log('Importing data...');
    for (const template of master.itemTemplates) {
      if (template.templateId.startsWith('V') && template.templateId.substring(6, 13) === 'POKEMON') {
        const pokemon = new Pokemon(template as IPokemonTemplate);
        // for normal forms that have no normal form, ignore
        if (pokemon.form === 'NORMAL' && this.noNormalForm.includes(pokemon.species)) {
          continue;
        }
        // for normal and non-shadow/purified forms, add it if we haven't added it yet
        if (!pokemon.form.endsWith('SHADOW') && !pokemon.form.endsWith('PURIFIED') && !pokemonList.has(pokemon.id)) {
          pokemonList.set(pokemon.id, pokemon);

        // replace normal form moves with shadow moves, since they have the same moves plus more
        } else if (pokemon.form.endsWith('SHADOW')) {
          const normalPokemon: Pokemon | undefined = pokemonList.get(Pokemon.generateId(pokemon.species, 'NORMAL'));
          if (normalPokemon) {
            (normalPokemon as Pokemon).chargeMoves = pokemon.chargeMoves;
          } else {
            pokemon.form = 'NORMAL';
            pokemonList.set(pokemon.id, pokemon);
          }
        }
      }
    }

    for (const [id, pokemon] of pokemonList) {
      console.log(`${id}:\n  fast:   ${pokemon.fastMoves}\n  charge: ${pokemon.chargeMoves}`);
    }

    console.log('Done.');
  }
}

// Run the calculator if file is run as a script
(async () => {
  await (new Calculator()).run();
})();
