import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../models/login-request.model';
import { AuthService } from '../service/auth.service';
import { Route, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  login : LoginRequest;

  constructor(private authService : AuthService,
              private router : Router,
              private cookieService : CookieService

  ){
    this.login = 
    {
      email :'',
      password : ''
    }
  }

  onLogin() {
    if(this.login.email == '' || this.login.password == '')
    {
      confirm("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if(!this.login.email.includes("@"))
    {
      confirm("Định dạng email không đúng");
      return;
    }
    this.authService.login(this.login).subscribe
    ({
      next : reponse => {
        this.cookieService.set('Authentication',
          `Bearer ${reponse.token}`, undefined,'/',undefined,true,'Strict');
       
        this.authService.setUser({email : this.login.email})
        
        var userRole = reponse.role;
        
        if (userRole == "Administrator")
        {
          this.router.navigateByUrl('admin/home')
        }
        else
        {
          confirm("Tài khoản đăng nhập không có quyền để truy cập ");
        }
        
      },
      error : err => {
        confirm("Tài khoản mật khẩu không chính xác")
      }
    })
  }

}
