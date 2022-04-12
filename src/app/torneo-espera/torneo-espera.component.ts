import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-torneo-espera',
  templateUrl: './torneo-espera.component.html',
  styleUrls: ['./torneo-espera.component.css']
})
export class TorneoEsperaComponent implements OnInit {
  tournamentID: string | null = null;
  nJugadores: number = 2;
  tiempoTurno: number = 10;
  players!: Array<any>;
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog) { }

  ngOnInit(): void {
    this.tournamentID = this.route.snapshot.paramMap.get('id')
    //TODO: Request a backend para datos del torneo ¿Abrir ya el websocket para saber cuando se unen?
    //Pruebas:
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
        pais: "Ucrania"
      },
    ];
  }
  //Ejecutado cuando un jugador se quiere sale del torneo
  exit() {
    //TODO: desapuntarse del torneo
    this.router.navigateByUrl('/torneo')
  }

  async popupAdmin() {
    const dialogRef = this.dialog.open(AdminComponent);
    dialogRef.componentInstance.component = this;
  }

}

@Component({
  selector: 'admin',
  templateUrl: 'admin.html',
  styleUrls: ['admin.css']
})
export class AdminComponent {
  component!: TorneoEsperaComponent
  constructor(public dialogRef: MatDialogRef<AdminComponent>) {}

  changeNplayers(e: any) {
    this.component.nJugadores = e.target.value;
  }
  
  changeTturno(e: any) {
    this.component.tiempoTurno = e.target.value;
  }
}