import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Carta } from './logica/carta';
import { Jugador } from './logica/jugador';
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
  randomRotation: number[] = Array.from({length: 108}, () => Math.floor(Math.random() * 360)); 
  //Pruebas
  victor: Jugador = new Jugador("victor"); 
  marcos: Jugador = new Jugador("marcos"); 
  cesar: Jugador = new Jugador("cesar"); 

  constructor() { }

  ngOnInit(): void {
    //Pruebas
    this.victor.mano.add(new Carta(util.Valor.UNO,util.Color.ROJO));
    this.victor.mano.add(new Carta(util.Valor.DOS,util.Color.ROJO));
    this.victor.mano.add(new Carta(util.Valor.TRES,util.Color.ROJO));
    this.victor.mano.add(new Carta(util.Valor.CUATRO,util.Color.ROJO));
    this.jugadores.push(this.victor);

    this.cesar.mano.add(new Carta(util.Valor.UNO,util.Color.ROJO));
    this.jugadores.push(this.cesar);

    this.marcos.mano.add(new Carta(util.Valor.UNO,util.Color.ROJO));
    this.marcos.mano.add(new Carta(util.Valor.DOS,util.Color.ROJO));
    this.jugadores.push(this.marcos);

    this.pilaCartas.push(new Carta(util.Valor.UNO,util.Color.AZUL));
    this.pilaCartas.push(new Carta(util.Valor.DOS,util.Color.AZUL));
    this.pilaCartas.push(new Carta(util.Valor.TRES,util.Color.AZUL));
    this.pilaCartas.push(new Carta(util.Valor.CUATRO,util.Color.AZUL));
  }

}
