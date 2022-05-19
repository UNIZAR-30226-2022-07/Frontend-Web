import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { GameService } from '../game.service';
import { UsersService } from '../users.service';
import { FriendService } from '../friend.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-partida-privada',
  templateUrl: './partida-privada.component.html',
  styleUrls: ['./partida-privada.component.css']
})
export class PartidaPrivadaComponent implements OnInit {

  matchID: string | null = null;
  nJugadores: number = 6;
  tiempoTurno: number = 10;
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw


  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public gameService: GameService, public userService: UsersService,private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    
    console.log("Valor en gamservice: ",this.gameService.partida);
    console.log("Valor en gamservice jug: ",this.gameService.jugadores);
    this.matchID = this.route.snapshot.paramMap.get('id');

    this.nJugadores = this.gameService.partida.njugadores;
    this.tiempoTurno = this.gameService.partida.tturno;
  }

  async beginGame() {
    await this.gameService.send(
      { },
      "/game/begin/",
      undefined
    ).then();
  }

  copyText() {
    this.clipboardApi.copyFromContent(this.gameService.id);
  }

  async goBack() {
    await this.gameService.send(
      { },
      "/game/disconnect/",
      undefined
    ).then();
  }

  async expulsar(user:string) {
    await this.gameService.send(
      { },
      "/game/disconnect/",
      {"Authorization": "Bearer " + this.userService.getToken(),"username":user}
    ).then();
  }

  openFriends(): void {
    const dialogRef2 = this.dialog.open(FriendList,
      {
        data: this.userService.username,
        position: {
          top: '0px',
          right: '0px'
         
        },
        height: '100vh',
        width: '25%'
      });
  }

  abrirReglas(): void {
    const dialogRef2 = this.dialog.open(Reglas,
      {
        data: this.userService.username,
        position: {
          top: '0px',
          right: '0px'
         
        },
        height: '100vh',
        width: '25%'
      });
  }
  
}




@Component({
  selector: 'friend-list',
  templateUrl: 'friend-list.html',
  styleUrls: ['./partida-privada.component.css']
})
export class FriendList {

  
  searchText!: string;

  name : string | null = null;

  
  listaAmigos: Array<string> = [];
  
  cuerpo_mensaje: any;
  mensaje_final:any;
  
  
  amigos_vacio:boolean;


  

  

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public friendService: FriendService, public gameService: GameService, public _snackbar:MatSnackBar) {
    this.name = data.name;
    this.amigos_vacio = true;

  }
  
  ngOnInit(): void {
    // this.listaAmigos = [{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"},{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"},{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"},{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"}]
    console.log("hola");
   
    this.friendService.getFriends().subscribe({
      next: (data) => {
        
        const msg = data.message;
        this.cuerpo_mensaje = msg.split("\"");

        if (data == null){
          console.log("no tengo amigos");
          this.amigos_vacio = true;
        }else{
          this.amigos_vacio = false;
          console.info("Mensaje recibido: ", data.message);
          for (let n = 0; (2*n + 1) < this.cuerpo_mensaje.length; n++) {
            this.listaAmigos.push(this.cuerpo_mensaje[2*n + 1]);
          }
            
        }
      

      },
      error: (e) =>{
        if (e.status == 401) {
          console.log("ha ido mal");
        }
        else {
          console.error(e);
          
        }
      }
    })
  }


  inviteFriends(friend:string): void{
    console.log("El nombre del amigo es: " + friend);
 
    this.gameService.inviteFriend(friend).subscribe({
      next: (v) => {
        console.log("Ha ido bien");
        this._snackbar.open("Invitación enviada con éxito",'',{duration: 4000});

      },
      error: (e) =>{
        console.log("Ha ido mal");
        console.log(e.message);
      }
    }) 

  }

 

  



}

@Component({
  selector: 'reglas',
  templateUrl: 'reglas.html',
  styleUrls: ['./partida-privada.component.css']
})
export class Reglas {

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog,public gameService: GameService, public userService: UsersService,private clipboardApi: ClipboardService){

  }

  


}
