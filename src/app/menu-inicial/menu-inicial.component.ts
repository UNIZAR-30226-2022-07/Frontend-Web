
import { coerceStringArray } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FormControl,Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Input } from '@angular/core';
import { ActivatedRoute,Params, Router } from '@angular/router';



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
    const dialogRef = this.dialog.open(DialogContent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }
    openNotis(){
      const dialogRef = this.dialog.open(NotisContent);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      })
    }

    pedirCodigo(){
      const dialogRef = this.dialog.open(FormFieldErrorExample);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      })
    }
    crearPPrivada(){
      const dialogRef = this.dialog.open(ReglasPartidaComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      })
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

  

  

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
    this.listaAmigos = [{nombre:"cesar"}, {nombre:"victor"},{nombre:"marcos"}]  
  }

  friend_reqButton(friend : Observable<any>): void{




    /*this.userService.register(user).subscribe({
    const username = { user.username};
      next: (v) => {this.router.navigateByUrl('/login'); },
      error: (e) => {
        if (e.error.message != undefined) {
          console.error(e);
          this.userError = true;
          this.userErrorMessage = e.error.message;
        }
        else {
          console.error(e);
          this.serviceError = true;
          this.serviceErrorMessage = e.message;
        }
        */
  }  
  
}

@Component({
  selector: 'notis-content',
  templateUrl: 'notis-content.html' ,
  styleUrls: ['./menu-inicial.component.css']
})
export class NotisContent {
  listaNotis: any;

  constructor(public dialog:MatDialog){}

  ngOnInit(): void{
    this.listaNotis = [{nombre:"cesar",mensaje:"te ha invitado a su partida"},{nombre:"victor",mensaje:"quiere ser tu amigo"},{nombre:"paula",mensaje:"quiere ser tu amigo"}]
  }
}


@Component({
  selector: 'form-field-error-example',
  templateUrl: 'form-field-error-example.html',
  styleUrls: ['./menu-inicial.component.css'],
})
export class FormFieldErrorExample {
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}



@Component({
  selector: 'reglasPartidaPrivada',
  templateUrl: 'reglasPartidaPrivada.html',
  styleUrls: ['./menu-inicial.component.css']
})
export class ReglasPartidaComponent {

  

  matchID: string | null = null;
  nJugadores: number = 6;
  tiempoTurno: number = 10;
  players!: Array<any>;
  reglas: Array<boolean> = [false, false, false, false, false, false] //0switch, Crazy7, ProgressiveDraw, ChaosDraw, BlockDraw, RepeatDraw
  constructor(public dialogRef: MatDialogRef<ReglasPartidaComponent>) {}

  changeNplayers(e: any) {
    this.nJugadores = e.target.value;
  }
  
  changeTturno(e: any) {
    this.tiempoTurno = e.target.value;
  }
}