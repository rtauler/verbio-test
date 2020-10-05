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

  loginUser(event){
    event.preventDefault()
    const target = event.target
    const user = target.querySelector("#user").value
    const password = target.querySelector("#password").value
    
    this.Auth.getUserDetails(user, password).subscribe(
      res => {
        if(res.session_id){
          this.router.navigate(['/admin']);
          this.Auth.setLoggedIn(true)
        } else{
          console.log('nope')
        }
        console.log(res)
        localStorage.setItem('token',res.session_id)
      },
      err => console.log(err)
    )
    console.log(user,password)
  }

}
