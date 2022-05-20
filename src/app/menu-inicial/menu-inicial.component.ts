
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute,Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FriendService } from '../friend.service';
import { GameService } from '../game.service';
import { UsersService } from '../users.service';




@Component({
  selector: 'app-menu-inicial',
  templateUrl: './menu-inicial.component.html',
  styleUrls: ['./menu-inicial.component.css']
})
export class MenuInicialComponent implements OnInit {
  loading: boolean = false
  hayInvitaciones:boolean = false
  noHayInvitaciones:boolean = true

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog, public userService: UsersService, public http: HttpClient, public gameService: GameService, private _snackBar: MatSnackBar, public friendService: FriendService) {}
  
  ngOnInit(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.userService.getToken()
      }),
      withCredentials: true
    };
    let test: Observable<any> = this.http.post("https://onep1.herokuapp.com/game/getPartidasActivas",
    {
      username: this.userService.username
    },
    httpOptions)

    test.subscribe({
      next: async (v:any) => {
        console.log("ME LLEGO ",v)
        //TODO: Cuando cesar lo solucione
        // if (typeof v === 'string' || v instanceof String) {
        //   this.loading = true;
        //   this.gameService.id = v.replace(" ","");
        //   await this.gameService.infoMatch(this.gameService.id).then();
        //   this.router.navigateByUrl('/game');
        //   this.loading = false;
        // }
      },
      error: (e:any) => {
        console.error("ME LLEGO ERROR",e)
      }
    });


    // Se comprueba si hay notificaciones
/*
    this.friendService.getRequests().subscribe({
      next: (data) => {
        const msg = JSON.stringify(data);
        if(msg != ""){
          console.info("Entro aquí");
          this.hayInvitaciones = true;
          this.noHayInvitaciones = false;
        }
      },error: (e) =>{

      }
    })
    this.friendService.getInvitations().subscribe({
      next: (data) =>{
        const msg = JSON.stringify(data);
        if(msg != ""){
          this.hayInvitaciones = true;
          this.noHayInvitaciones = false;
        }
      },error: (e) =>{

      }
    })
    */
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

    buscarPublica() {
      this.loading = true;
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': "Bearer "+this.userService.getToken()
        }),
        withCredentials: true
      };
      let test: Observable<any> = this.http.post("https://onep1.herokuapp.com/game/getPartidaPublica",
      { },
      httpOptions)
      test.subscribe({
        next: async (v: any) => {
          await this.gameService.infoMatch(v).then();
          if(this.gameService.jugadores.length >= this.gameService.partida.njugadores) {
            this._snackBar.open("¡Partida llena!",'',{duration: 4000});
            return;
          }
          this.gameService.jugadores.forEach(j => {
            if(j.nombre == this.userService.username) {
              this._snackBar.open("Estas ya unido a esta partida...",'',{duration: 4000});
            }
          });
          this.gameService.ppublica = true;
          await this.gameService.joinMatch(v).then();
          this.router.navigateByUrl('/partidaPublica/'+v);
          this.loading = false;
        },
        error: (e:any) => {
          console.error(e);
          this.loading = false;
        }
      });
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
  

  

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public friendService: FriendService, public snackBar:MatSnackBar) {
    this.name = data.name;
    this.amigos_vacio = true;

  }

  pedirAmigos(): void{
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
  
  ngOnInit(): void {
    // this.listaAmigos = [{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"},{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"},{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"},{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"}]
    console.log("hola");
   
    this.pedirAmigos();
  }

  friend_reqButton(): void{
 
    this.friendService.addRequest(this.nameUser2Search).subscribe({
      next: (v) => {
        this.snackBar.open("Invitación enviada con éxito",'',{duration: 4000});

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
        this.snackBar.open("Amigo borrado con éxito",'',{duration: 4000});
      },error : (e) => {

      }
    })
  }

  



}

 interface Mensaje{
  name:string;
  codigo:string;
  mensaje:string;
}


@Component({
  selector: 'notis-content',
  templateUrl: 'notis-content.html' ,
  styleUrls: ['./notis-content.css']
})
export class NotisContent {
  
  listaNotis: Array<string> = [];
  listaInvitaciones: Array<Mensaje> = [];
  cuerpo_mensaje: any;
  mensaje_final:any;
  
 

