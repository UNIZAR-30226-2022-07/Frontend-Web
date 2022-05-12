import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Carta } from "./game/logica/carta";
import { Jugador } from "./game/logica/jugador";
import { Mano } from "./game/logica/mano";
import { UsersService } from "./users.service";
import * as util from "./game/logica/util";
// Declare SockJS and Stomp
declare var SockJS: any;
declare var Stomp: any;


@Injectable({ providedIn: 'root' })
export class GameService {
  public messageReceived = new EventEmitter<any>();
  public chat = new EventEmitter<any>();
  
  id:string = "";
  partida:any;

  //Lista de jugadores
  jugadores: Jugador[] = [];
  //Pila de cartas central
  pilaCartas: Carta[] = []; 
  //Index del array jugadores que eres tu. NOTE: Cambiar cada vez que se cambia el turno
  indexYo = 0;
  

  public stompClient: any;
  
  constructor(private http: HttpClient, public userService: UsersService, private router: Router) {}
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

        that.stompClient.subscribe('/user/'+that.userService.username+'/msg', (message: any) => that.onPrivateMessage(message, that), {"Authorization": "Bearer " + that.userService.getToken()});
        that.stompClient.subscribe('/topic/jugada/'+that.id, (message: any) => that.onMessage(message, that.messageReceived), {"Authorization": "Bearer " + that.userService.getToken()});
        that.stompClient.subscribe('/topic/connect/'+that.id, (message: any) => that.onConnect(message), {"Authorization": "Bearer " + that.userService.getToken()});
        that.stompClient.subscribe('/topic/disconnect/'+that.id, (message: any) => that.onDisconnect(message), {"Authorization": "Bearer " + that.userService.getToken()});
        that.stompClient.subscribe('/topic/begin/'+that.id, (message: any) => that.onBegin(message), {"Authorization": "Bearer " + that.userService.getToken()});
        that.stompClient.subscribe('/topic/chat/'+that.id, (message: any) => that.onMessage(message, that.chat), {"Authorization": "Bearer " + that.userService.getToken()});
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
  async send(message:any, dir:string, headers:any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!this.stompClient) {
        throw new Error('Socket not connected');
      }
      if(headers == undefined) {
        this.stompClient.send(dir+this.id,{"Authorization": "Bearer " + this.userService.getToken(),"username":this.userService.username},JSON.stringify(message));
        resolve(true);
      }
      else {
        this.stompClient.send(dir+this.id,headers,JSON.stringify(message));
        resolve(true);
      }
    });
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


  onPrivateMessage(message:any, ref:GameService): void {
    let arrayasstring = String(message).substring(String(message).indexOf("["),String(message).indexOf("]")+1)
    console.log("Intento parsear "+arrayasstring);

    <Object[]>JSON.parse(arrayasstring).forEach(function (v:any) {
      ref.jugadores[ref.indexYo].cartas.add(util.BTF_carta(v.color,v.numero))
    });
  };

  onConnect(message:any): void {
    console.info("connect: "+message.body);
    let msg = JSON.parse(message.body);
    this.jugadores = [];
    let i = 0;
    msg.forEach((e: { nombre: string; cartas: Carta[]; }) => {
      if(e.cartas == undefined) {
        this.jugadores.push(new Jugador(e.nombre, new Mano([])));
      }
      else {
        this.jugadores.push(new Jugador(e.nombre, new Mano(e.cartas)));
      }
      if (this.userService.username == e.nombre) {
        this.indexYo = i
      }
      i = i+1;
    });
  };

  onDisconnect(message:any): void {
    console.info("disconnect: "+message);
    console.log(message.substring(0, message.indexOf(' ')));
  };

  onBegin(message:any): void {
    console.log("begin: "+message.body);
    let msg = JSON.parse(message.body);
    this.pilaCartas.push(util.BTF_carta(msg.color,msg.numero))
    this.router.navigateByUrl("/game");
  };


  /**
   * Crea una partida y se conecta
   * @param nplayers Numero de jugadores de la partida
   * @param tturn Tiempo de turno de cada jugador
   * @returns void
  */
  public async newMatch(nplayers:number, tturn:number): Promise<any>{ //TODO: Pasar las reglas a esta funcion
    return new Promise<any>(async (resolve, reject) => {

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
          v.jugadores.forEach((e: { nombre: string; cartas: Carta[]; }) => {
            this.jugadores.push(new Jugador(e.nombre, new Mano(e.cartas)));
          });
          this.partida = v;
          await this.connect().then()
          resolve(true)
        },
        error: (e:any) => {
          console.error(e);
          reject(false)
        }
      });
    });
  }

  /**
   * Se une a una partida
   * @param id ID de la partida
   * @returns void
  */
  public async joinMatch(id:string): Promise<any>{
    return new Promise<any>(async (resolve, reject) => {
      this.id = id;
      await this.connect().then(async x => {
        await this.send(
          { },
          "/game/connect/",
          undefined
        ).then();
      }).then()
      resolve(true);
    });
  }

  /**
   * Actualiza la info de la partida
   * @param id Id de la partida
   * @returns promise
  */
  public async infoMatch(id: string): Promise<any>{ //TODO: Pasar las reglas a esta funcion
    return new Promise<any>(async (resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': "Bearer "+this.userService.getToken()
        }),
        withCredentials: true
      };
      let test: Observable<any> = this.http.post("https://onep1.herokuapp.com/game/getInfoPartida",
      {
        idPartida: id
      },
      httpOptions)
      test.subscribe({
        next: async (v: any) => {
          console.log("Info partida:",v);
          this.partida = {
            tturno: v.tiempoTurno,
            njugadores: v.numeroJugadores
          }
          this.jugadores = [];
          v.jugadores.forEach((element: string) => {
            this.jugadores.push(new Jugador(element, new Mano([])));
          });
          resolve(true)
        },
        error: (e:any) => {
          console.error(e);
          reject(false)
        }
      });
    });
  }

}