import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
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

  forgotPassword(user: any): Observable<any> {
    return this.http.post("<DIRECCION WEB API>", user);
  }

  sendFriendReq(user:any, friend:any): Observable<any>{
    return this.http.post("https://onep1.herokuapp.com/friends/send/friend-request",user,friend);
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
}
