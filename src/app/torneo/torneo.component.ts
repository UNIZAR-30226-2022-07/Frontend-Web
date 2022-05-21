import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameService } from '../game.service';
import { UsersService } from '../users.service';


export class TorneoFeatures {
  id:string = "";
  jugadores: Array<string> = [];
  nJugadores : number = 0;
  reglas : Array<string> = [];
  creador:string = "";

}


@Component({
  selector: 'app-torneo',
  templateUrl: './torneo.component.html',
  styleUrls: ['./torneo.component.css']
})
export class TorneoComponent implements OnInit {


  id : string = "";
  torneoData: Array<TorneoFeatures> = [];
  searchText!: string;
  tiempoTurno: number = 10;
  listaTorneosActivos: Array<any> = [];
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw
  constructor(public router: Router, public gameService:GameService, public MatDialog:MatDialog, public userService: UsersService) { }

  ngOnInit(): void {
    //TODO: Paginar los torneos?
    this.gameService.getTorneos().subscribe({
      next:(data) =>{
        console.log("Ha ido bien el mensaje es " + JSON.stringify(data));
        const msg = JSON.stringify(data);
       
        data.forEach((element:any) => {
          let TorneoFeatures = {
            id : element.idTorneo,
            jugadores: element.jugadores,
            nJugadores: element.jugadores.length,
            reglas: element.reglas,
            creador: element.jugadores[0],
          }
          this.torneoData.push(TorneoFeatures);
          console.info("El id es " + element.idTorneo);
          console.info("El num  es " + element.jugadores.length);
          console.info("Los jugadores son" + element.jugadores);
          console.info("El creador es " + element.jugadores[0]);
          console.info("Las reglas son" + element.reglas);
           
        });
       

      },error:(e)=>{

      }
    })
    
  }

  crearPartidaTorneo(){
    const dialogRef = this.MatDialog.open(ReglasTorneoPartida);
  }

  async joinTorneo(torneo:any) {
    console.log("click",torneo);
    if(torneo.nJugadores<9 && torneo.jugadores.indexOf(this.userService.username)==-1) {
      this.gameService.idTorneo = torneo.id;
      this.gameService.ptorneo = true;
      this.gameService.psemiTorneo = true;
      this.gameService.reglas = torneo.reglas;
      await this.gameService.joinTorneo(torneo.id).then()
      this.router.navigateByUrl("/torneoEspera/"+torneo.id)
    }
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
