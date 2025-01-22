import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { OrderAdd } from '../model/order/orderAdd.model';
import { OrderService } from '../service/order/order.service';
import { OrderDetailAdd } from '../model/order/orderDetailAdd.model';
import { OrderDetailService } from '../service/order-details/order-detail.service';
import { CartReponse } from '../model/cart/cart.model';
import { customerResponse } from '../../../../admin/feature/customer/model/customer.model';
import { CartService } from '../service/cart/cart.service';
import { FormsModule } from '@angular/forms';
import { ProductAdd } from '../../../../admin/feature/product/model/product-add.model';
import { ProductService } from '../../../../admin/feature/product/product-service/product.service';


@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

    //vnp_ResponseCode=00&vnp_TransactionStatus=00 // thành công

    //vnp_ResponseCode=24&vnp_TransactionStatus=02 // hủy giao dịch

    order : OrderAdd ;
    dataLocalJson : any;
    orderAddId : string = '';
    productsInCart : CartReponse[];
    isPaymentSuccessful : boolean = false

  constructor(private  activateRouter : ActivatedRoute,
              private location: Location,
              private orderService : OrderService,
              private orderDetailService : OrderDetailService,
              private cartService : CartService,
              private productService : ProductService
   )
  {
    this.order = {
      fullName : '',
      email : '',
      phoneNumber : '',
      address : '',
      note : '',
      totalMoney : 0,
      userId : '',
      payToMoneyId : ''
    };
    
    this.productsInCart = []

  }

  ngOnInit(): void {
    
    const currentUrl = this.location.path();
  
    if (currentUrl.includes('vnp_ResponseCode=00') && currentUrl.includes('vnp_TransactionStatus=00') ) {
      
      this.isPaymentSuccessful = true;


      const storedData = localStorage.getItem('orderData');

      if (storedData) {
        this.dataLocalJson = JSON.parse(storedData);

      
        this.order = {
          fullName: this.dataLocalJson.fullName || '',  
          email: this.dataLocalJson.email || '',  
          phoneNumber: this.dataLocalJson.phoneNumber || '', 
          address: this.dataLocalJson.address || '', 
          note: this.dataLocalJson.note || '',  
          totalMoney: this.dataLocalJson.totalMoney || 0,  
          userId: this.dataLocalJson.userId || '',  
          payToMoneyId: this.dataLocalJson.payToMoneyId || ''
        };
        
        if(this.order)
        {
          console.log(this.order)
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
  
                this.orderDetailService.addOrderDetail(orderDetail).subscribe()

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
              
              this.cartService.deleteAllCartInUserId(this.order.userId).subscribe();
            },
            error : err => {
              console.log(err.error.errors)
            }
          })
        }
    }

    } else {
      this.isPaymentSuccessful = false;
    }
  }



}
