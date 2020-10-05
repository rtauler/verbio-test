import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  

  constructor(private http: HttpClient) { 
    
    
    this.http.get('http://0.0.0.0:5556/getWelcomeMessage').toPromise().then(
    data => {
      console.log(data);
    }
    )
  }
  
  ngOnInit(): void {
  }
  
}
