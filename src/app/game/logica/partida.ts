import { Carta } from "./carta";
import { Jugador } from "./jugador";
import * as util from "./util";

export class Partida {
    jugadores!: Jugador[];
    jugadorActual!:Jugador;
    indexJugadorActual:number = 0;
    pilaCartas: Carta[] = [];
    direccion =  util.Direccion.NORMAL;


    //CARTAS ESPECIALES
    public reverseGame(){
        this.direccion = util.Direccion.INVERSA;
    }
    public saltarJugador(){
        this.indexJugadorActual++;
        this.jugadorActual = this.jugadores[this.indexJugadorActual];
    }
    
}

