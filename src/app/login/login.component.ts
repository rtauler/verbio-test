import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  constructor(private Auth: AuthService, private router: Router) { }
  
  ngOnInit() {
  }
  
  //funciton to log in user accepts to constants user and password
  loginUser(user, password){ 
    //uses autorization service to user a tokenized request
    this.Auth.getUserDetails(user, password).subscribe(
      res => {
        //if request is successfull redirect to admin and set logged in to true
        if(res.session_id){
          this.router.navigate(['/admin']);
          this.Auth.setLoggedIn(true)
        } else{
        }
        //save in localstorage the token that the server gave us
        localStorage.setItem('token',res.session_id)
      },
      err => console.log(err)
      )
    }
     
    checkEmpty(event)
    { 
      event.preventDefault()
      //get all the info from the login form
      const target = event.target
      //get the user value and put in a constant
      const user = target.querySelector("#user").value
      //get the password value and put in a constant
      const password = target.querySelector("#password").value
      //check if either of the values is empty
      if(user == '' || password == '')
      {
        //if so do not proceed with http request and display error
        alert('Login or Password field is empty!')
      }else{
        //if either are filled, proceed with the http request
        this.loginUser(user,password);
      }      
    }    
  }
  