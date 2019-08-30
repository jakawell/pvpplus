import { IPveMoveTemplate, IPvpMoveTemplate } from '../interfaces';

export class Move {
  public id: string;
  public type: string;

  public powerPve: number;
  public energyPve: number;
  public castTimePve: number;

  public powerPvp: number;
  public energyPvp: number;
  public turnsPvp: number;

  constructor(pveSource: IPveMoveTemplate, pvpSource: IPvpMoveTemplate) {
    this.id = pveSource.moveSettings.movementId;
    this.type = pveSource.moveSettings.pokemonType.split('_', 3)[2]; // remove the `POKEMON_` prefix
    this.powerPve = pveSource.moveSettings.power;
    this.energyPve = pveSource.moveSettings.energyDelta;
    this.castTimePve = pveSource.moveSettings.durationMs;
    this.powerPvp = pvpSource.combatMove.power;
    this.energyPvp = pvpSource.combatMove.energyDelta;
    this.turnsPvp = pvpSource.combatMove.durationTurns || 1;
  }
}
