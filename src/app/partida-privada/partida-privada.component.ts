import { Component, OnInit } from '@angular/core';
import * as util from "../game/logica/util";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { GameService } from '../game.service';
import { UsersService } from '../users.service';

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
        this.GameService.pilaCartas.push(util.BTF_carta(msg.carta.color, msg.carta.numero));
        msg.jugadores.forEach((j: { username: string; numeroCartas: any; }) => {
          
          this.GameService.jugadores.forEach(a => {
            if((a.nombre == j.username) && (j.username != this.userService.username)) {
              a.cartas.set(j.numeroCartas);
            }
          });
        });
        this.GameService.letoca = msg.turno;
        if(this.GameService.letoca == this.userService.username) {
          //TODO: chupate X
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


