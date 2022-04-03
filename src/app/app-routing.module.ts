import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './login/login.component';
import { MenuInicialComponent } from './menu-inicial/menu-inicial.component';
import { RegisterComponent } from './register/register.component';
import { TosComponent } from './tos/tos.component';

const routes: Routes = [
  { path: "", component: AppComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "menuInicial", component: MenuInicialComponent },
  { path: "forgotPassword", component: ForgotPasswordComponent }, 
  { path: "tos", component: TosComponent }, 
  { path: "game", component: GameComponent }, 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
