import { Component } from '@angular/core';
import { AuthService } from '../../../../admin/feature/auth/service/auth.service';
import { LoginRequest } from '../../../../admin/feature/auth/models/login-request.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login-website',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-website.component.html',
  styleUrl: './login-website.component.css'
})
export class LoginWebsiteComponent {

  login : LoginRequest;
  passwordType : string = 'password';

  emailError: string = '';
  passwordError: string = '';

  constructor(private authService : AuthService,
              private router : Router,
              private cookieService : CookieService
   ) {
    this.login = {
      email : '',
      password : '',
    }
  }

  onLogin() {

    this.emailError = '';
    this.passwordError = '';

    if(this.login.email == '' || this.login.password == '')
    {
      this.emailError = 'Vui lòng điền email';
      this.passwordError = 'Vui lòng điền mật khẩu';
      return;
    }

    if(!this.login.email.includes("@"))
    {
      this.emailError = 'Định dạng email không đúng';
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
          this.router.navigateByUrl('')
        }
        
      },
      error : err => {
        confirm("Tài khoản mật khẩu không chính xác")
      }
    })
  }


  passwordVisibility(event: any) {
    if (event.target.checked)
    {
      this.passwordType ='text';
    }
    else 
    {
      this.passwordType = 'password'
    }
  }

  clearEmailError() {
    if(this.login.email != "")
    {
      this.emailError = ''
    }
  }
  
  clearPasswordError() {
    if(this.login.password != "")
    {
      this.passwordError = ''
    }
  }

}
