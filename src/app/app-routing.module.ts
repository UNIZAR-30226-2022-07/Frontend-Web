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
import { ReglasPartidaComponent } from './partida-privada/partida-privada.component';

const routes: Routes = [
  { path: "", component: AppComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "menuInicial", component: MenuInicialComponent },
  { path: "forgotPassword", component: ForgotPasswordComponent }, 
  { path: "tos", component: TosComponent }, 
  { path: "game", component: GameComponent }, 
  { path: "torneo", component: TorneoComponent },
  { path: "torneoEspera/:id", component: TorneoEsperaComponent },
  { path: "leaderboard", component: LeaderboardComponent },
  { path: "partidaPrivada", component:PartidaPrivadaComponent},
  { path: "reglasPartida", component:ReglasPartidaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
