import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = "";
  password: string = "";
  serviceError: boolean = false;
  serviceErrorMessage: string = "";
  userError: boolean = false;


  constructor(public userService: UsersService, public router: Router) { }

  ngOnInit(): void {
  }
  //Metodo ejecutado al presionar el boton "iniciar sesion"
  login_button() {
    const user = {username: this.username, password: this.password};
    this.userService.login(user).subscribe({
      next: (v) => {
        this.userService.setInfo(v.username,v.email,v.pais,v.puntos)
        this.userService.setToken(v.accessToken)
        // NOTE(Marcos): Para borrar la cookie (hacer logout): this.cookies.delete("token");
        this.router.navigateByUrl('/menuInicial');
      },
      error: (e) => {
        if (e.status == 401) {
          this.userError = true;
        }
        else {
          console.error(e);
          this.serviceError = true;
          this.serviceErrorMessage = e.message;
        }
      }
    });
  }

  //Devuelve false si se puede hacer click en el boton login. True en caso contrario 
  
  validate() {
    return this.username == "" || this.password == ""
  }

}
