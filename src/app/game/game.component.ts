import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Carta } from './logica/carta';
import { Jugador } from './logica/jugador';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  //Variables temporales
  tempJugador: Jugador|undefined;
  //Pruebas
  victor: Jugador = new Jugador("victor"); 
  marcos: Jugador = new Jugador("marcos"); 
  cesar: Jugador = new Jugador("cesar"); 

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
    //TODO: Request a backend de todos los datos. Por ahora son datos falsos
    //Pruebas
    this.victor.mano.add(new Carta(util.Valor.UNO,util.Color.ROJO));
    this.victor.mano.add(new Carta(util.Valor.DOS,util.Color.ROJO));
    this.victor.mano.add(new Carta(util.Valor.TRES,util.Color.ROJO));
    this.victor.mano.add(new Carta(util.Valor.CUATRO,util.Color.ROJO));
    this.victor.mano.add(new Carta(util.Valor.WILD,util.Color.INDEFINIDO));
    this.victor.mano.add(new Carta(util.Valor.DRAW4,util.Color.INDEFINIDO));
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

  //Ejecutado cuando se hace click en una carta
  async playCard(c: Carta) {
    if(util.sePuedeJugar(this.pilaCartas[this.pilaCartas.length-1],c)) {
      //Borrar carta de la mano
      this.jugadores[this.indexYo].mano.remove(c);
      //Efectos especiales
      if(util.isWild(c.value)) {
        await this.popupColor(c);
      }
      if(c.value == util.Valor.REVERSE) {
        if (this.direccion == util.Direccion.NORMAL) {
          this.direccion = util.Direccion.INVERSA;
        }
        else {
          this.direccion = util.Direccion.NORMAL;
        }
        
      }
      //Añadirla al centro
      this.pilaCartas.push(c)
    }
  }

  //Ejecutado cuando el jugador presiona el boton UNO de otro jugador para recordarle que no lo ha presionado
  //index es el indice del jugador en el array "jugadores"
  sayUno(index:number) {
    //TODO
    return;
  }

  //Ejecutado cuando se quiere pasar al siguiente turno.
  siguienteTurno() {
    if (this.direccion == util.Direccion.NORMAL) {
      this.tempJugador = this.jugadores.shift();
      if (this.tempJugador !== undefined) {
        this.jugadores.push(this.tempJugador);
        this.indexYo = (this.indexYo-1) % this.jugadores.length;
      }
    }
    else {
      this.tempJugador = this.jugadores.pop();
      if (this.tempJugador !== undefined) {
        this.jugadores.unshift(this.tempJugador);
        this.indexYo = (this.indexYo+1) % this.jugadores.length;
      }
    }
  }

  async popupColor(c:Carta) {
    const dialogRef = this.dialog.open(ChoseColorComponent);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      c.color = result;
    })
  }


  
}
@Component({
  selector: 'chosecolor',
  templateUrl: 'chosecolor.html',
  styleUrls: ['chosecolor.css']
})
export class ChoseColorComponent {
  constructor(public dialogRef: MatDialogRef<ChoseColorComponent>) {}
  close(n: number) {
    this.dialogRef.close(n);
  }
}
