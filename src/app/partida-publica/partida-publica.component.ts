import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { GameService } from '../game.service';
import { UsersService } from '../users.service';
import { FriendService } from '../friend.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-partida-publica',
  templateUrl: './partida-publica.component.html',
  styleUrls: ['./partida-publica.component.css']
})
export class PartidaPublicaComponent implements OnInit {

  matchID: string | null = null;
  nJugadores: number = 6;
  tiempoTurno: number = 10;
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw


  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public gameService: GameService, public userService: UsersService,private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    this.matchID = this.route.snapshot.paramMap.get('id');

    this.nJugadores = this.gameService.partida.njugadores;
    this.tiempoTurno = this.gameService.partida.tturno;
  }

  async goBack() {
    await this.gameService.send(
      { },
      "/game/disconnect/",
      undefined
    ).then();
  }
}




