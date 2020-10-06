import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  
  
  text:string
  
  userMessages: any[] = [];
  
  botMessages: any[] = [];
  
  constructor(private http: HttpClient) {}
  
  postData(){
    this.http.post('http://0.0.0.0:5556/sendMessage',{
    text:this.text
  }).toPromise().then(
    (data:any) => {

      this.userMessages.push.apply(this.userMessages, data.response)
      console.log(this.userMessages)
      console.log(data)

  })
  
}

ngOnInit(): void {
  this.http.get('http://0.0.0.0:5556/getWelcomeMessage')
  .subscribe(
    (data: any) => {
      this.botMessages = data.response; 
      console.log(this.botMessages)
      // Where you find the array res.data or res.data.data
      
      
    },
    error => {
      alert("ERROR");
    });      
  }
  
  
}




