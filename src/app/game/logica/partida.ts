import { Carta } from "./carta";
import { Jugador } from "./jugador";
import * as util from "./util";

export class Partida {
    jugadores!: Jugador[];
    pilaCartas: Carta[] = [];
    direccion!: util.Direccion.NORMAL;
}
