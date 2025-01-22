import { Component } from '@angular/core';
import { CustomerService } from '../../../../admin/feature/customer/service/customer.service';
import { AuthService } from '../../../../admin/feature/auth/service/auth.service';
import { User } from '../../../../admin/feature/auth/models/user.model';
import { customerResponse } from '../../../../admin/feature/customer/model/customer.model';
import { OrderReponse } from '../model/order/order.model';
import { OrderService } from '../service/order/order.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderDetailService } from '../service/order-details/order-detail.service';
import { OrderDetailReponse } from '../model/order/orderDetail.model';
import { Router } from '@angular/router';
import { ProductService } from '../../../../admin/feature/product/product-service/product.service';
import { ProductReponse } from '../../../../admin/feature/product/model/product.model';

@Component({
  selector: 'app-order-history',
  imports: [FormsModule, CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {


  user? : User;
  customers : customerResponse[];
  orders : OrderReponse[];
  clickOrderDetail : string | null = null;
  orderDetails : OrderDetailReponse[];
  products : ProductReponse[] = []
  userId : string = ''

  constructor(    
    private customerService : CustomerService,
    private authService : AuthService,
    private orderService : OrderService,
    private orderDetailService : OrderDetailService,
    private router : Router,
    private productService : ProductService
  )
  {
    this.customers = [];
    this.orders = [];
    this.orderDetails = [];
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
            this.userId = this.getUserId(this.user.email);
            if(this.userId)
            {
              this.orderService.getAllOrderByUserId(this.userId).subscribe({
                next : response => {
                  this.orders = response
                }
              })
            }
          }
      }
    })

    this.productService.getAllProduct().subscribe({
      next : response => {
        this.products = response
      }
    })
  }

  getNameProduct(id : string) : string {
    return this.products.find(p => p.id == id)!.title
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

  // chuyển định dạng ngày tháng từ server thành ngày / tháng / năm
  formatDate(date: any): string {

    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const day = date.getDate().toString().padStart(2, '0'); // Lấy ngày và đảm bảo 2 chữ số
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng, nhớ cộng thêm 1 vì tháng bắt đầu từ 0
    const year = date.getFullYear(); // Lấy năm

    return `${day}/${month}/${year}`;
  }

  orderStatus(status : number) : string
  {
    if(status == 0)
    {
      return "Chờ người bán xác nhận";
    }
    else if(status == 1)
    {
      return "Đóng hàng và gửi hàng";
    }
    else if( status == 2)
    {
      return "Đang giao";
    }
    else ( status == 3)
    {
      return "Giao thành công";
    }
  }

  // Hàm để lick vào id đơn hàng thì hiện ra thông tin chi tiết sản phẩm đã mua trong đơn hàng đó
  onOrderDetail(orderId: string) {
    this.orderDetails = []
    if(this.clickOrderDetail === orderId)
    {
      this.clickOrderDetail = null;
    }
    else 
    {
      this.clickOrderDetail = orderId
    }
    
    this.orderDetailService.getAllOrderDetailByOrderId(orderId).subscribe({
      next : response => {
        this.orderDetails = response;
        console.log(this.orderDetails)
      },
      error : err => {
        console.log(err)
      }
    })
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigateByUrl('loginwebsite')
  }

  onCancelOrder(orderId: string) {
    if(confirm("Bạn có chắc muốn hủy đơn hàng không ? "))
    {
      this.orderDetailService.getAllOrderDetailByOrderId(orderId).subscribe({
        next : response => {
          let orderDetails = response;
          for(let orderDetail of orderDetails)
          {
            this.orderDetailService.deteteOrderDetail(orderDetail.id).subscribe();
          }
        }
      })
      this.orderService.deleteOrder(orderId).subscribe({})
    }

    this.orderService.getAllOrderByUserId(this.userId).subscribe({
      next : response => {
        this.orders = response
      }
    })
  }
}
