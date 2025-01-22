import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { customerResponse } from '../model/customer.model';
import { Observable } from 'rxjs';
import { CustomerService } from '../service/customer.service';
import { Router } from '@angular/router';
import { UserRole } from '../model/user-role.model';
import { RoleReponse } from '../model/roles.model';
import { EmailSend } from '../model/mail.model';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SendEmailService } from '../service/send-email.service';

@Component({
  selector: 'app-customer-list',
  imports: [FormsModule, CommonModule, NgbModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {

  userRoles : UserRole[];
  roles : RoleReponse[];
  users$? : Observable<customerResponse[]>
  emailSend : EmailSend;


  totalPagination: number = 1;
  indexPagination: number = 1;

  constructor(private customerService : CustomerService,
              private router : Router,
              private modalService : NgbModal,
              private sendemailService : SendEmailService
  ) {
    this.userRoles = [];
    this.roles = [];
    this.emailSend = {
      recipientEmail : '',
      subject : '',
      body : ''
    }
  }

  ngOnInit() :void 
  {
    // tính tổng số trang    
    this.customerService.getAllUser().subscribe({
          next: (customers) => {
            this.totalPagination = Math.ceil(customers.length / 5);
          },
          error: (err) => {
            console.log(err);
          }
        });
    
        
    //Hiển thị danh sách sản phẩm theo trang
    this.loadCustomersForPage(this.indexPagination);

    this.customerService.getAllUserRoleS().subscribe
    ({
        next : response => {
          this.userRoles = response.map(( item , index) => ({
            STT : index + 1,
            userId : item.userId,
            roleId : item.roleId,
          }))
        },
        error : err => {
          console.log(err)
        }
    });

    this.customerService.getAllRoles().subscribe({
      next : response => {
        this.roles = response;
      },
      error : err => {
        console.log(err)
      }
    })
  }

  onDelete(id: string) {
    if(confirm("Bạn có chắc muốn xóa không ?"))
    {
      this.customerService.deleteUser(id).subscribe
      (
        {
          next : respose => {
            this.loadCustomersForPage(this.indexPagination);
          },
          error : err => {
            console.log(err)
          }
        }
      )
    }
  }

  onEdit(id: string) {
    this.router.navigateByUrl(`admin/customer/update/${id}`);
  }

  openModal(content: TemplateRef<any>, email : string){
    this.emailSend.recipientEmail = email;
    this.modalService.open(content)
    
  }

  closeModal() {
    this.modalService.dismissAll();  
  }

  sendEmail() {
    this.sendemailService.sendEmail(this.emailSend).subscribe({
      next : response => {
          alert('Email đã được gửi thành công!');
          this.closeModal();
      },
      error : err =>{
        console.log(err)
      } 
    })
  }

  // hàm tính số ngày offline
  getOfflineDay( timeOnlineLast : string) : number 
  {
    const onlineDate = new Date(timeOnlineLast);
    const timeNow = new Date();
    const getOff = Math.abs(timeNow.getTime() - onlineDate.getTime());

    return Math.floor(getOff/(24*60*60*1000))
  }

  // lấy ra quyền người dùng theo id
  getRole(id : string) : string 
  {
    for(let item of this.userRoles)
    {
      if(item.userId == id)
      {
        for(let role of this.roles)
        {
          if(role.id == item.roleId)
          {
            return role.name;
          }
        }
      }
    }
    return '';
  }

  loadCustomersForPage(page: number): void {
    const pageSize = 5; 
    const offset = page;  
    this.users$ = this.customerService.getCustomerByPage(page,pageSize); 
  }


  findPagination(): void {
    this.loadCustomersForPage(this.indexPagination);
  }

  indexPaginationChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.indexPagination = Number(inputElement.value);
  }

  firstPage(): void {
    this.indexPagination = 1;
    this.loadCustomersForPage(this.indexPagination);
  }

  nextPage(): void {
    if (this.indexPagination < this.totalPagination) {
      this.indexPagination++;
      this.loadCustomersForPage(this.indexPagination);
    }
  }

  previousPage(): void {
    if (this.indexPagination > 1) {
      this.indexPagination--;
      this.loadCustomersForPage(this.indexPagination);
    }
  }

  lastPage(): void {
    this.indexPagination = this.totalPagination;
    this.loadCustomersForPage(this.indexPagination);
  }
}
