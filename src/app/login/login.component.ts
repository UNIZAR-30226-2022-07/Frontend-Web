import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  serviceError: boolean = false;
  serviceErrorMessage: string = "";
  userError: boolean = false;


  constructor(public userService: UsersService, public router: Router) { }

  ngOnInit(): void {
  }
  //Metodo ejecutado al presionar el boton "iniciar sesion"
  login() {
    const user = {email: this.email, password: this.password};
    this.userService.login(user).subscribe(
      res => {
        // TODO(Marcos): Guardar con setToken algo de res para recordar que el login es correcto. Tocar userError tambien
        // this.userService.setToken(res.algo);
        // NOTE(Marcos): Para borrar la cookie (hacer logout): this.cookies.delete("token");
        this.router.navigateByUrl('/');
      },
      err => {
        this.serviceError = true
        this.serviceErrorMessage = err.message
      }
    );
  }

  //Devuelve false si se puede hacer click en el boton login. True en caso contrario 
  
  validate() {
    return this.email == "" || this.password == ""
  }

}
