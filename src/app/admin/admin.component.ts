import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  
  messages = [''];
  addMessage(newMessage: string) {
    if (newMessage) {
      this.messages.push(newMessage);
    }
  }

  myData: any[] = [];
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.http.get('http://0.0.0.0:5556/getWelcomeMessage')
    .subscribe(
      (data: any) => {
        this.myData = data; 
        // Where you find the array res.data or res.data.data
        console.log('res is ', data);
      },
      error => {
        alert("ERROR");
      });      
    }
    
    
  }
  