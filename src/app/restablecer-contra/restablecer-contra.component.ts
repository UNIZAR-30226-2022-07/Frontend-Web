import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UsersService } from '../users.service';

@Component({
  selector: 'app-restablecer-contra',
  templateUrl: './restablecer-contra.component.html',
  styleUrls: ['./restablecer-contra.component.css']
})
export class RestablecerContraComponent implements OnInit {
  incorrecto : boolean = false;
  email:string = "";
  contrasenya : string = "";
  token : string = "";
  constructor(public userService: UsersService, public router:Router) { }

  ngOnInit(): void {
  }


  
  restablecerContra(): void{
 
    this.userService.setNewPassword(this.token,this.contrasenya,this.email).subscribe({
      next: (v) => {
        console.log("Ha ido bien");
        this.router.navigateByUrl('/login');
        
      },
      error: (e) =>{
        console.log("Ha ido mal");
        this.incorrecto = true;
      }
    })
  }
}

  

