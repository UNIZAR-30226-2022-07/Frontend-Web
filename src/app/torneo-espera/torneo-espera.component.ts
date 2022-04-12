import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-torneo-espera',
  templateUrl: './torneo-espera.component.html',
  styleUrls: ['./torneo-espera.component.css']
})
export class TorneoEsperaComponent implements OnInit {
  tournamentID: string | null = null;
  players!: Array<any>;

  constructor(private route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.tournamentID = this.route.snapshot.paramMap.get('id')
    //TODO: Request a backend para datos del torneo ¿Abrir ya el websocket para saber cuando se unen?
    //Pruebas:
    this.players = [
      {
        nombre: "3nsalada",
        puntos: 50,
        pais: "España"
      },
      {
        nombre: "Helios",
        puntos: 73,
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

}
