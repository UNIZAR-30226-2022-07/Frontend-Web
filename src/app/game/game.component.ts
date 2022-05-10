import { Component, Inject, OnInit, ViewContainerRef } from '@angular/core';
import { Carta } from './logica/carta';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as util from "./logica/util";
import { Message } from './message';
import { UsersService } from '../users.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  //Chat
  history: Message[] = [];
  //Index del array jugadores que eres tu. NOTE: Cambiar cada vez que se cambia el turno
  indexYo = 0; 
  //Pila de cartas central
  pilaCartas: Carta[] = []; 
  //Direccion del juego
  direccion:util.Direccion =  util.Direccion.NORMAL;
  //Vector de numeros aleatorios para la rotacion de las cartas de la pila central
  randomRotation: number[] = Array.from({length: 108}, () => Math.floor(Math.random() * 360)); 

  constructor(public dialog:MatDialog,public dialog2:MatDialog, public gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.chat.subscribe({
      next: (m: Message) => {
        this.history.push(m);
      }
    });

    

    this.pilaCartas.push(util.BTF_carta(this.gameService.partida.ultimaCartaJugada.color, this.gameService.partida.ultimaCartaJugada.numero));
  }

  //Ejecutado cuando se hace click en una carta
  async playCard(c: Carta) {
    if(util.sePuedeJugar(this.pilaCartas[this.pilaCartas.length-1],c)) {
      //Borrar carta de la mano
      this.gameService.jugadores[this.indexYo].cartas.remove(c);
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
      let tempJugador = this.gameService.jugadores.shift();
      if (tempJugador !== undefined) {
        this.gameService.jugadores.push(tempJugador);
        this.indexYo = (this.indexYo-1) % this.gameService.jugadores.length;
      }
    }
    else {
      let tempJugador = this.gameService.jugadores.pop();
      if (tempJugador !== undefined) {
        this.gameService.jugadores.unshift(tempJugador);
        this.indexYo = (this.indexYo+1) % this.gameService.jugadores.length;
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

  openChat(){
    const dialogRef2 = this.dialog2.open(ChatComponent,
      {
        data: this.history,
        position: {
          top: '0px',
          left: '0px'
        },
        height: '100vh',
        width: '25%'
      });
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

@Component({
  selector: 'chat',
  templateUrl: 'chat.html',
  styleUrls: ['chat.css']
})
export class ChatComponent{
  constructor(public dialogRef: MatDialogRef<ChatComponent>,@Inject(MAT_DIALOG_DATA) public data: Message[], public userService: UsersService, public gameService: GameService) {
    this.historyPopup = data
    this.gameService.chat.subscribe({
      next: (m: Message) => {
        this.historyPopup.push(m);
      }
    });
  }
  historyPopup!: Message[]
  msg !: string;

  sendMsg() {
    this.gameService.send(
      { message: this.msg },
      "/message/"
    )
    this.msg = "";
  }
}
