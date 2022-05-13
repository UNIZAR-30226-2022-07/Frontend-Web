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

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public GameService: GameService, public userService: UsersService,private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    console.log("Valor en gamservice: ",this.GameService.partida);
    console.log("Valor en gamservice jug: ",this.GameService.jugadores);
    this.matchID = this.route.snapshot.paramMap.get('id');
    
    this.GameService.messageReceived.subscribe({
      next: (msg: any) => {
        let lastCard = util.BTF_carta(msg.carta.color, msg.carta.numero)
        //TODO:calcular nº de cartas
        this.GameService.pilaCartas.push(lastCard);
        msg.jugadores.forEach((j: { username: string; numeroCartas: any; }) => {
          
          this.GameService.jugadores.forEach(a => {
            if((a.nombre == j.username) && (j.username != this.userService.username)) {
              a.cartas.set(j.numeroCartas);
            }
          });
        });
        this.GameService.letoca = msg.turno;
        if(this.GameService.letoca == this.userService.username) {
          if(lastCard.value==util.Valor.DRAW2 || lastCard.value==util.Valor.DRAW4) {
            let mimano=this.GameService.jugadores[this.GameService.indexYo].cartas;
            if((this.GameService.reglas.indexOf(util.Reglas.BLOCK_DRAW)) && (mimano.has(new Carta(util.Valor.SKIP,util.Color.AMARILLO))||mimano.has(new Carta(util.Valor.SKIP,util.Color.AZUL))||mimano.has(new Carta(util.Valor.SKIP,util.Color.ROJO))||mimano.has(new Carta(util.Valor.SKIP,util.Color.VERDE)))) {
              return;
            }
            if(this.GameService.reglas.indexOf(util.Reglas.PROGRESSIVE_DRAW)){
              //TODO: robar cartas calculadas antes (ojo chaos draw)
              //TODO: skip turn
            }
            
            //TODO:robar X cartas (ojo chaos draw)
            //TODO: skip turn
            
          }


          let can = false;
          this.GameService.jugadores[this.GameService.indexYo].cartas.getArray().forEach(c => {
            if(util.sePuedeJugar(lastCard,c)) {
              can = true;
            }
          });
          if(!can) {
            //TODO:robar una carta (ojo chaos draw)
            if(this.GameService.reglas.indexOf(util.Reglas.REPEAT_DRAW)) {
              this.GameService.jugadores[this.GameService.indexYo].cartas.getArray().forEach(c => {
                if(util.sePuedeJugar(lastCard,c)) {
                  can = true;
                }
              });
              while(!can) {
                //TODO:robar una carta (ojo chaos draw)
                this.GameService.jugadores[this.GameService.indexYo].cartas.getArray().forEach(c => {
                  if(util.sePuedeJugar(lastCard,c)) {
                    can = true;
                  }
                });
                //TODO: skip turn
                return;
              }
            }
            //TODO: skip turn
            return;
          }
          //BLOCK_DRAW bloquear el robar
          //PROGRESIVE_DRAW stack +2 +4

          
        }
      }
    });

    this.nJugadores = this.GameService.partida.njugadores;
    this.tiempoTurno = this.GameService.partida.tturno;
    console.log("Mas movidas:", this.nJugadores, " ", this.tiempoTurno);
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


