import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../game.service';
import * as util from "../game/logica/util";

@Component({
  selector: 'app-torneo-espera',
  templateUrl: './torneo-espera.component.html',
  styleUrls: ['./torneo-espera.component.css']
})
export class TorneoEsperaComponent implements OnInit {
  tournamentID: string | null = null;
  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog, public gameService: GameService) { }

  ngOnInit(): void {
    this.tournamentID = this.route.snapshot.paramMap.get('id')
    console.log("jugadores: ",this.gameService.jugadoresTorneo)
  }
  //Ejecutado cuando un jugador se quiere sale del torneo
  exit() {
    //TODO: desapuntarse del torneo
    this.router.navigateByUrl('/torneo')
  }
}