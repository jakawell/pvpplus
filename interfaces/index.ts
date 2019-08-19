export interface IItemTemplate {
  templateId: string;
}

export interface IPokemonTemplate extends IItemTemplate {
  pokemonSettings: {
    pokemonId: string,
    type: string,
    type2: string,
    stats: {
      baseStamina: number,
      baseAttack: number,
      baseDefense: number,
    },
    quickMoves: string[],
    cinematicMoves: string[],
    shadow: {
      purifiedChargeMove: string,
      shadowChargeMove: string,
    } | undefined,
    form: string,
  };
}

export interface IGameMaster {
  itemTemplates: IItemTemplate[];
}
