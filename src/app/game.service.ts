import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { lastValueFrom, Observable, Subject } from "rxjs";
import { UsersService } from "./users.service";
// Declare SockJS and Stomp
declare var SockJS: any;
declare var Stomp: any;


@Injectable({ providedIn: 'root' })
export class GameService {
  public messageReceived = new EventEmitter<any>();
  
  id:string = "";
  partida:any;

  public stompClient: any;
  
  constructor(private http: HttpClient, public userService: UsersService) {}
  /**
   * Crea un socket y se conecta, suscribiendose a "/topic/connect/<id>"
   * @returns Promesa de cumplimiento
  */
  private async connect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const ws = new SockJS("https://onep1.herokuapp.com/onep1-game");
      this.stompClient = Stomp.over(ws);

      const that = this;
      this.stompClient.connect({"Authorization": "Bearer " + this.userService.getToken()}, function(frame: any) {

        that.stompClient.subscribe('/topic/game/'+that.id, (message: any) => that.onMessage(message, that.messageReceived), {"Authorization": "Bearer " + that.userService.getToken()});
        that.stompClient.subscribe('/user/'+that.userService.username+'/msg', (message: any) => that.onMessage(message, that.messageReceived), {"Authorization": "Bearer " + that.userService.getToken()});
        resolve(true);
      });
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
   * Gestiona un mensaje recibido, emitiendolo por this.messageReceived
   * @param message Mensaje recibido
   * @param emitter Emisor de mensajes
   * @returns void
  */
  onMessage(message:any, emitter:any): void {
    let msg = JSON.parse(message.body);
    console.info("Mensaje recibido: ", message);
    emitter.emit(msg);
  };


  /**
   * Crea una partida y se conecta
   * @param nplayers Numero de jugadores de la partida
   * @param tturn Tiempo de turno de cada jugador
   * @returns void
  */
  public async newMatch(nplayers:number, tturn:number){ //TODO: Pasar las reglas a esta funcion
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.userService.getToken()
      }),
      withCredentials: true
    };
    let test: Observable<any> = this.http.post("https://onep1.herokuapp.com/game/create",
    {
      playername: this.userService.username,
      nplayers: nplayers,
      tturn: tturn
    },
    httpOptions)
    test.subscribe({
      next: async (v: any) => {
        console.log("Partida creada:",v);
        this.id = v.id;
        this.partida = v;
        await this.connect().then()
      },
      error: (e:any) => {
        console.error(e);
      }
    });
    await lastValueFrom(test); //Esperar la respuesta
    return;
  }

  /**
   * Se une a una partida
   * @param id ID de la partida
   * @returns void
  */
  public async joinMatch(id:string){
    this.id = id;
    await this.connect().then(x => {
      this.send(
        { },
        "/game/connect/"
      );
    })
    return;
  }


}