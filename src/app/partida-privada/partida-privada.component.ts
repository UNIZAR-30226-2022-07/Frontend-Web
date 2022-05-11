import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public GameService: GameService, public userService: UsersService) { }

  ngOnInit(): void {
    console.log("Valor en gamservice: ",this.GameService.partida);
    console.log("Valor en gamservice jug: ",this.GameService.jugadores);
    this.matchID = this.route.snapshot.paramMap.get('id');
    
    // this.GameService.messageReceived.subscribe({
    //   next: (message: any) => {
    //     console.log("recibido en componente: ",message);
    //     if(Array.isArray(message)) { //Es array
    //       console.log("array");
    //     }
    //     if (message.hasOwnProperty('estado')) { //Es mensaje de inicio de partida
    //       console.log("json?")
    //     }
    //   }
    // });

    this.nJugadores = this.GameService.partida.njugadores;
    this.tiempoTurno = this.GameService.partida.tturno;
  }

  async beginGame() {
    await this.GameService.send(
      { },
      "/game/begin/"
    ).then();
  }
}


