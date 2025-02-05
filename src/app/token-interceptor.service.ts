import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{
  
  constructor(private injector: Injector) { }
  
  //generate token headers for requests
  intercept(req, next){
    let authService = this.injector.get(AuthService)
    let tokenizedReq = req.clone({
      setHeaders: {
        'Content-Type' : 'application/json', 
        'Authorization' : `Bearer ${authService.getToken()}`
      }
    })
    return next.handle(tokenizedReq)
  }
}
