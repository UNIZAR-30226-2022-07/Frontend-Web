import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LoginComponent } from './login/login.component';
import { MenuInicialComponent } from './menu-inicial/menu-inicial.component';
import { RegisterComponent } from './register/register.component';
import { TorneoEsperaComponent } from './torneo-espera/torneo-espera.component';
import { TorneoComponent } from './torneo/torneo.component';
import { TosComponent } from './tos/tos.component';
import { PartidaPrivadaComponent } from './partida-privada/partida-privada.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { LoggedGuard } from './logged.guard';


const routes: Routes = [
  { path: "", component: MenuInicialComponent, canActivate: [LoggedGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgotPassword", component: ForgotPasswordComponent }, 
  { path: "tos", component: TosComponent }, 
  { path: "game", component: GameComponent, canActivate: [LoggedGuard] }, 
  { path: "torneo", component: TorneoComponent, canActivate: [LoggedGuard] },
  { path: "torneoEspera/:id", component: TorneoEsperaComponent, canActivate: [LoggedGuard] },
  { path: "leaderboard", component: LeaderboardComponent, canActivate: [LoggedGuard] },
  { path: "partidaPrivada/:id", component:PartidaPrivadaComponent, canActivate: [LoggedGuard] },
  { path: "edit-profile", component:EditProfileComponent, canActivate: [LoggedGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
