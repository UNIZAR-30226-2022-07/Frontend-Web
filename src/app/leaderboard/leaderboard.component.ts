import { Component, OnInit } from '@angular/core';

import { RankingService } from '../ranking.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  dataGlobal: any;
  dataNacional: any;
  dataAmigos: any;
  cuerpo_mensaje : any;

  displayedColumns = ['No.', 'Nombre', 'Puntos'];
  
  constructor(public RankingService : RankingService) { }

  ngOnInit(): void {
    //Pruebas



    this.RankingService.friendsRanking().subscribe({
      next: (data) => {

        
        this.cuerpo_mensaje = JSON.stringify(data);



        console.log("Ha cargado amigos");
        console.log("Mensaje recibido:" + data);
        console.log("Mensaje recibido:" + this.cuerpo_mensaje);

      },
      error: (e) =>{
        console.log("No ha cargado amigos");
      }
    })
    this.RankingService.NacionalRanking().subscribe({
      next: (data) => {

        
        this.cuerpo_mensaje = JSON.stringify(data);



        console.log("Ha cargado amigos por pais");
        console.log("Mensaje recibido:" + data);
        console.log("Mensaje recibido:" + this.cuerpo_mensaje);

      },
      error: (e) =>{
        console.log("No ha cargado amigos");
      }
    })


    this.dataAmigos = [{nombre:"cesar", puntos:30}, {nombre:"victor",puntos:18},{nombre:"marcos",puntos:10},{nombre:"carla",puntos:8},{nombre:"cesar", puntos:30}, {nombre:"victor",puntos:18},{nombre:"marcos",puntos:10},{nombre:"cesar", puntos:30}, {nombre:"victor",puntos:18},{nombre:"marcos",puntos:10}];
    this.dataNacional = [{nombre:"Lacasta", puntos:300}, {nombre:"Luismi",puntos:180},{nombre:"javivi23",puntos:100},{nombre:"elMosco",puntos:80}];
    this.dataGlobal = [{nombre:"faker", puntos:3000000}, {nombre:"will smith",puntos:1800},{nombre:"reventaoDelUno",puntos:1000},{nombre:"test",puntos:800}];
  }

}
