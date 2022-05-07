import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-partida-privada',
  templateUrl: './partida-privada.component.html',
  styleUrls: ['./partida-privada.component.css']
})
export class PartidaPrivadaComponent implements OnInit {

  matchID: string | null = null;
  nJugadores: number = 6;
  tiempoTurno: number = 10;
  players: Array<any> = [];
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public GameService: GameService) { }

  ngOnInit(): void {
    console.log("Valor en gamservice: ",this.GameService.partida);
    this.matchID = this.route.snapshot.paramMap.get('id');
    
    this.GameService.messageReceived.subscribe({
      next: (message: any) => {
        console.log("recibido en componente: ",message);
        if(Array.isArray(message)) { //Es array
          console.log("array");
        }
        if (message.hasOwnProperty('estado')) { //Es mensaje de inicio de partida
          console.log("json?")
        }
      }
    });

    this.nJugadores = this.GameService.partida.njugadores;
    this.tiempoTurno = this.GameService.partida.tturno;

    this.GameService.partida.jugadores.forEach( (e:any) => {
      console.log(e);
      this.players.push({ nombre: e.nombre, puntos: 10, pais: "?" }); //TODO: pillar puntos y pais
    });
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAa"+this.players)
  }

}


