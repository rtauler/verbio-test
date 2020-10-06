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
  
  text:string
  
  userMessages: any[] = [];
  
  botMessages: any[] = [];
  
  constructor(private http: HttpClient) {}
  
  postData(){
    this.http.post('http://0.0.0.0:5556/sendMessage',{
    text:this.text
  }).toPromise().then(
    (data:any) => {
      console.log(data.response)
      this.userMessages = data.response;
  })
  
}

ngOnInit(): void {
  this.http.get('http://0.0.0.0:5556/getWelcomeMessage')
  .subscribe(
    (data: any) => {
      this.botMessages = data.response; 
      // Where you find the array res.data or res.data.data
      
      
    },
    error => {
      alert("ERROR");
    });      
  }
  
  
}




