import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { GameService } from '../game.service';
import { UsersService } from '../users.service';
import { FriendService } from '../friend.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-partida-torneo',
  templateUrl: './partida-torneo.component.html',
  styleUrls: ['./partida-torneo.component.css']
})
export class PartidaTorneoComponent implements OnInit {

  matchID: string | null = null;
  nJugadores: number = 3;


  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public gameService: GameService, public userService: UsersService,private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    this.matchID = this.route.snapshot.paramMap.get('id');
  }
}




