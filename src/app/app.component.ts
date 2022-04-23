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

  ngOnInit(): void {
    this.WebSocketService.connect();
    this.WebSocketService.incoming.subscribe((data) => {
      console.log(data);
    });
  }
}
