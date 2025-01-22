import { Component } from '@angular/core';
import { customerAdd } from '../model/customerAdd.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../service/customer.service';
import { Router } from '@angular/router';
import { remove as removeDiacritics } from 'diacritics';

@Component({
  selector: 'app-add-customer',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {

  checkBox : boolean ;
  user : customerAdd ;
  validationErrors: any = {};

  constructor(private customerService : CustomerService,
              private router : Router
  ) {
    this.user ={
      userName : '',
      fullName :'',
      email : '',
      password : '',
      phoneNumber : '',
      address : '',
      isActive : 0,
    };

    this.checkBox = false;
  }

  onSave() {

    // xác định trạng thái cho người dùng là 0 hoặc 1 nếu 0 thì ko thể đăng nhập
    if(this.checkBox == true)
    {
      this.user.isActive = 1;
    }
    else 
    {
      this.user.isActive = 0;
    }

    if(!this.validateCustomer(this.user))
    {
      return;
    }
    // thêm người dùng
    this.customerService.creatUser(this.user).subscribe({
      next : response => {
        this.router.navigateByUrl("admin/customer")
      },
      error : err => {
        confirm("Thêm người dùng thất bại, vui lòng kiểm tra lại email hoặc tên người dùng không thể bị trùng !");
      }
    })
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

