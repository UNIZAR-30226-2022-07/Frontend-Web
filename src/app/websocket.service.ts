import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { UsersService } from "./users.service";
// Declare SockJS and Stomp
declare var SockJS: any;
declare var Stomp: any;

export interface IncomingMessage {
  //Vacio
}

export interface DisconnectMessage extends IncomingMessage {
  playerName: string;
  gameId: string;
}

export interface OutgoingMessage {
  //Vacio
}

export interface InicioPartida extends OutgoingMessage {
  //Vacio
}

export interface InicioPartida extends OutgoingMessage {

}



@Injectable({ providedIn: 'root' })
export class WebsocketService {
  constructor(private http: HttpClient, public userService: UsersService) {}
  /**
   * Emit the deserialized incoming messages
   */
  readonly incoming = new Subject<IncomingMessage>();
  
  msg: any;
  id:string = "";
  public stompClient: any;

  /**
   * Crea un socket y se conecta, suscribiendose a "/topic/connect/<id>"
   * @returns void
  */
  private connect(): void {
    const ws = new SockJS("https://onep1.herokuapp.com/onep1-game");
    this.stompClient = Stomp.over(ws);

    const that = this;
    this.stompClient.connect({"Authorization": "Bearer " + this.userService.getToken()}, function(frame: any) {

      that.stompClient.subscribe('/topic/game/'+that.id, that.onMessage, {"Authorization": "Bearer " + that.userService.getToken()});
      that.stompClient.subscribe('/user/'+that.userService.username+'/game/'+that.id, that.onMessage, {"Authorization": "Bearer " + that.userService.getToken()});

    });
  }

  /**
   * Cierra el socket
   * @returns void
  */
  disconnect(): void {
      if (!this.stompClient) {
          throw new Error('Socket not connected');
      }

      //TODO: cerrar stompclient
  }

  /**
   * Envia un mensaje al backend a traves del socket
   * @param message JSON que se envia en body
   * @param dir Lugar a donde enviar el mensaje. Debe terminar en '/'. Ej: "/game/connect/"
   * @returns void
  */
  send(message:any, dir:string): void {
    if (!this.stompClient) {
      throw new Error('Socket not connected');
    }
    this.stompClient.send(dir+this.id,{"Authorization": "Bearer " + this.userService.getToken(),"username":this.userService.username},JSON.stringify(message));
  }


  /**
   * Gestiona un mensaje recibido
   * @param message Mensaje recibido
   * @returns void
  */
  private onMessage(message:any): void {
    const msg = JSON.parse(message.body);
    console.info("Mensaje recibido: ", message);
    this.incoming.next(msg);
  };


  /**
   * Crea una partida y se conecta
   * @returns void
  */
  public newMatch(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.userService.getToken()
      }),
      withCredentials: true
    };
    console.log(this.userService.username);
    let test: Observable<any> = this.http.post("https://onep1.herokuapp.com/game/create",
    {
      playername: this.userService.username,
      nplayers: 1,
      tturn: 10
    },
    httpOptions)
    test.subscribe({
      next: (v: any) => {
        console.log("Partida creada:",v);
        this.id = v.id
        this.connect()
      },
      error: (e:any) => {
        console.error(e);
      }
    });
  }


}