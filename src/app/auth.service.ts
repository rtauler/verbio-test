import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface myData{
  session_id: string;
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false')

  constructor(private http: HttpClient) { }

  setLoggedIn(value: boolean){
    this.loggedInStatus = value
    localStorage.setItem('loggedIn','true')
  }

  get isLoggedIn(){
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString())
  }

  getUserDetails(user,password){
    //post details to APi Server and return if correct
    return this.http.post<myData>('http://0.0.0.0:5556/login', {
      user,
      password
    })
  }

  getToken(){
    return localStorage.getItem('token')
  }

}
