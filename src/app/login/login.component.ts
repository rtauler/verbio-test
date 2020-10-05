import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private Auth: AuthService) { }

  ngOnInit() {
  }

  loginUser(event){
    event.preventDefault()
    const target = event.target
    const user = target.querySelector("#user").value
    const password = target.querySelector("#password").value
    
    this.Auth.getUserDetails(user, password).subscribe(data => {
      if(data.success){
       //redirect to /admin 
      } else{
        window.alert(data.message)
      }
    })
    console.log(user,password)
  }

}
