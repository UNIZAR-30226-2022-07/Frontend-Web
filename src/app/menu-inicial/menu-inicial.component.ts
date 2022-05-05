
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute,Params, Router } from '@angular/router';
import { FriendService } from '../friend.service';
import { WebsocketService } from '../websocket.service';




@Component({
  selector: 'app-menu-inicial',
  templateUrl: './menu-inicial.component.html',
  styleUrls: ['./menu-inicial.component.css']
})
export class MenuInicialComponent implements OnInit {


  nombre: string | null = null;

  constructor(private route: ActivatedRoute, public router: Router, public dialog:MatDialog) {
  }
  
  ngOnInit(): void {
    
    // Se coge el nombre del parametro que te pasan desde el log-in
    this.nombre = this.route.snapshot.paramMap.get('username');

  }

  openDialog(){
      const dialogRef2 = this.dialog.open(DialogContent,
        {
          data: this.nombre,
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

  listaAmigos: any;
  searchText!: string;

  name : string | null = null;
  nameUser2Search : string = "";

  

  

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public friendService: FriendService) {
    this.name = data.name;


  }
  
  ngOnInit(): void {
     this.listaAmigos = [{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"}]
    console.log(this.name);
  }

  friend_reqButton(): void{
 /* this.userService.sendFriendReq(this.name,friend).subscribe({
    
        
    } )*/


    
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

/*
  mostrarAmigos(): void{
    const username = {username : this.name};
    this.userService.mostrarAmigos(username).subscribe({
      next: (v) => {
        console.log("Ha ido bien la lista de amigos");
        this.listaAmigos = v.username;


      },
      error: (e) =>{
        console.log("Ha ido mal");
      }
    })
  }*/
}

@Component({
  selector: 'notis-content',
  templateUrl: 'notis-content.html' ,
  styleUrls: ['./notis-content.css']
})
export class NotisContent {
  
  listaNotis: Array<String> = [];
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
       

        /*
        const mensaje = JSON.stringify(data);
        const nombre = mensaje.split("\"");
        console.log(mensaje);
        console.log(nombre);
        this.listaNotis = mensaje.split(",");
        */
        
    

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

}
  



@Component({
  selector: 'unirse-privada',
  templateUrl: 'unirse-privada.html',
  styleUrls: ['./menu-inicial.component.css'],
})
export class UnirsePrivada {
  id: string = ""
  constructor(public dialogRef: MatDialogRef<UnirsePrivada>, public websocketService: WebsocketService, public router: Router) {}

  joinGame() {
    this.websocketService.joinMatch(this.id);
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
  constructor(public dialogRef: MatDialogRef<ReglasPartidaComponent>, public websocketService: WebsocketService, public router: Router) {}

  changeNplayers(e: any) {
    this.nJugadores = e.target.value;
  }
  
  changeTturno(e: any) {
    this.tiempoTurno = e.target.value;
  }

  async crearPartida() {
    await this.websocketService.newMatch(this.nJugadores,this.tiempoTurno);
    this.router.navigateByUrl('/partidaPrivada/'+this.websocketService.id);
    this.dialogRef.close();
  }
}