import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getUserDetails(user,password){
    //post details to APi Server and return if correct
    return this.http.post('http://0.0.0.0:5556/login', {
      user,
      password
    })
  }

}
