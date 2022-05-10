import { Mano } from "./mano";
import { Carta } from "./carta";

export class Jugador {
    cartas: Mano = new Mano([]);
    nombre!: String;

    constructor(nombre:string, cartas:any) {
        this.nombre = nombre;
        this.cartas = new Mano(cartas);
    }
    //Elimina una carta de la mano del jugador 
    eliminarCarta(carta:Carta){
        this.cartas.remove(carta);
    }
}
