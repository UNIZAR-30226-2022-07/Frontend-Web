import { Component, Inject, OnInit, ViewContainerRef } from '@angular/core';
import { Carta } from './logica/carta';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as util from "./logica/util";
import { Message } from './message';
import { UsersService } from '../users.service';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jugador } from './logica/jugador';
import { Mano } from './logica/mano';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  //Chat
  history: Message[] = [];
  //Direccion del juego
  direccion:util.Direccion =  util.Direccion.NORMAL;
  //Vector de numeros aleatorios para la rotacion de las cartas de la pila central
  randomRotation: number[] = Array.from({length: 50}, () => Math.floor(Math.random() * 360)); 
  // randomRotation: number[] = []
  //Ganador de la partida
  winner:string = "";
  //Si la partida ha terminado
  end:boolean = false;

  constructor(public dialog:MatDialog,public dialog2:MatDialog, public gameService: GameService, public userService: UsersService, public router: Router, private _snackBar: MatSnackBar,private http: HttpClient) { }

  ngOnInit(): void {
    this.gameService.chat.subscribe({
      next: (m: Message) => {
        this.history.push(m);
      }
    });
    this.gameService.winner.subscribe({
      next: (m: string) => {
        this.winner = m;
        this.end = true;
      }
    });
  }

  //Ejecutado cuando se hace click en una carta
  async playCard(c: Carta) {
    if(this.gameService.letoca != this.userService.username) { console.log("No te toca"); return; }
    if(util.sePuedeJugar(this.gameService.pilaCartas[this.gameService.pilaCartas.length-1],c)) {
      //Borrar carta de la mano
      this.gameService.jugadores[this.gameService.indexYo].cartas.remove(c);
      //Efectos especiales
      if(util.isWild(c.value)) {
        await this.popupColor(c).then();
      }
      let user: string = "";
      if(this.gameService.partida.reglas.includes('CRAZY_7') && c.value == util.Valor.SIETE){
        user = await this.popupJugador().then();
        console.log("Cambiando mano con "+user);
        let j1 = new Jugador("TEMP",new Mano([]));
        let j2 = new Jugador("TEMP",new Mano([]));
        this.gameService.jugadores.forEach(j => {
          if(j.nombre == this.userService.username) {j1 = j}
          if(j.nombre == user) {j2 = j} 
        });
        let temp = j1.cartas.getFalso()
        console.log("temp:"+temp,j1,j2)
        j1.cartas.setFalso(j2.cartas.length())
        j2.cartas.set(temp);
        
      }

      if(!this.gameService.saidUno && this.gameService.jugadores[this.gameService.indexYo].cartas.length() == 1) {
        this.gameService.robando = true;
        console.log("No dije uno!")
        this.gameService.skipNextJugada = true;
        this.gameService.pilaCartas.push(c);
        this._snackBar.open('??No dijiste uno!', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000
        });
        await this.delay(3000);
        this.gameService.robar(2);
        await this.changeMano().then();
      }
      //Enviar jugada a backend
      await this.gameService.send(
        util.FTB_carta(c),
        "/game/card/play/",
        undefined
      ).then()
      if(this.gameService.partida.reglas.includes('CERO_SWITCH') && c.value == util.Valor.CERO){
        let i = 0
        this.gameService.jugadores.forEach(element => {
          if(i!=0) {
            console.log("Cambiando mano "+element.nombre+" con "+this.gameService.jugadores[0].nombre)
            this.gameService.cambiarMano(element.nombre,this.gameService.jugadores[0].nombre);
          }
          i = (i+1)
        });
      }
      if(this.gameService.partida.reglas.includes('CRAZY_7') && c.value == util.Valor.SIETE){
        this.gameService.cambiarMano(this.userService.username,user);
      }
      this.gameService.saidUno = false;
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async changeMano():Promise<any> {
    const that = this;
    return new Promise(function (resolve, reject) {
      that.gameService.privatemsg.subscribe({
        next: async (msg: any) => {
          resolve(msg);
        }
      });
    });
  }

  //Yo digo uno
  sendUno() {
    this.gameService.saidUno = true;
  }

  //Ejecutado cuando se quiere pasar al siguiente turno.
  siguienteTurno() {
    if (this.direccion == util.Direccion.NORMAL) {
      let tempJugador = this.gameService.jugadores.shift();
      if (tempJugador !== undefined) {
        this.gameService.jugadores.push(tempJugador);
        this.gameService.indexYo = (this.gameService.indexYo-1) % this.gameService.jugadores.length;
      }
    }
    else {
      let tempJugador = this.gameService.jugadores.pop();
      if (tempJugador !== undefined) {
        this.gameService.jugadores.unshift(tempJugador);
        this.gameService.indexYo = (this.gameService.indexYo+1) % this.gameService.jugadores.length;
      }
    }
  }

  async salir() {
    console.log("Laprueba: ", this.winner, this.userService.username, this.winner == this.userService.username)
    if(this.gameService.psemiTorneo && (this.winner == this.userService.username)) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': "Bearer "+this.userService.getToken()
        }),
        withCredentials: true
      };
      let test: Observable<any> = this.http.post("https://onep1.herokuapp.com/torneo/jugarFinal",
      {
        username : this.userService.username,
        torneoId : this.gameService.idTorneo
      },
      httpOptions)
      test.subscribe({
        next: async (v: string) => {
          console.log("He recibido Final: ",v)
          //Unirse a la partida
          await this.gameService.restart().then()
          this.gameService.ptorneo = true;
          this.gameService.id = v;
          await this.gameService.infoMatch(this.gameService.id).then(async x => {
            await this.gameService.joinMatch(this.gameService.id).then(async x => {
              this.router.navigateByUrl("/partidaTorneo/"+this.gameService.id)
            });
          })
          
        },
        error: (e:any) => {
          console.error(e);
        }
      });
    }
    else {
      await this.gameService.restart().then();
      this.router.navigateByUrl("");
    }
  }

  async popupColor(c:Carta): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const dialogRef = this.dialog.open(ChoseColorComponent);
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
        c.color = result;
        resolve(true)
      })
    });
  }

  async popupJugador(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const dialogRef = this.dialog.open(ChosePlayerComponent);
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      })
    });
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
  selector: 'choseplayer',
  templateUrl: 'choseplayer.html',
  styleUrls: ['choseplayer.css']
})
export class ChosePlayerComponent {
  constructor(public dialogRef: MatDialogRef<ChosePlayerComponent>, public gameService: GameService, public userService: UsersService) {}
  close(n: string) {
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
    this.historyPopup = data;
  }
  historyPopup!: Message[]
  msg !: string;

  sendMsg() {
    this.gameService.stompClient.send(
      "/game/message/"+this.gameService.id,
      {"Authorization": "Bearer " + this.userService.getToken(),"username":this.userService.username},
      this.msg);
    this.msg = "";
  }
}
