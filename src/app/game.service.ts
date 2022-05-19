import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Carta } from "./game/logica/carta";
import { Jugador } from "./game/logica/jugador";
import { Mano } from "./game/logica/mano";
import { UsersService } from "./users.service";
import * as util from "./game/logica/util";
import { MatSnackBar } from "@angular/material/snack-bar";

// Declare SockJS and Stomp
declare var SockJS: any;
declare var Stomp: any;


@Injectable({ providedIn: 'root' })
export class GameService {
  public messageReceived = new EventEmitter<any>();
  public privatemsg = new EventEmitter<any>();
  public chat = new EventEmitter<any>();
  public winner = new EventEmitter<string>();
  public suscripciones: Array<any> = [];
  public saidUno: boolean = false;
  public robando: boolean = false;
  
  idTorneo:string = "";
  id:string = "";
  partida:any;
  reglas: Array<util.Reglas> = [];

  //Lista de jugadores
  jugadores: Jugador[] = [];
  //Pila de cartas central
  pilaCartas: Carta[] = []; 
  //Index del array jugadores que eres tu. NOTE: Cambiar cada vez que se cambia el turno
  indexYo = 0;
  //A quien le toca
  letoca = "";
  //Si hay que ignorar la proxima jugada (usado cuando no dices 1 y tienes que robar+jugar)
  skipNextJugada: boolean = false;
  

  public stompClient: any;
  
  constructor(private http: HttpClient, public userService: UsersService, private router: Router, private _snackBar: MatSnackBar) {}
  
  /**
   * Borra toda la info de una partida
   * @returns promesa de finalizacion
  */
  public restart(): Promise<any>  {
    return new Promise<any>((resolve, reject) => {
      this.id = "";
      this.jugadores = [];
      this.pilaCartas = [];
      this.reglas = [];
      this.indexYo = 0;
      this.letoca = "";
      this.suscripciones.forEach(s => {
        this.stompClient.unsubscribe(s,{"Authorization": "Bearer " + this.userService.getToken()})
      });
      this.stompClient.disconnect(function(frame: any) { resolve(true); },{"Authorization": "Bearer " + this.userService.getToken()})
    });
  }
  
  /**
   * Crea un socket y se conecta, suscribiendose a "/topic/connect/<id>"
   * @returns Promesa de finalizacion
  */
  private async connect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const ws = new SockJS("https://onep1.herokuapp.com/onep1-game");
      this.stompClient = Stomp.over(ws);

