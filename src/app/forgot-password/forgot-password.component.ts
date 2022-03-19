import { Component, OnInit } from '@angular/core';
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

  constructor(public userService: UsersService) { }

  ngOnInit(): void {
  }

  //Metodo ejecutado al presionar el boton "iniciar sesion"
  login() {
    const user = {email: this.email};
    this.userService.forgotPassword(user).subscribe(
      res => {
        this.serviceSent = true;
      },
      err => {
        this.serviceError = true
        this.serviceErrorMessage = err.message
      }
    );
  }

  //Devuelve false si se puede hacer click en el boton login. True en caso contrario 
  
  validate() {
    return this.email == ""
  }

}
