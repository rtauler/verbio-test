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
  
  txtValue: string;
  message : string;
  
  userMessages: any[] = [];
  
  botMessages: any[] = [];
  
  constructor(private http: HttpClient, private router: Router) {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    this.isLoggedIn$ = new BehaviorSubject(isLoggedIn);
  }
  
  postData(){
      this.http.post('http://0.0.0.0:5556/sendMessage',{
      text:this.txtValue
    }).toPromise().then(
      (data:any) => {
        this.userMessages.push.apply(this.userMessages, data.response)
      })    
  }


  checkEmpty(value)
  {
    this.txtValue = value;
    if(this.txtValue == '')
    {
      console.log('empty!')
    }else{
      this.postData();
    }
    
  }
  
  logout() {
    // logic
    localStorage.setItem('loggedIn', 'false');
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }
  
  ngOnInit(): void {
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
  
  
  
  
  