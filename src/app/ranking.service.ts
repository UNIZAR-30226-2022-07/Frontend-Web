import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  constructor(private http: HttpClient, private userService: UsersService) {
   }


   
  /**
   * Devuelve el ranking de los amigos de un usuario
   * 
   * @returns Observable de la peticion
  */
  friendsRanking(): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.userService.getToken()
      }),
      withCredentials: true
    };
    let body = { username:this.userService.username };
    return this.http.post("https://onep1.herokuapp.com/ranking/rankingAmigos", body, httpOptions);
  }


  /**
   * Devuelve el ranking de un pais
   * 
   * @returns Observable de la peticion
  */
   NacionalRanking(): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.userService.getToken()
      }),
      withCredentials: true
    };
    let body = { pais:this.userService.country};
    return this.http.post("https://onep1.herokuapp.com/ranking/rankingPais", body, httpOptions);
  }


  /**
   * Devuelve el ranking global
   * 
   * @returns Observable de la peticion
  */
   GlobalRanking(): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.userService.getToken()
      }),
      withCredentials: true
    };
    let body = {};
    return this.http.post("https://onep1.herokuapp.com/ranking/rankingMundial", body, httpOptions);
  }

}