  constructor(public dialog:MatDialog, public friendService: FriendService ,public dialogRef: MatDialogRef<UnirsePrivada>, public userService:UsersService, public gameService: GameService, public router: Router,private _snackBar: MatSnackBar){
     
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
    this.friendService.getInvitations().subscribe({
      next: (data) =>{
        const msg = JSON.stringify(data);
    
        this.cuerpo_mensaje = msg.split(",");
        for (let n = 0; n < this.cuerpo_mensaje.length; n=n+2) {
          
          const msg = this.cuerpo_mensaje[n].split(":");
          const msg2 = msg[1].substring(1,msg[1].length -1);

          const cod = this.cuerpo_mensaje[n+1].split(":");
          let cod2:string = "";
          // Es el ultimo mensaje
          if(n == this.cuerpo_mensaje.length -2){
            cod2 = cod[1].substring(1,cod[1].length -3);  
          }else{
             cod2 = cod[1].substring(1,cod[1].length -2);
          }
  
        
          let Mensaje = {
            name : msg2,
            codigo : cod2,
            mensaje: "Te ha invitado a su partida",
          }
          this.listaInvitaciones.push(Mensaje);
          
        }
       
      

      },error: (e) =>{

      }
    })
    //this.listaNotis = [{nombre:"cesar",mensaje:"te ha invitado a su partida"},{nombre:"victor",mensaje:"quiere ser tu amigo"},{nombre:"paula",mensaje:"quiere ser tu amigo"}]
  }

  aceptarAmigo(amigo:string): void{
    console.log("Entramos en la funcion y el amigo es " + amigo);
    this.friendService.acceptRequest(amigo).subscribe({
      next:(data) => {
        console.log("Ha ido bien");
        this._snackBar.open("Amigo aceptado con éxito",'',{duration: 4000});
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
        this._snackBar.open("Amigo rechazado con éxito",'',{duration: 4000});
      },
      error: (e) => {
        console.log("Ha ido mal");
      }
    })
  }

  borrar_invi(id:string):void{
    this.friendService.cancelInvitation(id).subscribe({
      next:(data) => {
        this._snackBar.open("Invitación eliminada",'',{duration: 4000});
      },
      error: (e) => {
        console.log("Ha ido mal");
      }
    })
  }

  async joinGame(id:string) {
    console.info("El codigo es " + id);
    await this.gameService.infoMatch(id).then();
    if(this.gameService.jugadores.length >= this.gameService.partida.njugadores) {
      this._snackBar.open("¡Partida llena!",'',{duration: 4000});
      return;
    }
    this.gameService.jugadores.forEach(j => {
      if(j.nombre == this.userService.username) {
        this._snackBar.open("Estas ya unido a esta partida...",'',{duration: 4000});
        return;
      }
    });
    await this.gameService.joinMatch(id).then();
    this.router.navigateByUrl('/partidaPrivada/'+id);
    this.dialogRef.close();
  }


}
  



@Component({
  selector: 'unirse-privada',
  templateUrl: 'unirse-privada.html',
  styleUrls: ['./menu-inicial.component.css'],
})
export class UnirsePrivada {
  id: string = ""
  loading: boolean = false;
  constructor(public dialogRef: MatDialogRef<UnirsePrivada>, public userService:UsersService, public gameService: GameService, public router: Router,private _snackBar: MatSnackBar) {this.loading = false;}

  async joinGame() {
    if(!this.loading) {
      this.loading = true;
      await this.gameService.infoMatch(this.id).then();
      if(this.gameService.jugadores.length >= this.gameService.partida.njugadores) {
        this._snackBar.open("¡Partida llena!",'',{duration: 4000});
        return;
      }
      this.gameService.jugadores.forEach(j => {
        if(j.nombre == this.userService.username) {
          this._snackBar.open("Estas ya unido a esta partida...",'',{duration: 4000});
          return;
        }
      });
      await this.gameService.joinMatch(this.id).then();
      this.router.navigateByUrl('/partidaPrivada/'+this.id);
      this.dialogRef.close();
      this.loading = false;
    }
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
  loading: boolean = false;
  constructor(public dialogRef: MatDialogRef<ReglasPartidaComponent>, public gameService: GameService, public router: Router) {this.loading = false;}

  changeNplayers(e: any) {
    this.nJugadores = e.target.value;
  }
  
  changeTturno(e: any) {
    this.tiempoTurno = e.target.value;
  }

  async crearPartida() {
    if(!this.loading) {
      this.loading = true;
      await this.gameService.newMatch(this.nJugadores,this.tiempoTurno, this.reglas).then();
      this.router.navigateByUrl('/partidaPrivada/'+this.gameService.id);
      this.dialogRef.close();
      this.loading = false;
    }
  }
}