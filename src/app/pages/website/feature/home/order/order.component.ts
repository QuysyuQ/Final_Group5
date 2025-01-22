import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../service/cart/cart.service';
import { AuthService } from '../../../../admin/feature/auth/service/auth.service';
import { CustomerService } from '../../../../admin/feature/customer/service/customer.service';
import { ProductService } from '../../../../admin/feature/product/product-service/product.service';
import { User } from '../../../../admin/feature/auth/models/user.model';
import { customerResponse } from '../../../../admin/feature/customer/model/customer.model';
import { OrderAdd } from '../model/order/orderAdd.model';
import { PayToMoneyReponse } from '../../../../admin/feature/pay-to-money/model/pay-to-money.model';
import { PayToMoneyService } from '../../../../admin/feature/pay-to-money/service/pay-to-money.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartReponse } from '../model/cart/cart.model';
import { ProductReponse } from '../../../../admin/feature/product/model/product.model';
import { OrderService } from '../service/order/order.service';
import { OrderDetailService } from '../service/order-details/order-detail.service';
import { OrderReponse } from '../model/order/order.model';
import { OrderDetailAdd } from '../model/order/orderDetailAdd.model';
import { VnpayService } from '../service/vnpay/vnpay.service';
import { ProductAdd } from '../../../../admin/feature/product/model/product-add.model';

@Component({
  selector: 'app-order',
  imports: [FormsModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {


  user? : User ;
  customers : customerResponse[];
  order : OrderAdd;
  payToMoneys$? : Observable<PayToMoneyReponse[]>;
  productsInCart : CartReponse[];
  products : ProductReponse[];
  customer : customerResponse | null;
  orderAddId : string = '';
 
  // biến ghép địa chỉ
  city : string = '';
  district : string = '';
  address : string = '';

  constructor(
    private router : Router,
    private cartService : CartService,
    private productService : ProductService,
    private authService : AuthService,
    private customerService : CustomerService,
    private payToMoneyService : PayToMoneyService,
    private orderService : OrderService,
    private orderDetailService : OrderDetailService,
    private vnpayService : VnpayService
  ) 
  {
    this.customer ={
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
    this.order = {
      fullName : '',
      email : '',
      phoneNumber : '',
      address : '',
      note : '',
      totalMoney : 0,
      userId : '',
      payToMoneyId : ''
    }

    this.products = [];
    this.productsInCart = [];
    this.customers = [];
  }

  ngOnInit() {
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
            //const userId = this.getUser(this.user.email);
            this.customer = this.getUser(this.user.email)
            if(this.customer!.id)
            {
              this.cartService.getCartUserId(this.customer!.id).subscribe({
                next : response => {
                  this.productsInCart = response
                }
              })
            }
          }
      }
    })
    
    this.productService.getAllProduct().subscribe({
      next : response => {
        this.products = response;
      }
    })

    this.payToMoneys$ = this.payToMoneyService.getAllPayToMoney()
    
  }

  // lấy ra thông tin người dùng thông qua email
  getUser(email : string) : customerResponse | null 
  {
    for(let customer of this.customers)
    {
      if( customer.email.toLowerCase() == email.toLowerCase())
      {
        return customer;
      }
    }
    return null;
  }

  // lấy ra sản phẩm theo id sản phẩm
  getNameProduct(id : string) : string {
    for(let product of this.products)
    {
      if(product.id == id)
      {
        return product.title
      }
    }

    return ''
  }

  // tổng giá trị đơn hàng
  totalPrice() : number
  {
    let total = 0;
    let MoneyShip = 0;
    if(this.productsInCart.length > 0)
    {
      MoneyShip = 38000;
    }
    for(let product of this.productsInCart)
    {
      total = total + Number(product.price) * Number(product.quantity)
    }
    return total + MoneyShip;
  }

  // đặt hàng : thêm thông tin đơn hàng và chi tiết đơn hàng vào trong csdl
  paymentConfirmation() {
    if(this.totalPrice() == 0)
    {
      confirm("Bạn không có sản phẩm nào trong giỏ hàng !");
      return;
    }
    if(this.order.fullName !=''&& this.order.phoneNumber != '' && this.order.payToMoneyId != '' && 
      this.city !='' && this.district != '' && this.address != '' && this.checkPhoneNumber(this.order.phoneNumber))
      {
        if(this.order.payToMoneyId == "a42447c3-8518-406b-2687-08dd36944f42")
        {
            this.onPayment();
        }
        else
          {
            this.order.address = this.city+" , " + this.district + " , " + this.address;
            this.order.email = this.user!.email;
            this.order.userId  = this.customer!.id;
            this.order.totalMoney = this.totalPrice();
     
            this.orderService.addOrder(this.order).subscribe({
              next : response => {
                this.orderAddId = response;
    
                for(let product of this.productsInCart)
                {
                  const orderDetail : OrderDetailAdd = {
                    price : product.price,
                    num : product.quantity,
                    size : product.size,
                    totalMoney : product.price * product.quantity,
                    orderId :this.orderAddId,
                    productId : product.productId
                  }
    
                  this.orderDetailService.addOrderDetail(orderDetail).subscribe();

                  //Update số lượng sản phẩm khi đặt hàng
                  this.productService.getProductById(orderDetail.productId).subscribe({
                    next : response => {
                      const product : ProductAdd = {
                        title : response.title,
                        price : response.price ,
                        discount : response.discount,
                        thumbnail : response.thumbnail,
                        description : response.description,
                        quantity : response.quantity - orderDetail.num,
                        categoryId : response.categoryId,
                        preserve : response.preserve,
                        size : response.size,
                      }

                      this.productService.updateProduct(orderDetail.productId, product).subscribe()
                    }
                  })
                }
                
                this.cartService.deleteAllCartInUserId(this.customer!.id).subscribe({
                  next : response => {
                    confirm("Đặt hàng thành công! Cảm ơn bạn đã mua hàng")
                    this.router.navigateByUrl('order-history')
                  },
                  error : err => {
                    console.log(err)
                  }
                })
              },
              error : err => {
                console.log(err.error.errors)
              }
            })
        }
      }
    else {
      confirm("Thông tin lỗi, vui lòng kiểm tra lại ! ");
      return;
    }
  }

  checkPhoneNumber(phone: string): boolean {
    
    const isValidPhoneNumber = /^\d+$/.test(phone);

    return isValidPhoneNumber;
  }

  // thanh toán vnpay
  onPayment() {
    const orderInfo =  {
      amount : this.totalPrice(),
      orderDescription : "thanh toán sản phẩm",
      txnRef : "clothing",
    };

    const paymentUrl = this.vnpayService.generatePaymentUrl(orderInfo);
    
    
    if (paymentUrl) {
      const orderData = {
        fullName : this.order.fullName,
        email : this.user!.email,
        phoneNumber : this.order.phoneNumber,
        address : this.city+" , " + this.district + " , " + this.address,
        note : this.order.note,
        totalMoney : this.totalPrice(),
        payToMoneyId : this.order.payToMoneyId,
        userId  : this.customer!.id,
      };
      localStorage.setItem('orderData', JSON.stringify(orderData));
    

      window.location.href = paymentUrl;
    } else {
      console.error('Error generating payment URL.');
    }

  }
}
