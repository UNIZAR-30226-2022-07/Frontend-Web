import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { delay, Observable } from "rxjs";
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

  public inicializado:boolean = false;
  public ppublica: boolean = false;
  public psemiTorneo: boolean = false;
  public ptorneo: boolean = false;
  
  public messageReceived = new EventEmitter<any>();
  public privatemsg = new EventEmitter<any>();
  public chat = new EventEmitter<any>();
  public winner = new EventEmitter<string>();
  public suscripciones: Array<any> = [];
  public saidUno: boolean = false;
  public robando: boolean = false;
  
  id:string = "";
  partida:any;
  reglas: Array<util.Reglas> = [];

  idTorneo:string = "";
  torneo: any;
  jugadoresTorneo: Jugador[] = [];

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
  
  parseandomsg: boolean = false;
  private finished = new EventEmitter();

  public stompClient: any;
  
  constructor(private http: HttpClient, public userService: UsersService, private router: Router, private _snackBar: MatSnackBar) {}
  
  init(): void {
    this.inicializado = true;
    console.log("Inicializando servicio...")
    this.messageReceived.subscribe({
      next: async (msg: any) => {
        if(!this.skipNextJugada){
          const that = this;
          if(this.parseandomsg) {
            console.log("Tengo que esperar")
            await new Promise(function (resolve, reject) {
              that.finished.subscribe({
                next: (v: any) => {
                  console.log("Luz verde!")
                  resolve(true);
                }
              });
            }).then();
          }
          if(this.robando) {
            console.log("Tengo que esperar pq no me ha llegado las cartas que he robado todavia")
            await new Promise(function (resolve, reject) {
              that.privatemsg.subscribe({
                next: (v: any) => {
                  console.log("Luz verde!")
                  resolve(true);
                }
              });
            }).then();
          }
          //--------------INICIALIZACION DE VARIABLES--------------
          let ultimaCarta = util.BTF_carta(msg.carta.color, msg.carta.numero)
          let jugadoresAntes = this.jugadores
          let jugadoresDespues = []
          let hanRobado = false;
          let hanJugado = false;
          let quienHaRobado: string[] = []
          let quienHaJugado: string[] = []
          msg.jugadores.forEach((j: { username: string; numeroCartas: any; }) => {
            jugadoresDespues.push(new Jugador(j.username,j.numeroCartas));
            jugadoresAntes.forEach(a => {
              if((a.nombre == j.username)) {
                if(j.username != this.userService.username) { //No soy yo
                  if((a.cartas.length() < j.numeroCartas)) { //Ha robado
                    hanRobado = true
                    quienHaRobado.push(j.username)
                    console.log(j.username+" ha robado: tenia "+a.cartas.length()+" y ahora tiene "+j.numeroCartas)
                  }
                  else if(a.cartas.length() > j.numeroCartas) { //Ha jugado
                    hanJugado = true;
                    quienHaJugado.push(j.username)
                    console.log(j.username+" ha jugado: tenia "+a.cartas.length()+" y ahora tiene "+j.numeroCartas)
                  }
                  else {
                    console.log(j.username+" no hizo nada: tenia "+a.cartas.length()+" y ahora tiene "+j.numeroCartas)
                  }
                  //Actualizar nº de cartas
                  a.cartas.set(j.numeroCartas);
                }
                else { //Soy yo
                  if((a.cartas.getFalso() < j.numeroCartas)) { //Ha robado
                    hanRobado = true
                    quienHaRobado.push(j.username)
                    console.log(j.username+" ha robado: tenia "+a.cartas.getFalso()+" y ahora tiene "+j.numeroCartas)
                  }
                  else if(a.cartas.getFalso() > j.numeroCartas) { //Ha jugado
                    hanJugado = true;
                    quienHaJugado.push(j.username)
                    console.log(j.username+" ha jugado: tenia "+a.cartas.getFalso()+" y ahora tiene "+j.numeroCartas)
                  }
                  else {
                    console.log(j.username+" no hizo nada: tenia "+a.cartas.getFalso()+" y ahora tiene "+j.numeroCartas)
                  }
                  //Actualizar nº de cartas falso
                  a.cartas.setFalso(j.numeroCartas);
                }
                
              }
            });
          });
          if(hanJugado) {
            console.log(quienHaJugado[0] + " ha jugado la carta ", ultimaCarta);
            this.pilaCartas.push(ultimaCarta);
          }
          let cardsToDraw = 0;
          if(this.hasRegla(util.Reglas.PROGRESSIVE_DRAW)) {
            let i = this.pilaCartas.length-1 
            while(i>0) {
              if(this.pilaCartas[i].value == util.Valor.DRAW2 && this.pilaCartas[i].accionTomadaPor=="") {
                cardsToDraw += 2;
                console.log("check ",this.pilaCartas[i])
              }
              else if(this.pilaCartas[i].value == util.Valor.DRAW4 && this.pilaCartas[i].accionTomadaPor=="") {
                cardsToDraw += 4;
                console.log("check ",this.pilaCartas[i])
              }
              else if(this.hasRegla(util.Reglas.BLOCK_DRAW) && this.pilaCartas[i].value == util.Valor.SKIP && this.pilaCartas[i].accionTomadaPor=="") {
                cardsToDraw += 0;
                console.log("check ",this.pilaCartas[i])
              }
              else {
                i=-1; //Salir del bucle
              }
              i = i-1
            }
          }
          else {
            if(ultimaCarta.value == util.Valor.DRAW2) {
              cardsToDraw = 2;
            }
            else if(ultimaCarta.value == util.Valor.DRAW4) {
              cardsToDraw = 4;
            }
          }
          console.log("cardsToDraw calculo incial: "+cardsToDraw)
  
          let tengoQueRobar = false;
          //O me toca robar...
          if(cardsToDraw>0 && hanJugado && (((ultimaCarta.value == util.Valor.SKIP || ultimaCarta.value == util.Valor.DRAW2 || ultimaCarta.value == util.Valor.DRAW4)&&ultimaCarta.accionTomadaPor=="") || !(ultimaCarta.value == util.Valor.SKIP || ultimaCarta.value == util.Valor.DRAW2 || ultimaCarta.value == util.Valor.DRAW4))) {
            tengoQueRobar = true;
          }
          if(this.hasRegla(util.Reglas.BLOCK_DRAW) && cardsToDraw>0 && ultimaCarta.accionTomadaPor!="" && ultimaCarta.value == util.Valor.SKIP) { 
            tengoQueRobar = true;
          }
          if(!hanJugado) {
            cardsToDraw = 0;
          }
          //O no puedo jugar ninguna carta...
          let _canPlay = false;
          this.jugadores[this.indexYo].cartas.getArray().forEach(c => {
            if(this.hasRegla(util.Reglas.BLOCK_DRAW) && cardsToDraw>1){
              if(c.value == util.Valor.SKIP && c.color == ultimaCarta.color) {
                console.log("Me salvo por tener un bloqueo")
                tengoQueRobar = false
                _canPlay = true;
              }
            }
            if(util.sePuedeJugar(ultimaCarta,c)) { //Si tengo que robar, tengoQueRobar ya sera true, por lo que esto no tendra efecto
              _canPlay = true;
            }
          });
          if(this.hasRegla(util.Reglas.PROGRESSIVE_DRAW) && cardsToDraw>1){
            //Calcular cuales te salvan
            let posiblesSalvaciones = [
              new Carta(util.Valor.DRAW4,util.Color.INDEFINIDO),
              new Carta(util.Valor.DRAW4,util.Color.AMARILLO), //NOTE: teoricamente imposible, pero por si acaso
              new Carta(util.Valor.DRAW4,util.Color.AZUL), //NOTE: teoricamente imposible, pero por si acaso
              new Carta(util.Valor.DRAW4,util.Color.ROJO), //NOTE: teoricamente imposible, pero por si acaso
              new Carta(util.Valor.DRAW4,util.Color.VERDE), //NOTE: teoricamente imposible, pero por si acaso
            ];
            if (ultimaCarta.value == util.Valor.DRAW2) {
              posiblesSalvaciones.push(new Carta(util.Valor.DRAW2,util.Color.AMARILLO));
              posiblesSalvaciones.push(new Carta(util.Valor.DRAW2,util.Color.AZUL));
              posiblesSalvaciones.push(new Carta(util.Valor.DRAW2,util.Color.ROJO));
              posiblesSalvaciones.push(new Carta(util.Valor.DRAW2,util.Color.VERDE));
            }
            else {
              posiblesSalvaciones.push(new Carta(util.Valor.DRAW2,ultimaCarta.color));
            }
            
            console.log("Me salvan:",posiblesSalvaciones);
            posiblesSalvaciones.forEach(c => {
              if(this.jugadores[this.indexYo].cartas.has(c)) {
                console.log("me salvo por tener un +2 o +4 jugable");
                tengoQueRobar = false
                _canPlay = true;
              }
            });
          }
          if(!_canPlay && !(hanJugado && ultimaCarta.value == util.Valor.SKIP)) {
            tengoQueRobar = true;
            if(cardsToDraw==0) {
              cardsToDraw = 1;
            }
          }
          let acaboDeRobar = false;
          if(hanRobado && (quienHaRobado[0] == this.userService.username) && !(this.hasRegla(util.Reglas.REPEAT_DRAW) && (cardsToDraw==1))) {
            console.log("acaboDeRobar")
            acaboDeRobar = true;
            tengoQueRobar = false;
          }
          else {
            console.log("noAcaboDeRobar o tengo que seguir robando")
          }
          
  
          let letoca = msg.turno
          let mesaltan = false
          if(hanJugado && ultimaCarta.accionTomadaPor=="" && ultimaCarta.value==util.Valor.SKIP && cardsToDraw<2) {
            if(letoca == this.userService.username) {
              console.log("Me estan saltando")
              tengoQueRobar = false;
              mesaltan = true
            }
            ultimaCarta.accionTomadaPor = letoca;
          }
          console.log("Ultima carta: ",this.pilaCartas[this.pilaCartas.length-1])
          
          if(hanRobado) { //Actualizar las cartas
            let i = this.pilaCartas.length-1 
            while(i>0) {
              if(this.pilaCartas[i].value == util.Valor.DRAW2 && this.pilaCartas[i].accionTomadaPor=="") {
                this.pilaCartas[i].accionTomadaPor = quienHaRobado[0];
              }
              else if(this.pilaCartas[i].value == util.Valor.DRAW4 && this.pilaCartas[i].accionTomadaPor=="") {
                this.pilaCartas[i].accionTomadaPor = quienHaRobado[0];
              }
              else if(this.hasRegla(util.Reglas.BLOCK_DRAW) && this.pilaCartas[i].value == util.Valor.SKIP && this.pilaCartas[i].accionTomadaPor=="") {
                this.pilaCartas[i].accionTomadaPor = quienHaRobado[0];
              }
              else {
                i=-1; //Salir del bucle
              }
              i = i-1
            }
          }

          console.log("cardsToDraw final: "+cardsToDraw)
          //--------------QUE HAY QUE HACER EN ESTE TURNO--------------
  
          
          if(hanRobado) {
            console.log("Jugadores han robado ",quienHaRobado)
          }

          console.log("RESUMEN:\n    letoca: "+letoca+
                              "\n    acaboDeRobar: "+acaboDeRobar+
                              "\n    tengoQueRobar: "+tengoQueRobar+
                              "\n    hanJugado: "+hanJugado+
                              "\n    mesaltan: "+mesaltan);
  
          if(letoca == this.userService.username) { //Me toca
            console.log("Me toca")
            if(acaboDeRobar) {
              //Pasar turno
              console.log("Paso turno")
              await this.delay(500);
              await this.send(
                { },
                "/game/pasarTurno/",
                undefined
              ).then()
            }
            if(tengoQueRobar) {
              this.letoca = "";
              //Robar cardsToDraw
              this.robando = true;
              if(!acaboDeRobar) {
                console.log("Tengo que robar "+cardsToDraw)
                await this.delay(500);
                this.robar(cardsToDraw);
                this.changeMano().then();
              }
            }
            else {
              if(hanJugado) {
                if(mesaltan) {
                  //Pasar turno
                  console.log("Me saltan")
                  this.robando = true;
                  await this.delay(500);
                  await this.send(
                    { },
                    "/game/pasarTurno/",
                    undefined
                  ).then()
                  this.robando = false;
                }
              }
              this.letoca = letoca;
            }
            
          }
          else {
            this.robando = false;
            this.letoca = letoca;
          }
          this.finished.emit(true);
        }
        this.skipNextJugada = false;
      }
    });
  }


  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async changeMano():Promise<any> {
    const that = this;
    return new Promise(function (resolve, reject) {
      that.privatemsg.subscribe({
        next: async (msg: any) => {
          resolve(msg);
        }
      });
    });
  }

  /**
   * Borra toda la info de una partida
   * @returns promesa de finalizacion
  */
  public restart(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.id = "";
      this.jugadoresTorneo = [];
      this.jugadores = [];
      this.pilaCartas = [];
      this.reglas = [];
      this.parseandomsg = false;
      this.ppublica = false;
      this.ptorneo = false;
      this.psemiTorneo = false;
      this.indexYo = 0;
      this.letoca = "";
      this.saidUno = false;
      this.robando = false;
      this.suscripciones.forEach(s => {
        this.stompClient.unsubscribe(s,{"Authorization": "Bearer " + this.userService.getToken()})
      });
      if(this,this.stompClient != undefined) {
        this.stompClient.disconnect(function(frame: any) { resolve(true); },{"Authorization": "Bearer " + this.userService.getToken()})
      }
      else {
        resolve(true);
      }
      
    });
  }
  
  /**
   * Crea un socket y se conecta, suscribiendose a "/topic/connect/<id>"
   * @returns Promesa de finalizacion
  */
  async connect(): Promise<any> {
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

      this.stompClient.disconnect(function() {
        console.log("stompClient desconectado")
      });
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

  async cambiarMano(p1:string, p2:string): Promise<void> {
    return new Promise<any>(async (resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': "Bearer "+this.userService.getToken()
        }),
        withCredentials: true
      };
      let test: Observable<any> = this.http.post("https://onep1.herokuapp.com/game/cambiarManos",
      {
        gameId: this.id,
        player1: p1,
        player2: p2
      },
      httpOptions)
      test.subscribe({
        next: async (v: any) => {
          console.log("He recibido de cambiarMano: ",v)
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
   * Gestiona un mensaje recibido, emitiendolo por this.messageReceived
   * @param message Mensaje recibido
   * @param emitter Emisor de mensajes
   * @returns void
  */
  onMessage(message:any, emitter:any, winemitter:any): void {
    if (String(message).indexOf("HA GANADO") != -1) { //Es mensaje de victoria
      winemitter.emit(String(message).substring(String(message).lastIndexOf(' '), String(message).length-1).replace(" ",""));
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
    
    if(String(message).indexOf("turno") != -1) {
      let obj = JSON.parse(message.body);
      console.log("Mensaje privado: ",message)
      this.pilaCartas.push(util.BTF_carta(obj.carta.color,obj.carta.numero))
      this.messageReceived.emit(obj);
    }
    else {
      if(String(message).indexOf("mano") == -1) {
        let arrayasstring = String(message).substring(String(message).indexOf("["),String(message).indexOf("]")+1)
        console.log("Añadiendo cartas "+arrayasstring);
    
        <Object[]>JSON.parse(arrayasstring).forEach(function (v:any) {
          let c = util.BTF_carta(v.color,v.numero)
          ref.jugadores[ref.indexYo].cartas.add(new Carta(c.value,c.color))
        });
        this.robando = false;
        e.emit(ref.jugadores[ref.indexYo].cartas);
      }
      else {
        let arrayasstring = String(message).substring(String(message).indexOf("["),String(message).indexOf("]")+1)
        let cartas: Carta[] = []
        let splited = arrayasstring.split(" ");
        for (let i = 0; i<splited.length; i=i+2) {
          let valor = splited[i].replace("[","").replace("]","").replace(",","");
          let color = splited[i+1].replace("[","").replace("]","").replace(",","");
          let c = util.BTF_carta(color as util.Backend_Color,valor as util.Backend_Valor)
          cartas.push(new Carta(c.value,c.color));
        }
        console.log("Voy a cambiar mi mano por: ",cartas);
        this.jugadores[this.indexYo].cartas = new Mano(cartas);
      }
    }
  };

  async onTorneoPrivateMessage(message:any): Promise<void> {
    console.log("TORNEO PRIVADO HE RECIBIDO", message);
    await this.restart().then()
    this.ptorneo = true;
    this.psemiTorneo = true;
    await this.delay(Math.random()*2000).then(async x => {
      this.id = message.body;
      await this.infoMatch(this.id).then(async x => {
        await this.joinMatch(this.id).then(async x => {
          this.router.navigateByUrl("/partidaTorneo/"+this.id)
        });
      })
    })

    
    
  }

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

    if((this.ppublica && this.jugadores[0].nombre == this.userService.username && this.jugadores.length==4) || (this.ptorneo  && this.jugadores[0].nombre == this.userService.username && this.jugadores.length==3)) {
      this.send(
        { },
        "/game/begin/",
        undefined
      )
    }
  };

  onConnectTorneo(message:any): void {
    console.info("connect: "+message.body);
    let msg = JSON.parse(message.body);
    this.jugadoresTorneo = [];
    let i = 0;
    msg.forEach((e: { nombre: string; cartas: Carta[]; }) => {
      this.jugadoresTorneo.push(new Jugador(e.nombre, new Mano([])));
    });

    if(this.jugadoresTorneo[0].nombre == this.userService.username && this.jugadoresTorneo.length==9) {
      this.sendTorneo(
        { },
        "/game/begin/torneo/",
        undefined
      )
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
          let i = 0;
          v.jugadores.forEach((element: string) => {
            this.jugadores.push(new Jugador(element, new Mano([])));
            if(element == this.userService.username) { this.indexYo = i; }
            i++
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


  infoTorneos() {
    return new Promise<any>(async (resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': "Bearer "+this.userService.getToken()
        }),
        withCredentials: true
      };
      let test: Observable<any> = this.http.post("https://onep1.herokuapp.com/torneo/getTorneosActivos",
      {
        username: this.userService.username
      },
      httpOptions)
      test.subscribe({
        next: async (v: any) => {
          console.log("Info torneo:",v);
          resolve(true)
        },
        error: (e:any) => {
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
          this.idTorneo = v.idTorneo;
          v.jugadores.forEach((e:string) => {
            this.jugadoresTorneo.push(new Jugador(e, new Mano([])));
          });
          this.torneo = v;
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
   public async joinTorneo(id:string): Promise<any>{
    return new Promise<any>(async (resolve, reject) => {
      this.idTorneo = id;
      console.log("creando conexion...")
      await this.connectTorneo().then(async x => {
        console.log("uniendose...")
        await this.sendTorneo(
          { },
          "/game/connect/torneo/",
          undefined
        ).then();
        resolve(true);
      }).then()
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
        
        that.suscripciones.push(that.stompClient.subscribe('/user/'+that.userService.username+'/msg', (message: any) => that.onTorneoPrivateMessage(message), {"Authorization": "Bearer " + that.userService.getToken()}));
        that.suscripciones.push(that.stompClient.subscribe('/topic/connect/torneo/'+that.idTorneo, (message: any) => that.onConnectTorneo(message), {"Authorization": "Bearer " + that.userService.getToken()}));
        
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


    getUltimaJugada(): Observable<any> {
      let body = { 
        "username" : this.userService.username,
        "idPartida" : this.id
       };
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': "Bearer "+this.userService.getToken()
        }),
        withCredentials: true
      };
      return this.http.post("https://onep1.herokuapp.com/game/getUltimaJugada",body, httpOptions)
    }

    
    getMano(): Observable<any> {
      let body = { 
        "username" : this.userService.username,
        "idPartida" : this.id
       };
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': "Bearer "+this.userService.getToken()
        }),
        withCredentials: true
      };
      return this.http.post("https://onep1.herokuapp.com/game/getManoJugador",body, httpOptions)
    }

    //TODO: completar funcion
    isSemi(): Observable<any> {
      let body = {
        "idPartida" : this.id,
        "idTorneo" : this.idTorneo
      };
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': "Bearer "+this.userService.getToken()
        }),
        withCredentials: true
      };
      return this.http.post("https://onep1.herokuapp.com/torneo/game/isSemifinal",body, httpOptions)
    }
  
}