      const that = this;
      this.stompClient.connect({"Authorization": "Bearer " + this.userService.getToken()}, function(frame: any) {
        
        that.suscripciones.push(that.stompClient.subscribe('/user/'+that.userService.username+'/msg', (message: any) => that.onPrivateMessage(message, that, that.privatemsg), {"Authorization": "Bearer " + that.userService.getToken()}));
        that.suscripciones.push(that.stompClient.subscribe('/topic/jugada/'+that.id, (message: any) => that.onMessage(message, that.messageReceived,that.winner), {"Authorization": "Bearer " + that.userService.getToken()}));
        that.suscripciones.push(that.stompClient.subscribe('/topic/connect/'+that.id, (message: any) => that.onConnect(message), {"Authorization": "Bearer " + that.userService.getToken()}));
        that.suscripciones.push(that.stompClient.subscribe('/topic/disconnect/'+that.id, (message: any) => that.onDisconnect(message), {"Authorization": "Bearer " + that.userService.getToken()}));
        that.suscripciones.push(that.stompClient.subscribe('/topic/begin/'+that.id, (message: any) => that.onBegin(message), {"Authorization": "Bearer " + that.userService.getToken()}));
        that.suscripciones.push(that.stompClient.subscribe('/topic/chat/'+that.id, (message: any) => that.onChat(message, that.chat), {"Authorization": "Bearer " + that.userService.getToken()}));
        that.suscripciones.push(that.stompClient.subscribe('/topic/buttonOne/'+that.id, (message: any) => that.onButtonOne(message), {"Authorization": "Bearer " + that.userService.getToken()}));
        
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
   * @returns Promesa de finalizacion
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


   robar(n:number): void {
    let todraw = 0;
    if(this.reglas.indexOf(util.Reglas.CHAOS_DRAW) != -1) {
      for(let i=0;i<n;i++) {
        todraw += Math.floor(Math.random() * 7);
      }
    }
    else {
      todraw = n;
    }

    this.send(
      todraw,
      "/game/card/draw/",
      undefined
    );
    return
  }

  
  /**
   * Gestiona un mensaje recibido, emitiendolo por this.messageReceived
   * @param message Mensaje recibido
   * @param emitter Emisor de mensajes
   * @returns void
  */
  onMessage(message:any, emitter:any, winemitter:any): void {
    if (String(message).indexOf("HA GANADO") != -1) { //Es mensaje de victoria
      winemitter.emit(String(message).substring(String(message).lastIndexOf(' '), String(message).length-1));
      return;
    }
    let msg = JSON.parse(message.body);
    console.info("Mensaje recibido: ", message);
    emitter.emit(msg);
  };

  /**
   * Gestiona un mensaje recibido por chat
   * @param message Mensaje recibido
   * @param emitter Emisor de mensajes
   * @returns void
  */
  onChat(message:any, emitter:any): void {
    let msg = JSON.parse(message.body);
    console.info("Mensaje recibido: ", message);
    emitter.emit(msg);
  };

  onPrivateMessage(message:any, ref:GameService,e:any): void {
    let arrayasstring = String(message).substring(String(message).indexOf("["),String(message).indexOf("]")+1)
    console.log("Añadiendo cartas "+arrayasstring);

    <Object[]>JSON.parse(arrayasstring).forEach(function (v:any) {
      ref.jugadores[ref.indexYo].cartas.add(util.BTF_carta(v.color,v.numero))
    });
    e.emit(ref.jugadores[ref.indexYo].cartas);
  };

  onConnect(message:any): void {
    console.info("connect: "+message.body);
    let msg = JSON.parse(message.body);
    this.jugadores = [];
    let i = 0;
    msg.forEach((e: { nombre: string; cartas: Carta[]; }) => {
      if(e.cartas == undefined) {
        if(e.nombre == this.userService.username) {
          this.jugadores.push(new Jugador(e.nombre, new Mano([])));
        }
        else {
          let m = new Mano([]);
          m.set(7);
          this.jugadores.push(new Jugador(e.nombre, m));
        }
      }
      else {
        this.jugadores.push(new Jugador(e.nombre, new Mano(e.cartas)));
      }
      if (this.userService.username == e.nombre) {
        this.indexYo = i
      }
      i = i+1;
    });
    if (this.userService.username == this.jugadores[this.jugadores.length-1].nombre) {
      this.jugadores[this.jugadores.length-1].cartas.setFalso(8);
    }
    else {
      this.jugadores[this.jugadores.length-1].cartas.set(8);
    }
  };

  onDisconnect(message:any): void {
    console.info("disconnect: "+message);
    let msg = message.body;
    let player = msg.substring(1, msg.indexOf(' '));
    let i = 0;
    this.jugadores.forEach(async j => {
      if(j.nombre == player) {
        this.jugadores.splice(i, 1);
        if(player == this.userService.username) {
          await this.restart().then();
          this._snackBar.open("Has salido de la partida",'',{duration: 4000});
          this.router.navigateByUrl("");
        }
        return;
      }
      i = i+1;
    });
    console.log();
  };

  onBegin(message:any): void {
    console.log("begin: "+message.body);
    let msg = JSON.parse(message.body);
    if(this.jugadores[0].nombre != this.userService.username) {
      this.letoca = this.jugadores[0].nombre
    }
    this.router.navigateByUrl("/game");
    //Simular que llega el mensaje
    let body = {carta: {numero: msg.numero, color: msg.color},
                jugadores: [{username:this.userService.username, numeroCartas:7}],
                turno: this.jugadores[0].nombre};
    this.jugadores.forEach(j => {
      if(j.nombre != this.userService.username) {
        let a = {username: j.nombre, numeroCartas:7};
        body["jugadores"].push(a);
      }
    });
    this.messageReceived.emit(body); //Emitirlo
  };

  onButtonOne(message:any): void {
    console.log("UNO: ",message);
  }

  hasRegla(r: util.Reglas) {
    return this.reglas.indexOf(r) != -1
  }


  /**
   * Crea una partida y se conecta
   * @param nplayers Numero de jugadores de la partida
   * @param tturn Tiempo de turno de cada jugador
   * @returns void
  */
  public async newMatch(nplayers:number, tturn:number, reglas:Array<boolean>): Promise<any>{
    return new Promise<any>(async (resolve, reject) => {
      console.log("REGLAS:",reglas);
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': "Bearer "+this.userService.getToken()
        }),
        withCredentials: true
      };
      let r=[];
      if(reglas[0]) { r.push(util.Reglas.CERO_SWITCH) }
      if(reglas[1]) { r.push(util.Reglas.CRAZY_7) }
      if(reglas[2]) { r.push(util.Reglas.PROGRESSIVE_DRAW) }
      if(reglas[3]) { r.push(util.Reglas.CHAOS_DRAW) }
      if(reglas[4]) { r.push(util.Reglas.BLOCK_DRAW) }
      if(reglas[5]) { r.push(util.Reglas.REPEAT_DRAW) }
      this.reglas = r;
      let test: Observable<any> = this.http.post("https://onep1.herokuapp.com/game/create",
      {
        playername: this.userService.username,
        nplayers: nplayers,
        tturn: tturn,
        rules: r,
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
  public async infoMatch(id: string): Promise<any>{
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
            njugadores: v.numeroJugadores,
            reglas: v.reglas
          }
          this.reglas = v.reglas;
          this.jugadores = [];
          v.jugadores.forEach((element: string) => {
            this.jugadores.push(new Jugador(element, new Mano([])));
          });
          resolve(true)
        },
        error: (e:any) => {
          this._snackBar.open("Esa partida no existe",'',{duration: 3000});
          console.error(e);
          reject(false)
        }
      });
    });
  }

  inviteFriend(friendname:string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.userService.getToken()
      }),
      withCredentials: true
    }
    let body = { username: this.userService.username, friendname:friendname, gameId: this.id};
    return this.http.post("https://onep1.herokuapp.com/game/invite",body,httpOptions);
  }


  getTorneos(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.userService.getToken()
      }),
      withCredentials: true
    }
    let body = {};
    return this.http.post("https://onep1.herokuapp.com/torneo/getTorneos",body,httpOptions);
  }


  
  /**
   * Crea una partida de un torneo y se conecta
   * 
   * @param tturn Tiempo de turno de cada jugador
   * @returns void
  */
   public async newMatchTorneo( tturn:number, reglas_:Array<boolean>): Promise<any>{
    return new Promise<any>(async (resolve, reject) => {
      console.log("REGLAS:",reglas_);
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': "Bearer "+this.userService.getToken()
        }),
        withCredentials: true
      };
      let reglas=[];
      if(reglas_[0]) { reglas.push(util.Reglas.CERO_SWITCH) }
      if(reglas_[1]) { reglas.push(util.Reglas.CRAZY_7) }
      if(reglas_[2]) { reglas.push(util.Reglas.PROGRESSIVE_DRAW) }
      if(reglas_[3]) { reglas.push(util.Reglas.CHAOS_DRAW) }
      if(reglas_[4]) { reglas.push(util.Reglas.BLOCK_DRAW) }
      if(reglas_[5]) { reglas.push(util.Reglas.REPEAT_DRAW) }
      this.reglas = reglas;
      let test: Observable<any> = this.http.post("https://onep1.herokuapp.com/torneo/createTorneo",
      {
        username: this.userService.username,
        tiempoTurno: tturn,
        reglas: reglas,
      },
      httpOptions)
      test.subscribe({
        next: async (v: any) => {
          console.log("Partida creada:",v);
          this.idTorneo = v.id;
          v.jugadores.forEach((e: { nombre: string; cartas: Carta[]; }) => {
            this.jugadores.push(new Jugador(e.nombre, new Mano(e.cartas)));
          });
          this.partida = v;
          await this.connectTorneo().then()
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
   public async joinMatchTorneo(id:string): Promise<any>{
    return new Promise<any>(async (resolve, reject) => {
      this.id = id;
      await this.connect().then(async x => {
        await this.send(
          { },
          "/game/connect/torneo/",
          undefined
        ).then();
      }).then()
      resolve(true);
    });
  }

  /**
   * Crea un socket y se conecta, suscribiendose a "/topic/connect/<id>"
   * @returns Promesa de finalizacion
  */
   private async connectTorneo(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const ws = new SockJS("https://onep1.herokuapp.com/onep1-game");
      this.stompClient = Stomp.over(ws);

      const that = this;
      this.stompClient.connect({"Authorization": "Bearer " + this.userService.getToken()}, function(frame: any) {
        
        that.suscripciones.push(that.stompClient.subscribe('/user/'+that.userService.username+'/msg', (message: any) => that.onPrivateMessage(message, that, that.privatemsg), {"Authorization": "Bearer " + that.userService.getToken()}));

        that.suscripciones.push(that.stompClient.subscribe('/topic/connect/'+that.idTorneo, (message: any) => that.onConnect(message), {"Authorization": "Bearer " + that.userService.getToken()}));
        
        resolve(true);
      });
    });
  }

   /**
   * Envia un mensaje al backend a traves del socket para empezar una partida de torneo
   * @param message JSON que se envia en body
   * @param dir Lugar a donde enviar el mensaje. Debe terminar en '/'. Ej: "/game/connect/"
   * @returns Promesa de finalizacion
  */
    async sendTorneo(message:any, dir:string, headers:any): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        if (!this.stompClient) {
          throw new Error('Socket not connected');
        }
        if(headers == undefined) {
          this.stompClient.send(dir+this.idTorneo,{"Authorization": "Bearer " + this.userService.getToken(),"username":this.userService.username},JSON.stringify(message));
          resolve(true);
        }
        else {
          this.stompClient.send(dir+this.idTorneo,headers,JSON.stringify(message));
          resolve(true);
        }
      });
    }
  
}