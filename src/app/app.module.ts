import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DialogContent, MenuInicialComponent, NotisContent } from './menu-inicial/menu-inicial.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TosComponent } from './tos/tos.component';
import { ChoseColorComponent, GameComponent } from './game/game.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { TorneoComponent } from './torneo/torneo.component';
import { TorneoEsperaComponent } from './torneo-espera/torneo-espera.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PartidaPrivadaComponent, ReglasPartidaComponent } from './partida-privada/partida-privada.component';
import { AuthInterceptor } from './auth.interceptor';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MenuInicialComponent,
    ForgotPasswordComponent,
    TosComponent,
    GameComponent,
    DialogContent,
    NotisContent,
    ChoseColorComponent,
    TorneoComponent,
    TorneoEsperaComponent,
    LeaderboardComponent,
    PartidaPrivadaComponent,
    ReglasPartidaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    Ng2SearchPipeModule
  ],
  providers: [CookieService,
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true,
              }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
