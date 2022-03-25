import { Mano } from "./mano";

export class Jugador {
    mano: Mano = new Mano();
    nombre!: String;

    constructor(name:string) {
        this.nombre = name;
    }
}
