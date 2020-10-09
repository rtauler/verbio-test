import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked  } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewChecked {

  //variable delcaration
  public isLoggedIn$: BehaviorSubject<boolean>;
  txtValue: string;
  message : string;
  userMessages: any[] = [];
  userMessagesStored: any[] = [];
  botMessages: any[] = [];

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;


  constructor(private http: HttpClient, private router: Router) {
    //define what means "idLoggedIn"
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    this.isLoggedIn$ = new BehaviorSubject(isLoggedIn);
  }

  
  

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}


  //check if user messages exist
  checkMessages(){
    
    //check if local key for storing messages exists
    if(localStorage.getItem('user-messages')){
      //get localstorage stored messages
      this.userMessagesStored = JSON.parse(localStorage.getItem('user-messages'));
      //replace empty usermessages by the stored ones
      this.userMessages.push.apply(this.userMessages,this.userMessagesStored)

      //else, if there's no localstorage key created
    }else{
      console.log('no local storage key created')
      //we create one
      localStorage.setItem('user-messages', JSON.stringify(this.userMessages));
    }
  }


  
  
  //function to send the message to server and get the response
  sendMessage(){ 
    //send http request
    this.http.post('http://0.0.0.0:5556/sendMessage',{
    text:this.txtValue
  }).toPromise().then(
    (data:any) => {
      console.log(data.response)
      //push server response onto user messages array
      this.userMessages.push.apply(this.userMessages, data.response)
      //get localstorage stored messages
      this.userMessagesStored = JSON.parse(localStorage.getItem('user-messages'));
      //concatenate new messages to stored ones
      this.userMessages.concat(this.userMessagesStored)
      //save onto local storage
      localStorage.setItem('user-messages', JSON.stringify(this.userMessages));
    })  
    this.scrollToBottom();
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
    localStorage.removeItem('token');
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }


  
  ngOnInit(): void {
    //check if token exist
    if(!localStorage.getItem('token')){
      //navigate to login page
      this.router.navigate(['/login'])
      //set status to false
      localStorage.setItem('loggedIn', 'false');
    }
    //call checkmessages function to see if theres any messages stored in localstorage
    this.checkMessages();
    //initial function to get bots initial messages.
    this.http.get('http://0.0.0.0:5556/getWelcomeMessage')
    .subscribe(
      (data: any) => {
        this.botMessages = data.response;       
      },
      error => {
      });          
      //this makes scrolling work properly
      this.scrollToBottom();
    } 
    ngAfterViewChecked(): void {
      //this makes scrolling work properly
      this.scrollToBottom(); 
    }
  }

        
  
  
  
  
  
  