import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import * as util from "../game/logica/util";
import { Jugador } from "../game/logica/jugador"
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { GameService } from '../game.service';
import { UsersService } from '../users.service';
import { Carta } from '../game/logica/carta';
import { FriendService } from '../friend.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-partida-privada',
  templateUrl: './partida-privada.component.html',
  styleUrls: ['./partida-privada.component.css']
})
export class PartidaPrivadaComponent implements OnInit {

  matchID: string | null = null;
  nJugadores: number = 6;
  tiempoTurno: number = 10;
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw
  parseandomsg: boolean = false;
  
  private finished = new EventEmitter();


  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public gameService: GameService, public userService: UsersService,private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    
    console.log("Valor en gamservice: ",this.gameService.partida);
    console.log("Valor en gamservice jug: ",this.gameService.jugadores);
    this.matchID = this.route.snapshot.paramMap.get('id');
    
    this.gameService.messageReceived.subscribe({
      next: async (msg: any) => {
        if(!this.gameService.skipNextJugada){
          const that = this;
          if(this.parseandomsg) {
            console.log("Tengo que esperar")
            new Promise(function (resolve, reject) {
              that.finished.subscribe({
                next: (v: any) => {
                  console.log("Luz verde!")
                  resolve(true);
                }
              });
            }).then();
          }
          //--------------INICIALIZACION DE VARIABLES--------------
          let ultimaCarta = util.BTF_carta(msg.carta.color, msg.carta.numero)
          let jugadoresAntes = this.gameService.jugadores
          let jugadoresDespues = []
          let hanRobado = false;
          let hanJugado = false;
          let quienHaRobado: string[] = []
          let quienHaJugado: string[] = []
          msg.jugadores.forEach((j: { username: string; numeroCartas: any; }) => {
            jugadoresDespues.push(new Jugador(j.username,j.numeroCartas));
            jugadoresAntes.forEach(a => {
              if((a.nombre == j.username)) {
                if(j.username != this.userService.username) { //No soy yo
                  if((a.cartas.length() < j.numeroCartas)) { //Ha robado
                    hanRobado = true
                    quienHaRobado.push(j.username)
                    console.log(j.username+" ha robado: tenia "+a.cartas.length()+" y ahora tiene "+j.numeroCartas)
                  }
                  else if(a.cartas.length() > j.numeroCartas) { //Ha jugado
                    hanJugado = true;
                    quienHaJugado.push(j.username)
                    console.log(j.username+" ha jugado: tenia "+a.cartas.length()+" y ahora tiene "+j.numeroCartas)
                  }
                  else {
                    console.log(j.username+" no hizo nada: tenia "+a.cartas.length()+" y ahora tiene "+j.numeroCartas)
                  }
                  //Actualizar nº de cartas
                  a.cartas.set(j.numeroCartas);
                }
                else { //Soy yo
                  if((a.cartas.getFalso() < j.numeroCartas)) { //Ha robado
                    hanRobado = true
                    quienHaRobado.push(j.username)
                    console.log(j.username+" ha robado: tenia "+a.cartas.getFalso()+" y ahora tiene "+j.numeroCartas)
                  }
                  else if(a.cartas.getFalso() > j.numeroCartas) { //Ha jugado
                    hanJugado = true;
                    quienHaJugado.push(j.username)
                    console.log(j.username+" ha jugado: tenia "+a.cartas.getFalso()+" y ahora tiene "+j.numeroCartas)
                  }
                  else {
                    console.log(j.username+" no hizo nada: tenia "+a.cartas.getFalso()+" y ahora tiene "+j.numeroCartas)
                  }
                  //Actualizar nº de cartas falso
                  a.cartas.setFalso(j.numeroCartas);
                }
                
              }
            });
          });
          if(hanJugado) {
            console.log(quienHaJugado[0] + " ha jugado la carta ", ultimaCarta);
            this.gameService.pilaCartas.push(ultimaCarta);
          }
          let cardsToDraw = 0;
          if(this.gameService.hasRegla(util.Reglas.PROGRESSIVE_DRAW)) {
            let i = this.gameService.pilaCartas.length-1 
            while(i>0) {
              if(this.gameService.pilaCartas[i].value == util.Valor.DRAW2 && this.gameService.pilaCartas[i].accionTomadaPor=="") {
                cardsToDraw += 2;
              }
              else if(this.gameService.pilaCartas[i].value == util.Valor.DRAW4 && this.gameService.pilaCartas[i].accionTomadaPor=="") {
                cardsToDraw += 4;
              }
              else if(this.gameService.hasRegla(util.Reglas.BLOCK_DRAW) && this.gameService.pilaCartas[i].value == util.Valor.SKIP && this.gameService.pilaCartas[i].accionTomadaPor=="") {
                cardsToDraw += 0;
              }
              else {
                i=-1; //Salir del bucle
              }
              i = i-1
            }
          }
          else {
            if(ultimaCarta.value == util.Valor.DRAW2) {
              cardsToDraw = 2;
            }
            else if(ultimaCarta.value == util.Valor.DRAW4) {
              cardsToDraw = 4;
            }
          }
  
          let tengoQueRobar = false;
          //O me toca robar...
          if(cardsToDraw>0 && hanJugado && ultimaCarta.value != util.Valor.SKIP) {
            tengoQueRobar = true;
          }
          if(this.gameService.hasRegla(util.Reglas.BLOCK_DRAW) && cardsToDraw>0 && ultimaCarta.accionTomadaPor!="" && ultimaCarta.value == util.Valor.SKIP) { 
            tengoQueRobar = true;
          }
          if(!hanJugado) {
            cardsToDraw = 0;
          }
          //O no puedo jugar ninguna carta...
          let _canPlay = false;
          this.gameService.jugadores[this.gameService.indexYo].cartas.getArray().forEach(c => {
            if(this.gameService.hasRegla(util.Reglas.BLOCK_DRAW) && cardsToDraw>1){
              if(c.value == util.Valor.SKIP && c.color == ultimaCarta.color) {
                console.log("Me salvo por tener un bloqueo")
                tengoQueRobar = false
                _canPlay = true;
              }
            }
            if(util.sePuedeJugar(ultimaCarta,c)) { //Si tengo que robar, tengoQueRobar ya sera true, por lo que esto no tendra efecto
              _canPlay = true;
            }
          });
          if(this.gameService.hasRegla(util.Reglas.PROGRESSIVE_DRAW) && cardsToDraw>1){
            //Calcular cuales te salvan
            let posiblesSalvaciones = [
              new Carta(util.Valor.DRAW2,util.Color.AZUL),
              new Carta(util.Valor.DRAW2,util.Color.AMARILLO),
              new Carta(util.Valor.DRAW2,util.Color.ROJO),
              new Carta(util.Valor.DRAW2,util.Color.VERDE),
              new Carta(util.Valor.DRAW4,util.Color.INDEFINIDO),
              new Carta(util.Valor.DRAW4,util.Color.AMARILLO), //NOTE: teoricamente imposible, pero por si acaso
              new Carta(util.Valor.DRAW4,util.Color.AZUL), //NOTE: teoricamente imposible, pero por si acaso
              new Carta(util.Valor.DRAW4,util.Color.ROJO), //NOTE: teoricamente imposible, pero por si acaso
              new Carta(util.Valor.DRAW4,util.Color.VERDE), //NOTE: teoricamente imposible, pero por si acaso
            ];
            let i=0;
            posiblesSalvaciones.forEach(c => {
              if(!util.isWild(c.value) && !(c.value==ultimaCarta.value || c.color==ultimaCarta.color)) {
                posiblesSalvaciones.splice(i,1);
              }
              i++;
            });
            console.log("Me salvan:",posiblesSalvaciones);
            posiblesSalvaciones.forEach(c => {
              if(this.gameService.jugadores[this.gameService.indexYo].cartas.has(c)) {
                console.log("me salvo por tener un +2 o +4 jugable");
                tengoQueRobar = false
                _canPlay = true;
              }
            });
          }
          if(!_canPlay && !(hanJugado && ultimaCarta.value == util.Valor.SKIP)) {
            tengoQueRobar = true;
            if(cardsToDraw==0) {
              cardsToDraw = 1;
            }
          }
          let acaboDeRobar = false;
          if(hanRobado && (quienHaRobado[0] == this.userService.username) && !(this.gameService.hasRegla(util.Reglas.REPEAT_DRAW) && (cardsToDraw==1))) {
            console.log("acaboDeRobar")
            acaboDeRobar = true;
            tengoQueRobar = false;
          }
          else {
            console.log("noAcaboDeRobar o tengo que seguir robando")
          }
          
  
          let letoca = msg.turno
          let mesaltan = false
          if(hanJugado && ultimaCarta.accionTomadaPor=="" && ultimaCarta.value==util.Valor.SKIP && cardsToDraw<2) {
            if(letoca == this.userService.username) {
              console.log("Me estan saltando")
              tengoQueRobar = false;
              mesaltan = true
            }
            ultimaCarta.accionTomadaPor = letoca;
          }
          console.log("Ultima carta: ",this.gameService.pilaCartas[this.gameService.pilaCartas.length-1])
          
          if(hanRobado) { //Actualizar las cartas
            let i = this.gameService.pilaCartas.length-1 
            while(i>0) {
              if(this.gameService.pilaCartas[i].value == util.Valor.DRAW2 && this.gameService.pilaCartas[i].accionTomadaPor=="") {
                this.gameService.pilaCartas[i].accionTomadaPor = quienHaRobado[0];
              }
              else if(this.gameService.pilaCartas[i].value == util.Valor.DRAW4 && this.gameService.pilaCartas[i].accionTomadaPor=="") {
                this.gameService.pilaCartas[i].accionTomadaPor = quienHaRobado[0];
              }
              else if(this.gameService.hasRegla(util.Reglas.BLOCK_DRAW) && this.gameService.pilaCartas[i].value == util.Valor.SKIP && this.gameService.pilaCartas[i].accionTomadaPor=="") {
                this.gameService.pilaCartas[i].accionTomadaPor = quienHaRobado[0];
              }
              else {
                i=-1; //Salir del bucle
              }
              i = i-1
            }
          }

          //--------------QUE HAY QUE HACER EN ESTE TURNO--------------
  
          
          if(hanRobado) {
            console.log("Jugadores han robado ",quienHaRobado)
          }
  
          if(letoca == this.userService.username) { //Me toca
            console.log("Me toca")
            if(acaboDeRobar) {
              //Pasar turno
              console.log("Paso turno")
              await this.delay(500);
              await this.gameService.send(
                { },
                "/game/pasarTurno/",
                undefined
              ).then()
            }
            if(tengoQueRobar) {
              this.gameService.letoca = "";
              //Robar cardsToDraw
              this.gameService.robando = true;
              if(!acaboDeRobar) {
                console.log("Tengo que robar "+cardsToDraw)
                this.gameService.robar(cardsToDraw);
                this.changeMano().then();
              }
            }
            else {
              if(hanJugado) {
                if(mesaltan) {
                  //Pasar turno
                  console.log("Me saltan")
                  this.gameService.robando = true;
                  await this.delay(500);
                  await this.gameService.send(
                    { },
                    "/game/pasarTurno/",
                    undefined
                  ).then()
                }
              }
              this.gameService.letoca = letoca;
            }
            
          }
          else {
            this.gameService.robando = false;
            this.gameService.letoca = letoca;
          }
          this.finished.emit(true);
        }
        this.gameService.skipNextJugada = false;
      }
    });

