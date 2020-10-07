import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface myData{
  message: string,
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getSomeData(){
    this.http.get('http://0.0.0.0:5556/getWelcomeMessage')
  }
}
