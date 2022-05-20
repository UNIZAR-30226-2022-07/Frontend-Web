import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameService } from '../game.service';


@Component({
  selector: 'app-torneo',
  templateUrl: './torneo.component.html',
  styleUrls: ['./torneo.component.css']
})
export class TorneoComponent implements OnInit {
  torneoData: any;
  searchText!: string;
  tiempoTurno: number = 10;
  listaTorneosActivos: Array<any> = [];
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw
  constructor(public router: Router, public gameService:GameService, public MatDialog:MatDialog) { }

  ngOnInit(): void {
    
    //TODO: Request a backend para tener torneos https://onep1.herokuapp.com/torneo/getTorneos
    //TODO: Paginar los torneos?
    this.gameService.getTorneos().subscribe({
      next:(data) =>{
        console.log("Ha ido bien el mensaje es " + JSON.stringify(data));
        const msg = JSON.stringify(data);
        const msg2 = msg.split(",");
       
        this.listaTorneosActivos[0] = msg2[0].substring(1,msg2[0].length -1);
        let i = 1; 
        for( i = 1 ; i < msg2.length - 1 ; i++  ){
          console.log("La longitud es " + msg2.length);
          this.listaTorneosActivos[i] = msg2[1].substring(1,msg2[i].length-1);
          console.log("El mensaje es " + this.listaTorneosActivos[i]);
        }
        this.listaTorneosActivos[i+1] = msg2[i+1].substring(1,msg2[i+1].length-2);
      },error:(e)=>{

      }
    })
    //Pruebas:
    this.torneoData = [
      {
        id: 1,
        name: "3nsaladita",
        reglas: "regla1, regla2",
        jugadores: 4
      },
      {
        id: 2,
        name: "Vicks8",
        reglas: "regla3",
        jugadores: 2
      },
      {
        id: 3,
        name: "Helios",
        reglas: "regla1, regla3",
        jugadores: 7
      }
    ]
  }

  crearPartidaTorneo(){
    const dialogRef = this.MatDialog.open(ReglasTorneoPartida);
  }

}

@Component({
  selector: 'ReglasTorneoPartida',
  templateUrl: './ReglasTorneoPartida.html',
  styleUrls: ['./ReglasTorneoPartida.css']
})
export class ReglasTorneoPartida {
  nJugadores: number = 9;
  
  tiempoTurno: number = 10;
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw
  
  
  constructor(public gameService: GameService, public router:Router,public dialogRef: MatDialogRef<ReglasTorneoPartida>){
    
  }
  async crearPartidaTorneo2() {
    await this.gameService.newMatchTorneo(this.tiempoTurno, this.reglas).then();
    this.router.navigateByUrl('/torneoEspera/'+this.gameService.idTorneo);
    this.dialogRef.close();
  }

  changeTturno(e: any) {
    this.tiempoTurno = e.target.value;
  }
}