    this.nJugadores = this.gameService.partida.njugadores;
    this.tiempoTurno = this.gameService.partida.tturno;
  }

  async beginGame() {
    await this.gameService.send(
      { },
      "/game/begin/",
      undefined
    ).then();
  }

  copyText() {
    this.clipboardApi.copyFromContent(this.gameService.id);
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

  async goBack() {
    await this.gameService.send(
      { },
      "/game/disconnect/",
      undefined
    ).then();
  }

  async expulsar(user:string) {
    await this.gameService.send(
      { },
      "/game/disconnect/",
      {"Authorization": "Bearer " + this.userService.getToken(),"username":user}
    ).then();
  }

  openFriends(): void {
    const dialogRef2 = this.dialog.open(FriendList,
      {
        data: this.userService.username,
        position: {
          top: '0px',
          right: '0px'
         
        },
        height: '100vh',
        width: '25%'
      });
  }

  abrirReglas(): void {
    const dialogRef2 = this.dialog.open(Reglas,
      {
        data: this.userService.username,
        position: {
          top: '0px',
          right: '0px'
         
        },
        height: '100vh',
        width: '25%'
      });
  }
  
}




@Component({
  selector: 'friend-list',
  templateUrl: 'friend-list.html',
  styleUrls: ['./partida-privada.component.css']
})
export class FriendList {

  
  searchText!: string;

