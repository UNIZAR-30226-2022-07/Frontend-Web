import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = "";
  serviceSent: boolean = false;
  serviceError: boolean = false;
  serviceErrorMessage: any;

  constructor(public userService: UsersService, public router:Router) { }

  ngOnInit(): void {
  }

  //Metodo ejecutado al presionar el boton "iniciar sesion"
  mandarCodigo() {

    
    console.log("Entro en mandar codigo " + this.email);
    const user = {email: this.email};
    this.userService.forgotPassword(user).subscribe({
      next: (v) => {
        console.log("Ha ido bien");
        this.router.navigateByUrl('/restablecerContra');

      },
      error: (err) =>{
        console.log("Ha ido mal");
        this.serviceError = true;
        this.serviceErrorMessage = err.message;
        console.log("El mensaje es " + this.serviceErrorMessage);
      }
    })
   
  }

  //Devuelve false si se puede hacer click en el boton login. True en caso contrario 
  
  validate() {
    return this.email == ""
  }

}
