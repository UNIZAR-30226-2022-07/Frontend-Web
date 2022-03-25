import { viewClassName } from '@angular/compiler';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Carta } from './logica/carta';
import { Jugador } from './logica/jugador';
import { Mano } from './logica/mano';
import { Partida } from './logica/partida';
import * as util from "./logica/util";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  //Lista de jugadores
  jugadores: Jugador[] = [];
  //Index del array jugadores que eres tu. NOTE: Cambiar cada vez que se cambia el turno
  indexYo = 0; 
  //Pila de cartas central
  pilaCartas: Carta[] = []; 
  //Direccion del juego
  direccion:util.Direccion =  util.Direccion.NORMAL;
  //Vector de numeros aleatorios para la rotacion de las cartas de la pila central
  randomRotation: number[] = [35, 287, 193, 9, 190, 165, 33, 141, 179, 335, 318, 173, 176, 303, 68, 292, 17, 37, 198, 43, 24, 211, 279, 102, 74, 282, 31, 101, 39, 208, 168, 13, 229, 76, 277, 52, 127, 115, 295, 178, 296, 290, 348, 192, 113, 42, 215, 324, 11, 358, 309, 83, 313, 124, 250, 289, 6, 77, 258, 46, 199, 87, 128, 53, 45, 204, 323, 314, 174, 345, 197, 103, 244, 298, 28, 16, 130, 340, 14, 272, 149, 317, 156, 104, 350, 216, 283, 136, 51, 106, 238, 66, 221, 60, 81, 79, 185, 67, 306, 359, 92, 341, 99, 123, 189, 214, 1, 134, 333, 25, 120, 180 ]
  victor: Jugador = new Jugador("victor"); //Prueba

  constructor() { }

  ngOnInit(): void {
    this.victor.mano.add(new Carta(util.Valor.UNO,util.Color.ROJO));
    this.victor.mano.add(new Carta(util.Valor.DOS,util.Color.ROJO));
    this.victor.mano.add(new Carta(util.Valor.TRES,util.Color.ROJO));
    this.victor.mano.add(new Carta(util.Valor.CUATRO,util.Color.ROJO));
    this.jugadores.push(this.victor);

    this.pilaCartas.push(new Carta(util.Valor.UNO,util.Color.AZUL));
    this.pilaCartas.push(new Carta(util.Valor.DOS,util.Color.AZUL));
    this.pilaCartas.push(new Carta(util.Valor.TRES,util.Color.AZUL));
    this.pilaCartas.push(new Carta(util.Valor.CUATRO,util.Color.AZUL));
  }

}
