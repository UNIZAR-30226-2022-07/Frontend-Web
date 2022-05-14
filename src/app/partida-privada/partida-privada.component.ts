import { Component, OnInit } from '@angular/core';
import * as util from "../game/logica/util";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { GameService } from '../game.service';
import { UsersService } from '../users.service';
import { Carta } from '../game/logica/carta';

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
  stackCard: number = 0;
  hanrobado:boolean = false;

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public GameService: GameService, public userService: UsersService,private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    console.log("Valor en gamservice: ",this.GameService.partida);
    console.log("Valor en gamservice jug: ",this.GameService.jugadores);
    this.matchID = this.route.snapshot.paramMap.get('id');
    
    this.GameService.messageReceived.subscribe({
      next: async (msg: any) => {
        if(this.GameService.letoca == msg.turno) {
          this.hanrobado = true;
          return;
        }
        let lastCard = util.BTF_carta(msg.carta.color, msg.carta.numero)
        if(lastCard.value == util.Valor.DRAW2) {
          this.stackCard += 2;
        }
        if(lastCard.value == util.Valor.DRAW4) {
          this.stackCard += 4;
        }
        if(!util.isSpecial(lastCard.value)) {
          this.stackCard = 0; //NOTE: innecesario pero por si acaso
        }
        console.log("stackCard:", this.stackCard);

        let someoneDrawThisTurn = this.hanrobado;
        
        msg.jugadores.forEach((j: { username: string; numeroCartas: any; }) => {
          this.GameService.jugadores.forEach(a => {
            if((a.nombre == j.username) && (j.username != this.userService.username)) {
              if((a.cartas.length < j.numeroCartas)) { //Ha robado
                someoneDrawThisTurn = true
              }
              //TODO: detectar bloqueo
              a.cartas.set(j.numeroCartas);
            }
          });
        });
        if(someoneDrawThisTurn) { this.stackCard = 0; console.log("Alguien ha robado o skipeado"); }
        else if(!this.hanrobado) { this.GameService.pilaCartas.push(lastCard); }
        this.GameService.letoca = msg.turno;
        let anteriorValor = this.hanrobado
        this.hanrobado = false;
        if(this.GameService.letoca == this.userService.username) {
          console.log("metoca");
          if((lastCard.value==util.Valor.DRAW2 || lastCard.value==util.Valor.DRAW4) && !anteriorValor) {
            console.log("+2 o +4")
            let mimano=this.GameService.jugadores[this.GameService.indexYo].cartas;
            if((this.GameService.reglas.indexOf(util.Reglas.BLOCK_DRAW) != -1) && (mimano.has(new Carta(util.Valor.SKIP,util.Color.AMARILLO))||mimano.has(new Carta(util.Valor.SKIP,util.Color.AZUL))||mimano.has(new Carta(util.Valor.SKIP,util.Color.ROJO))||mimano.has(new Carta(util.Valor.SKIP,util.Color.VERDE)))) {
              console.log("me salvo por tener un bloqueo")
              return;
            }
            if(this.GameService.reglas.indexOf(util.Reglas.PROGRESSIVE_DRAW) != -1){
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
                if(!util.isWild(c.value) || !(c.value==lastCard.value || c.color==lastCard.color)) {
                  posiblesSalvaciones.splice(i,1);
                }
                i++;
              });

              posiblesSalvaciones.forEach(c => {
                if(mimano.has(c)) {
                  console.log("me salvo por tener un +2 o +4 jugable");
                  return;
                }
              });
              
              console.log("Voy a robar ",this.stackCard)
              this.GameService.acaboderobar = true;
              this.GameService.robar(this.stackCard);
              this.changeMano().then();
              await this.delay(3000);
              this.stackCard = 0;
              await this.GameService.send(
                { },
                "/game/pasarTurno/",
                undefined
              ).then()
              this.GameService.acaboderobar = false;
            }
            if(!someoneDrawThisTurn) {
              if(lastCard.value == util.Valor.DRAW2) {
                console.log("Voy a robar 2")
                this.GameService.acaboderobar = true;
                this.GameService.robar(2);
                this.changeMano().then();
                await this.delay(3000);
              }
              else { // es +4
                console.log("Voy a robar 4")
                this.GameService.acaboderobar = true;
                this.GameService.robar(4);
                this.changeMano().then();
                await this.delay(3000);

              }
              await this.GameService.send(
                { },
                "/game/pasarTurno/",
                undefined
              ).then()
              this.GameService.acaboderobar = false;
              return;
            }
          }


          let can = false;
          this.GameService.jugadores[this.GameService.indexYo].cartas.getArray().forEach(c => {
            if(util.sePuedeJugar(lastCard,c)) {
              can = true;
            }
          });
          if(!can) {
            console.log("No puedo jugar, tengo que robar")
            this.GameService.acaboderobar = true;
            this.GameService.robar(1);
            this.changeMano().then();
            await this.delay(3000);
            if(this.GameService.reglas.indexOf(util.Reglas.REPEAT_DRAW) != -1) {
              this.GameService.jugadores[this.GameService.indexYo].cartas.getArray().forEach(c => {
                if(util.sePuedeJugar(lastCard,c)) {
                  can = true;
                }
              });
              while(!can) {
                console.log("No puedo jugar, tengo que seguir robando")
                this.GameService.robar(1);
                this.changeMano().then();
                await this.delay(3000);
                this.GameService.jugadores[this.GameService.indexYo].cartas.getArray().forEach(c => {
                  if(util.sePuedeJugar(lastCard,c)) {
                    can = true;
                  }
                });
                await this.GameService.send(
                  { },
                  "/game/pasarTurno/",
                  undefined
                ).then()
                this.GameService.acaboderobar = false;
                return;
              }
            }
            await this.GameService.send(
              { },
              "/game/pasarTurno/",
              undefined
            ).then()
            return;
          }          
        }
      }
    });

    this.nJugadores = this.GameService.partida.njugadores;
    this.tiempoTurno = this.GameService.partida.tturno;
  }

  async beginGame() {
    await this.GameService.send(
      { },
      "/game/begin/",
      undefined
    ).then();
  }

  copyText() {
    this.clipboardApi.copyFromContent(this.GameService.id);
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async changeMano():Promise<any> {
    const that = this;
    return new Promise(function (resolve, reject) {
      that.GameService.privatemsg.subscribe({
        next: async (msg: any) => {
          resolve(msg);
        }
      });
    });
  }

  async goBack() {
    await this.GameService.send(
      { },
      "/game/disconnect/",
      undefined
    ).then();
  }

  async expulsar(user:string) {
    await this.GameService.send(
      { },
      "/game/disconnect/",
      {"Authorization": "Bearer " + this.userService.getToken(),"username":user}
    ).then();
  }
}


