import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private http: HttpClient, private userService: UsersService) { }

  /**
   * Envia una solicitud de amistad
   * @param friendname Usuario a quien envias la solicitud
   * @returns Observable de la peticion
  */
  addRequest(friendname: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.userService.getToken()
      }),
      withCredentials: true
    };
    let body = { username:this.userService.username, friendname:friendname };
    return this.http.post("https://onep1.herokuapp.com/friends/send/friend-request", body, httpOptions);
  }

  /**
   * Obtiene las invitaciones de amistad pendientes
   * @returns Observable de la peticion
  */
  getRequests(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+this.userService.getToken()
      }),
      withCredentials: true
    };
    let body = { username:this.userService.username };
    return this.http.post("https://onep1.herokuapp.com/friends/receive/friend-request", body,httpOptions);
  }

  /**
   * Acepta una solicitud de amistad
   * @param friendname Usuario a quien aceptas la solicitud
   * @returns Observable de la peticion
  */
  acceptRequest(friendname: string): Observable<any> {
    let body = { username:this.userService.username, friendname:friendname };
    return this.http.post("https://onep1.herokuapp.com/friends/accept/friend-request", body);
  }

  /**
   * Cancela una solicitud de amistad
   * @param friendname Usuario a quien cancelas la solicitud
   * @returns Observable de la peticion
  */
  cancelRequest(friendname: string): Observable<any> {
    let body = { username:this.userService.username, friendname:friendname };
    return this.http.post("https://onep1.herokuapp.com/friends/cancel/friend-request", body);
  }

  /**
   * Obtiene la lista de tus amigos
   * @returns Observable de la peticion
  */
  getFriends(): Observable<any> {
    let body = { username:this.userService.username };
    return this.http.post("https://onep1.herokuapp.com/friends/friendsList", body);
  }

  /**
   * Borra un amigo
   * @param friendname Usuario que borras
   * @returns Observable de la peticion
  */
  removeFriend(friendname: string): Observable<any> {
    let body = { username:this.userService.username, friendname:friendname };
    return this.http.post("https://onep1.herokuapp.com/friends/deleteFriend", body);
  }

  getInvitations(): Observable<any> {
    let body = {username:this.userService.username}
    return this.http.post("https://onep1.herokuapp.com/game/getInvitacionesPartida",body);
  }

}
