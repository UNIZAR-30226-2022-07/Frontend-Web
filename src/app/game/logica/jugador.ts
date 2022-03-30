import { Mano } from "./mano";
import { Carta } from "./carta";

export class Jugador {
    mano: Mano = new Mano();
    nombre!: String;

    constructor(name:string) {
        this.nombre = name;
    }
    //Elimina una carta de la mano del jugador 
    eliminarCarta(carta:Carta){
        this.mano.remove(carta);
    }
}
