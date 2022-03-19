import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private cookies: CookieService) {}

  login(user: any): Observable<any> {
    return this.http.post("<DIRECCION WEB API>", user);
  }

  register(user: any): Observable<any> {
    return this.http.post("<DIRECCION WEB API>", user);
  }

  forgotPassword(user: any): Observable<any> {
    return this.http.post("<DIRECCION WEB API>", user);
  }

  // Cookies
  setToken(token: string) {
    this.cookies.set("token", token);
  }

  getToken() {
    return this.cookies.get("token");
  }
}
