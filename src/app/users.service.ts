import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public username: string = "";
  public country: string = "";
  public email: string = "";
  public points: number = 0;
  

  constructor(private http: HttpClient, private cookies: CookieService) {}
  
  //----------------------------- API interaction -----------------------------//
  login(user: any): Observable<any> {
    return this.http.post("https://onep1.herokuapp.com/api/auth/signin", user);
  }

  register(user: any): Observable<any> {
    return this.http.post("https://onep1.herokuapp.com/api/auth/signup", user);
  }

  

  changeName(nuevo_usuario:string): Observable<any> {
    let body = { username:this.username, newUsername: nuevo_usuario };
    return this.http.post("https://onep1.herokuapp.com/user/changeUsername",body)
  }

  changeCountry(nuevo_pais:string): Observable<any> {
    let body = { username:this.username, pais:nuevo_pais};
    return this.http.post("https://onep1.herokuapp.com/user/changePais",body);
  }

  removeAccount(): Observable<any>{


    console.log("El nombre de usuario es "+ this.username);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.getToken()
      }),
      withCredentials: true
    };
    let body = { username:this.username};
    return this.http.post("https://onep1.herokuapp.com/user/deleteUser",body,httpOptions);
  }

  forgotPassword(user:any): Observable<any> {
 
    return this.http.post("https://onep1.herokuapp.com/api/auth/forgot_password",user);
  }

  setNewPassword(token:string,password:string, email:string){
    let body = {email:email, token:token,password:password};
    return this.http.post("https://onep1.herokuapp.com/api/auth/reset_password",body);
  }

  

  

  //----------------------------- Cookies -----------------------------//
  setToken(token: string) {
    this.cookies.set("token", token);
  }

  getToken() {
    return this.cookies.get("token");
  }

  //----------------------------- User -----------------------------//
  getInfo() {
    return {
      "username": this.username,
      "email": this.email,
      "country": this.country,
      "points": this.points,
      "token": this.getToken()
    }
  }

  setInfo(username: string, email: string, country: string, points: number) {
    this.username = username;
    this.email = email;
    this.country = country;
    this.points = points;
  }
  mandarEmail(username: string, token:string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.getToken()
      }),
      withCredentials: true
    };
    let body = {username:username, token:token};
    return this.http.post("https://onep1.herokuapp.com/api/auth/activarCuenta",body,httpOptions);
  }
}

