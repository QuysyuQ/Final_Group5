import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailForgot } from '../../../../admin/feature/customer/model/email-forgot.model';
import { OTPResponse } from '../../../../admin/feature/customer/model/otp.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SendEmailService } from '../../../../admin/feature/customer/service/send-email.service';
import { customerResponse } from '../../../../admin/feature/customer/model/customer.model';
import { customerAdd } from '../../../../admin/feature/customer/model/customerAdd.model';
import { CustomerService } from '../../../../admin/feature/customer/service/customer.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  emailForgot : EmailForgot;
  otpResponse : OTPResponse;
  isOTPVisible: boolean = false;
  isButtonSend : boolean = true;
  otp: number = 0;
  customerResponse : customerResponse;


  constructor(private router : Router,
              private sendEmailService : SendEmailService,
              private customerService : CustomerService,
  ) {
    this.emailForgot = {
      email : ''
    };
    this.otpResponse = {
      email : '',
      otp : 0,
      password : '',
      sendTime :new Date(1,1,1900),
    }
    this.customerResponse = {
      isActive : 0,
      address : '',
      fullName : '',
      id : '',
      userName : '',
      normalizedUserName : '',
      email : '',
      normalizedEmail : '',
      emailConfirmed : false,
      passwordHash : '',
      securityStamp : '',
      concurrencyStamp :'',
      phoneNumber : '',
      phoneNumberConfirmed : false,
      twoFactorEnabled : false,
      lockoutEnabled : false,
      accessFailedCount : 0,
      online : '',
      NumberDayOff : 0 ,
    }
  }

  onBack() {
    this.router.navigateByUrl('loginwebsite')
  }

  showOTPSection() {
    if(this.emailForgot.email)
    {
      this.isOTPVisible = true;
      this.isButtonSend = false;
      
      this.sendEmailService.sendEmailForgotPassword(this.emailForgot)
        .subscribe({
          next : reponse => {
            this.otpResponse = reponse;
          }
        })
    }
  }

  verifyOTP() {
    if(this.otp == this.otpResponse.otp && this.emailForgot.email == this.otpResponse.email)
    {
      const sendTime = new Date(this.otpResponse.sendTime)
      console.log(sendTime)
      const currenTime = new Date().getTime();
      const timeDifference = (currenTime - sendTime.getTime()) / 1000
      
      if (timeDifference > 300) { 
        alert("Mã OTP đã hết hạn.");
        return;  
      }

      console.log("email forgot :", this.emailForgot.email)
      console.log("email otp : ", this.otpResponse.email)

      this.customerService.getCustomerByEmail(this.emailForgot.email).subscribe({
        next : response => {
          this.customerResponse = response;
          console.log(this.customerResponse)
          const customerUpdate : customerAdd = {
            fullName : this.customerResponse.fullName,
            userName :this.customerResponse.userName,
            email : this.customerResponse.email,
            password : this.otpResponse.password,
            phoneNumber : this.customerResponse.phoneNumber,
            address : this.customerResponse.address,
            isActive :this.customerResponse.isActive
          }
    
          this.customerService.updateUser(this.customerResponse.id, customerUpdate).subscribe({
            next : response => {
              confirm("Xác thực thành công, bạn có thể đăng nhập bằng mật khẩu mới !");
              this.router.navigateByUrl('loginwebsite')
            },
            error : err => {
              console.log(err);
            }
          })
        }
      })
    }
  }




}
