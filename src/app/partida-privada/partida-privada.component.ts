import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-partida-privada',
  templateUrl: './partida-privada.component.html',
  styleUrls: ['./partida-privada.component.css']
})
export class PartidaPrivadaComponent implements OnInit {

  matchID: string | null = null;
  nJugadores: number = 6;
  tiempoTurno: number = 10;
  players!: Array<any>;
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.websocketService.messageReceived.subscribe({
      next: (message: any) => {
        console.log("recibido en componente: ",message);
      }
    });
    this.matchID = this.route.snapshot.paramMap.get('id');

    this.players = [
      {
        nombre: "Helios",
        puntos: 73,
        pais: "España"
      },
      {
        nombre: "3nsalada",
        puntos: 50,
        pais: "España"
      },
      {
        nombre: "Radek",
        puntos: 210,
        pais: "Polonia"
      },
      {
        nombre: "Victor",
        puntos: 10,
        pais: "España"
      },
    ];
  }

}


