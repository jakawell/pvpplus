import { IPokemonTemplate } from '../interfaces';

export class Pokemon {
  public static generateId(species: string, form: string): string {
    return `${species}_${form}`;
  }

  public species: string;
  public form: string;
  public types: string[];
  public fastMoves: string[];
  public chargeMoves: string[];
  public baseAttack: number;
  public baseDefense: number;
  public baseStamina: number;

  public get id() {
    return Pokemon.generateId(this.species, this.form);
  }

  public constructor(source: IPokemonTemplate) {
    this.species = source.pokemonSettings.pokemonId;
    this.form = (source.pokemonSettings.form || 'NORMAL').replace(this.species + '_', '');
    this.types = [
      (source.pokemonSettings.type).split('_', 3)[2], // remove the `POKEMON_TYPE` prefix,
      (source.pokemonSettings.type2 || '').split('_', 3)[2], // remove the `POKEMON_TYPE` prefix,
    ];
    this.fastMoves = source.pokemonSettings.quickMoves;
    this.chargeMoves = source.pokemonSettings.cinematicMoves;
    this.baseAttack = source.pokemonSettings.stats.baseAttack;
    this.baseDefense = source.pokemonSettings.stats.baseDefense;
    this.baseStamina = source.pokemonSettings.stats.baseStamina;

    if (source.pokemonSettings.shadow) {
      this.chargeMoves.push(source.pokemonSettings.shadow.purifiedChargeMove);
      this.chargeMoves.push(source.pokemonSettings.shadow.shadowChargeMove);
    }
  }
}
