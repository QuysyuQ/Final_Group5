import { Component, TemplateRef } from '@angular/core';
import { CustomerService } from '../../../../admin/feature/customer/service/customer.service';
import { AuthService } from '../../../../admin/feature/auth/service/auth.service';
import { User } from '../../../../admin/feature/auth/models/user.model';
import { customerResponse } from '../../../../admin/feature/customer/model/customer.model';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { customerAdd } from '../../../../admin/feature/customer/model/customerAdd.model';
import { AccountUpdateGiveUser } from '../model/account.model';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-account',
  imports: [FormsModule, CommonModule, NgbModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  user? : User ;
  customers : customerResponse[];
  account : customerResponse;
  accountUpdate : AccountUpdateGiveUser;
  newPassword : string = '';
  confirmNewPassword : string = '';
  checkPass : boolean = false;
  passwordChecked : boolean = false;
  passwordError: string = '';

  constructor(
    private customerService : CustomerService,
    private authService : AuthService,
    private router : Router,
    private modalService : NgbModal 
  ){
    this.customers = [];

    this.account = {
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

    this.accountUpdate ={
      userName : '',
      fullName :'',
      email : '',
      phoneNumber : '',
      address : '',
    };
  }

  ngOnInit(){
    this.authService.user().subscribe({
      next : response => {
        this.user = response
      }
    });
    this.user = this.authService.getUser();
  
    this.customerService.getAllUser().subscribe({
      next : response => {
        this.customers = response;
        if(this.user)
          {
            const userId = this.getUserId(this.user.email);
            if(userId)
            {
              this.customerService.getUserById(userId).subscribe({
                next : response => {
                  this.account = response
                }
              })
            }
          }
      }
    })
  }


  getUserId(email : string) : string 
  {
    for(let customer of this.customers)
    {
      if( customer.email.toLowerCase() == email.toLowerCase())
      {
        return customer.id;
      }
    }
    return '';
  }

  onSubmit() {
    this.accountUpdate = {
      userName : this.account.userName,
      fullName :this.account.fullName,
      email : this.account.email,
      phoneNumber : this.account.phoneNumber,
      address : this.account.address,
    }

    this.customerService.updateAccount(this.account.id, this.accountUpdate).subscribe({
      next : response => {
        confirm("chỉnh sửa thông tin thành công! ")
      }
    })
  }
    
  onLogOut() {
    this.authService.logOut();
    this.router.navigateByUrl('loginwebsite')
  }

  openChangePasswordModal(content: TemplateRef<any>) {
    this.passwordChecked = false;
    this.newPassword ='';
    this.confirmNewPassword='';
    this.checkPass = false;
    this.passwordError = '';

    this.modalService.open(content);
  }

  onChangePasswordSubmit(id: string) {
    this.passwordChecked = true;

    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordError = 'Mật khẩu không khớp!';
      return;
    }

    if (!this.checkPassword(this.newPassword)) {
      this.passwordError = 'Mật khẩu không đủ yêu cầu!';
      return;
    }

    const user : customerAdd = {
      userName : this.account.userName,
      fullName : this.account.fullName,
      email : this.account.email,
      password : this.newPassword,
      phoneNumber : this.account.phoneNumber,
      address : this.account.address,
      isActive : this.account.isActive,
    }

    this.customerService.updateUser(this.account.id, user).subscribe({
      next : response => {
        confirm("Thay đổi mật khẩu thành công !")
        this.modalService.dismissAll();
      },
      error : err => {
        confirm("Thay đổi mật khẩu thất bại !")
      }
    })
  }

 
  checkPassword(password : string) : boolean {
    const isLongEnough = password.length >= 8;

    const hasUpper = /[A-Z]/.test(password);

    const hasLower = /[a-z]/.test(password);

    const hasDigit = /\d/.test(password);

    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    return isLongEnough && hasUpper && hasLower && hasDigit && hasSpecial;
  }

}
