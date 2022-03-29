import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DialogContent, MenuInicialComponent } from './menu-inicial/menu-inicial.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TosComponent } from './tos/tos.component';
import { GameComponent } from './game/game.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {MaterialModule} from './material/material.module';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MenuInicialComponent,
    ForgotPasswordComponent,
    TosComponent,
    GameComponent,
    DialogContent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
