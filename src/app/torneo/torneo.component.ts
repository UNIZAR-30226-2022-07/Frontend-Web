import { Component, OnInit } from '@angular/core';
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
  constructor(public router: Router, public gameService:GameService) { }

  ngOnInit(): void {
    //TODO: Request a backend para tener torneos
    //TODO: Paginar los torneos?
    this.gameService.getTorneos().subscribe({
      next:(data) =>{
        console.log("Ha ido bien el mensaje es " + JSON.stringify(data));
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
}
