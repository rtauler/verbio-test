import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface myData{
  session_id: string;
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = false

  constructor(private http: HttpClient) { }

  setLoggedIn(value: boolean){
    this.loggedInStatus = value
  }

  get isLoggedIn(){
    return this.loggedInStatus
  }

  getUserDetails(user,password){
    //post details to APi Server and return if correct
    return this.http.post<myData>('http://0.0.0.0:5556/login', {
      user,
      password
    })
  }

}
