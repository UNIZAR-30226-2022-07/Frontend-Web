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
  
  abrirReglas(): void {
    const dialogRef2 = this.dialog.open(ReglasTorneo,
      {
        
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
  selector: 'ReglasTorneo',
  templateUrl: './ReglasTorneo.html',
  styleUrls: ['./torneo-espera.component.css']
})
export class ReglasTorneo  {
  constructor(public gameService:GameService){

  }
}