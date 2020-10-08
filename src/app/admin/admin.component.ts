import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public isLoggedIn$: BehaviorSubject<boolean>;
  
  //variable delcaration
  txtValue: string;
  message : string;
  userMessages: any[] = [];
  botMessages: any[] = [];
  
  constructor(private http: HttpClient, private router: Router) {
    //define what means "idLoggedIn"
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    this.isLoggedIn$ = new BehaviorSubject(isLoggedIn);
  }
  
  //function to send the message to server and get the response
  sendMessage(){
      this.http.post('http://0.0.0.0:5556/sendMessage',{
      text:this.txtValue
    }).toPromise().then(
      (data:any) => {
        this.userMessages.push.apply(this.userMessages, data.response)
      })    
  }

  //function that checks if input is empty, if it's not send the request using sendMessage() function
  checkEmpty(value)
  {
    this.txtValue = value;
    if(this.txtValue == '')
    {
      console.log('empty!')
    }else{
      this.sendMessage();
    }
    
  }
  
  //function to logout the user
  logout() {
    // logic
    localStorage.setItem('loggedIn', 'false');
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }
  
  ngOnInit(): void {

    //initial function to get bots initial messages.
    this.http.get('http://0.0.0.0:5556/getWelcomeMessage')
    .subscribe(
      (data: any) => {
        this.botMessages = data.response;       
      },
      error => {
        alert("ERROR");
      });      
      
      
    }
    
    
  }
  
  
  
  
  