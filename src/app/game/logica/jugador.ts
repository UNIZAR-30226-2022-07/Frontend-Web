import { Mano } from "./mano";
import { Carta } from "./carta";

export class Jugador {
    cartas: Mano = new Mano([]);
    nombre!: string;

    constructor(nombre:string, cartas:Mano) {
        this.nombre = nombre;
        this.cartas = cartas
    }
    //Elimina una carta de la mano del jugador 
    eliminarCarta(carta:Carta){
        this.cartas.remove(carta);
    }
}
