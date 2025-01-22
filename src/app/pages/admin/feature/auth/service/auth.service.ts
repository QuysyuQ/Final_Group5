import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginRequest } from '../models/login-request.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LoginRepose } from '../models/login-reponse.model';
import { BASE_URL } from '../../../../../constant.model';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user = new BehaviorSubject < User | undefined >(undefined);


  constructor(private http : HttpClient,
              private cookieService : CookieService){
  }

  login(request : LoginRequest) : Observable<LoginRepose>
  {
    return this.http.post<LoginRepose>(`${BASE_URL}/Authentication/login-user`,request);
  }

  setUser(user: User) : void {
    this.$user.next(user);
    localStorage.setItem('user-email',user.email);
    
  }



  user() : Observable<User | undefined>{
    return this.$user.asObservable();
  }

  getUser() : User | undefined{
    const email = localStorage.getItem("user-email");

    if(email){
      
      return {email:email};
    }

    return undefined;
  }

  logOut(): void {
    localStorage.removeItem("user-email");
    this.cookieService.delete("Authentication","/");
    this.$user.next(undefined)
  }

}
