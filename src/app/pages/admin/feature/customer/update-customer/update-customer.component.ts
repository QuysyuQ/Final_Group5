import { Component } from '@angular/core';
import { customerResponse } from '../model/customer.model';
import { CustomerService } from '../service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { customerAdd } from '../model/customerAdd.model';
import { isReactive } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-update-customer',
  imports: [FormsModule,CommonModule],
  templateUrl: './update-customer.component.html',
  styleUrl: './update-customer.component.css'
})
export class UpdateCustomerComponent {

  getUserId : customerResponse;
  id? : string | null;
  checkBox = false;
  validationErrors : any = {}

  constructor(private customerService : CustomerService,
              private router : Router,
              private activatedRoute : ActivatedRoute
  ) {
    this.getUserId = 
    {
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
    };


    this.id = ''
  }

  ngOnInit()
  {
    this.activatedRoute.paramMap.subscribe({
      next : params => {
        this.id = params.get('id')
        if(this.id != null){
          this.customerService.getUserById(this.id).subscribe({
            next : reponse => {
              this.getUserId = reponse;
            }
          })
        }
      }
    });
  }

  onSave() {
    var userUpdate : customerAdd = 
    {
      fullName : this.getUserId.fullName,
      userName : this.getUserId.userName,
      email : this.getUserId.email,
      password : this.getUserId.passwordHash,
      phoneNumber : this.getUserId.phoneNumber,
      address : this.getUserId.address,
      isActive : 0
    }
    if(this.checkBox==true)
    {
      userUpdate.isActive = 1
    }
    else 
    {
      userUpdate.isActive = 0
    }
    
    if(!this.validateCustomer(userUpdate))
    {
      return;
    }

    this.customerService.updateUser(this.getUserId.id ,userUpdate).subscribe
    ({
        next : response => {
          this.router.navigateByUrl('admin/customer')
        },
        error : err => {
          console.log(err)
        }
    })
  }

  onBack() {
    this.router.navigateByUrl('admin/customer')
  }

  validateCustomer(customer: customerAdd) {
    this.validationErrors = {};

    if (!customer.fullName || customer.fullName.trim() === '') 
    {
      this.validationErrors.fullName = 'Tên khách hàng không được để trống.';
    }
    if (!customer.userName || customer.userName.trim() === '') 
    {
      this.validationErrors.userName = 'Tên tài người dùng không được để trống.';
    }
    if (!this.checkPhoneNumber(customer.phoneNumber)) 
    {
      this.validationErrors.phoneNumber = 'Số điện thoại chỉ chứa số.';
    }
    if (!customer.email.includes("@") ) 
    {
      this.validationErrors.email = 'Email phải chứa ký tự @ ';
    }
    if (!this.checkPassword(customer.password)) 
    {
      this.validationErrors.password = 'Mật khẩu phải có độ dài tối thiểu 8 ký tự và phải đủ mạnh';
    }
    if (!customer.address || customer.address.trim() === '') 
    {
      this.validationErrors.address = 'Địa chỉ không được để trống.';
    }
    
    return Object.keys(this.validationErrors).length === 0;
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