  name : string | null = null;

  
  listaAmigos: Array<string> = [];
  
  cuerpo_mensaje: any;
  mensaje_final:any;
  
  
  amigos_vacio:boolean;


  

  

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public friendService: FriendService, public gameService: GameService, public _snackbar:MatSnackBar) {
    this.name = data.name;
    this.amigos_vacio = true;

  }
  
  ngOnInit(): void {
    // this.listaAmigos = [{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"},{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"},{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"},{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"}]
    console.log("hola");
   
    this.friendService.getFriends().subscribe({
      next: (data) => {
        
        const msg = data.message;
        this.cuerpo_mensaje = msg.split("\"");

        if (data == null){
          console.log("no tengo amigos");
          this.amigos_vacio = true;
        }else{
          this.amigos_vacio = false;
          console.info("Mensaje recibido: ", data.message);
          for (let n = 0; (2*n + 1) < this.cuerpo_mensaje.length; n++) {
            this.listaAmigos.push(this.cuerpo_mensaje[2*n + 1]);
          }
            
        }
      

      },
      error: (e) =>{
        if (e.status == 401) {
          console.log("ha ido mal");
        }
        else {
          console.error(e);
          
        }
      }
    })
  }


  inviteFriends(friend:string): void{
    console.log("El nombre del amigo es: " + friend);
 
    this.gameService.inviteFriend(friend).subscribe({
      next: (v) => {
        console.log("Ha ido bien");
        this._snackbar.open("Invitación enviada con éxito",'',{duration: 4000});

      },
      error: (e) =>{
        console.log("Ha ido mal");
        console.log(e.message);
      }
    }) 

  }

 

  



}

@Component({
  selector: 'reglas',
  templateUrl: 'reglas.html',
  styleUrls: ['./partida-privada.component.css']
})
export class Reglas {

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public gameService: GameService, public userService: UsersService,private clipboardApi: ClipboardService){

  }

  


}
