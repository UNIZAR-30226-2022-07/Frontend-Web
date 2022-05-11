import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend-web';

  constructor(public GameService: GameService) { }  

  ngOnInit(): void { }

  boton() {
    this.GameService.newMatch(1,10).then()
  }

  sendmsg() {
    this.GameService.send(
      { },
      "/game/connect/"
    )
  }

  sendmsg2() {
    this.GameService.send(
      { },
      "/game/begin/"
    )
  }

  sendmsg3() {
    this.GameService.send(
      { },
      "/game/disconnect/"
    )
  }

}
