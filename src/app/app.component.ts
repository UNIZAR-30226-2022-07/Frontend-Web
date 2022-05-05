import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend-web';

  constructor(public WebSocketService: WebsocketService) { }  

  ngOnInit(): void { }

  boton() {
    this.WebSocketService.newMatch(1,10)
  }

  sendmsg() {
    this.WebSocketService.send(
      { },
      "/game/connect/"
    )
  }

  sendmsg2() {
    this.WebSocketService.send(
      { },
      "/game/begin/"
    )
  }

}
