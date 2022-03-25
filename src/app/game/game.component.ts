import { Component, OnInit } from '@angular/core';
import { Carta } from './logica/carta';
import { Mano } from './logica/mano';
import * as util from "./logica/util";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  test: Mano = new Mano;

  constructor() { }

  ngOnInit(): void {
    this.test.add(new Carta(util.Valor.UNO,util.Color.ROJO));
    this.test.add(new Carta(util.Valor.DOS,util.Color.ROJO));
    this.test.add(new Carta(util.Valor.TRES,util.Color.ROJO));
    this.test.add(new Carta(util.Valor.CUATRO,util.Color.ROJO));
  }

}
