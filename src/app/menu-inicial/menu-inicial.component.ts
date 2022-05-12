
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute,Params, Router } from '@angular/router';
import { FriendService } from '../friend.service';
import { GameService } from '../game.service';
import { UsersService } from '../users.service';




@Component({
  selector: 'app-menu-inicial',
  templateUrl: './menu-inicial.component.html',
  styleUrls: ['./menu-inicial.component.css']
})
export class MenuInicialComponent implements OnInit {

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog, public userService: UsersService) {
  }
  
  ngOnInit(): void {
  }

  openDialog(){
      const dialogRef2 = this.dialog.open(DialogContent,
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
  
    openNotis(){
      const dialogRef = this.dialog.open(NotisContent);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      })
    }

    pedirCodigo(){
      const dialogRef = this.dialog.open(UnirsePrivada);
    }
    
    crearPPrivada(){
      const dialogRef = this.dialog.open(ReglasPartidaComponent);
    }

    

}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
  styleUrls: ['./menu-inicial.component.css']
})
export class DialogContent {

  
  searchText!: string;

  name : string | null = null;
  nameUser2Search : string = "";
  
  listaAmigos: Array<string> = [];
  
  cuerpo_mensaje: any;
  mensaje_final:any;
  
  
  amigos_vacio:boolean;
  

  

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public friendService: FriendService) {
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

  friend_reqButton(): void{
 
    this.friendService.addRequest(this.nameUser2Search).subscribe({
      next: (v) => {
        console.log("Ha ido bien");

      },
      error: (e) =>{
        console.log("Ha ido mal");
      }
    })

    console.log(this.nameUser2Search);
    console.log(this.name);
  
  }

  borrar_amigo(friend:string): void{
    this.friendService.removeFriend(friend).subscribe({
      next: (v) => {
        console.log("Ha ido bien");
      },error : (e) => {

      }
    })
  }

  



}

@Component({
  selector: 'notis-content',
  templateUrl: 'notis-content.html' ,
  styleUrls: ['./notis-content.css']
})
export class NotisContent {
  
  listaNotis: Array<string> = [];
  cuerpo_mensaje: any;
  mensaje_final:any;
  
 

  constructor(public dialog:MatDialog, public friendService: FriendService){
     
  }

  ngOnInit(): void{
    console.log("Vamos a pedir mensajes")
    this.friendService.getRequests().subscribe({
      next: (data) => {


        const msg = data.message;
      
        this.cuerpo_mensaje = msg.split("\"");

    
       

        console.info("Mensaje recibido: ", data.message);
        for (let n = 0; (2*n + 1) < this.cuerpo_mensaje.length; n++) {
          this.listaNotis.push(this.cuerpo_mensaje[2*n + 1]);
          
        }
       
        
      },
      error: (e) => {
        if (e.status == 401) {
          console.log("ha ido mal")
        }
        else {
          console.error(e);
          
        }
      }
    })
    //this.listaNotis = [{nombre:"cesar",mensaje:"te ha invitado a su partida"},{nombre:"victor",mensaje:"quiere ser tu amigo"},{nombre:"paula",mensaje:"quiere ser tu amigo"}]
  }

  aceptarAmigo(amigo:string): void{
    console.log("Entramos en la funcion y el amigo es " + amigo);
    this.friendService.acceptRequest(amigo).subscribe({
      next:(data) => {
        console.log("Ha ido bien");
      },
      error: (e) => {
        console.log("Ha ido mal");
      }
    })
    
  }

  borrar_noti(amigo:string): void{
    this.friendService.cancelRequest(amigo).subscribe({
      next:(data) => {
        console.log("Ha ido bien");
      },
      error: (e) => {
        console.log("Ha ido mal");
      }
    })
  }

}
  



@Component({
  selector: 'unirse-privada',
  templateUrl: 'unirse-privada.html',
  styleUrls: ['./menu-inicial.component.css'],
})
export class UnirsePrivada {
  id: string = ""
  constructor(public dialogRef: MatDialogRef<UnirsePrivada>, public userService:UsersService, public GameService: GameService, public router: Router,private _snackBar: MatSnackBar) {}

  async joinGame() {
    await this.GameService.infoMatch(this.id).then();
    if(this.GameService.jugadores.length >= this.GameService.partida.njugadores) {
      this._snackBar.open("¡Partida llena!",'');
      return;
    }
    this.GameService.jugadores.forEach(j => {
      if(j.nombre == this.userService.username) {
        this._snackBar.open("Estas ya unido a esta partida...",'');
      }
    });
    await this.GameService.joinMatch(this.id).then();
    this.router.navigateByUrl('/partidaPrivada/'+this.id);
    this.dialogRef.close();
  }

}



@Component({
  selector: 'reglasPartidaPrivada',
  templateUrl: 'reglasPartidaPrivada.html',
  styleUrls: ['./menu-inicial.component.css']
})
export class ReglasPartidaComponent {
  nJugadores: number = 6;
  tiempoTurno: number = 10;
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw
  constructor(public dialogRef: MatDialogRef<ReglasPartidaComponent>, public GameService: GameService, public router: Router) {}

  changeNplayers(e: any) {
    this.nJugadores = e.target.value;
  }
  
  changeTturno(e: any) {
    this.tiempoTurno = e.target.value;
  }

  async crearPartida() {
    await this.GameService.newMatch(this.nJugadores,this.tiempoTurno).then();
    this.router.navigateByUrl('/partidaPrivada/'+this.GameService.id);
    this.dialogRef.close();
  }
}