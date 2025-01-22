import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { customerAdd } from '../../../../admin/feature/customer/model/customerAdd.model';
import { CustomerService } from '../../../../admin/feature/customer/service/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  passwordMismatch : boolean = false;
  user : customerAdd;
  confirmPassword : string;
  userNull : boolean = false;
  fullNameNull : boolean = false;
  emailNull : boolean = false;
  checkPhoneNB : boolean = false;

  constructor(private customerService : CustomerService,
              private router : Router) {
    this.user = {
      userName : '',
      fullName :'',
      email : '',
      password : '',
      phoneNumber : '',
      address : '',
      isActive : 1,
    }

    this.confirmPassword = ''
  }

  onRegister() {
    if(this.user.userName == '') 
    {
      this.userNull = true;
    }
    if(this.user.fullName == '') 
    {
      this.fullNameNull = true;
    }
    if(this.user.email == '' || !this.user.email.includes("@")) 
    {
      this.emailNull = true;
    }
    if(this.user.phoneNumber != '' && !this.checkPhoneNumber(this.user.phoneNumber))
    {
      this.checkPhoneNB = true;
    }

    if(this.confirmPassword == this.user.password && this.confirmPassword != '') {
      this.passwordMismatch = false;
      if(this.checkPassword(this.confirmPassword))
      {
          this.customerService.creatUser(this.user).subscribe({
            next : response => {
            if(confirm('Bạn đăng ký tài khoản thành công ! Bạn có muốn quay lại trang đăng nhập !'))
            {
              this.router.navigateByUrl('loginwebsite')
            }
            },
            error : err => {
              confirm("Đăng ký thất bại, tên người dùng hoặc email đã tồn tại !")
            }
        })
        return;
      }

      this.passwordMismatch = true;

    }
    else
    {
      this.passwordMismatch = true;
    }
  }

  onConfirmPasswordChange() {
    this.passwordMismatch = false;
  }
  onUserNameChange(){
    this.userNull = false
  }
  onFullNameChange() {
    this.fullNameNull = false
  }
  onEmailChange() {
    this.emailNull = false
  }

  checkPassword(password : string) : boolean {
    const isLongEnough = password.length >= 8;

    const hasUpper = /[A-Z]/.test(password);

    const hasLower = /[a-z]/.test(password);

    const hasDigit = /\d/.test(password);

    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    return isLongEnough && hasUpper && hasLower && hasDigit && hasSpecial;
  }

  checkPhoneNumber(phone: string): boolean {
    
    const isValidPhoneNumber = /^\d+$/.test(phone);

    return isValidPhoneNumber;
  }
}
