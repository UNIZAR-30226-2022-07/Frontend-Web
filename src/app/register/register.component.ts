import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //Form
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  
  //Error handling
  passwordError: boolean = false;
  serviceError: boolean = false;
  serviceErrorMessage: string = "";
  userError: boolean = false;

  constructor(public userService: UsersService, public router: Router) { }

  ngOnInit(): void {
  }

  //Metodo ejecutado al presionar el boton "registrarse"
  register() {
    if(this.password != this.confirmPassword) {
      this.passwordError = true;
      return;
    }
    this.passwordError = false;
    const user = { email: this.email, password: this.password };
    this.userService.register(user).subscribe(
      res => {
        // TODO(Marcos): Guardar con setToken algo de res para recordar que el login es correcto. Hacer set tambien de userError
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

  //Devuelve false si se puede hacer click en el boton register. True en caso contrario 
  validate() {
    return this.email == "" || this.password == "" || this.confirmPassword == ""
  }

}
