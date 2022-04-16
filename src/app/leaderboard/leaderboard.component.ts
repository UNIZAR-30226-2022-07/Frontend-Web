import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  dataGlobal: any;
  dataNacional: any;
  dataAmigos: any;
  constructor() { }

  ngOnInit(): void {
    //Pruebas
    this.dataAmigos = [{nombre:"cesar", puntos:30}, {nombre:"victor",puntos:18},{nombre:"marcos",puntos:10},{nombre:"carla",puntos:8}];
    this.dataNacional = [{nombre:"Lacasta", puntos:300}, {nombre:"Luismi",puntos:180},{nombre:"javivi23",puntos:100},{nombre:"elMosco",puntos:80}];
    this.dataGlobal = [{nombre:"faker", puntos:3000000}, {nombre:"will smith",puntos:1800},{nombre:"reventaoDelUno",puntos:1000},{nombre:"test",puntos:800}];
  }

}
