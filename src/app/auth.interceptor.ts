import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public userService: UsersService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(request.url)
    // if request
    // request = request.clone({
    //   headers: new HttpHeaders({
    //     'Authorization': "Bearer "+this.userService.getToken()
    //   }),
    //   withCredentials: true
    // });
    return next.handle(request);
  }
}