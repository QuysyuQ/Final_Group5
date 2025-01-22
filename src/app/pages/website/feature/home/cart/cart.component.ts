import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../service/cart/cart.service';
import { ProductService } from '../../../../admin/feature/product/product-service/product.service';
import { AuthService } from '../../../../admin/feature/auth/service/auth.service';
import { User } from '../../../../admin/feature/auth/models/user.model';
import { customerResponse } from '../../../../admin/feature/customer/model/customer.model';
import { customerAdd } from '../../../../admin/feature/customer/model/customerAdd.model';
import { CustomerService } from '../../../../admin/feature/customer/service/customer.service';
import { CartReponse } from '../model/cart/cart.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductReponse } from '../../../../admin/feature/product/model/product.model';

@Component({
  selector: 'app-cart',
  imports: [FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  user? : User ;
  customers : customerResponse[];
  productsInCart : CartReponse[];
  products : ProductReponse[];
  
  constructor(
    private router : Router,
    private cartService : CartService,
    private productService : ProductService,
    private authService : AuthService,
    private customerService : CustomerService
  )
  {
    this.customers = []
    this.productsInCart = []
    this.products = []
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
            const userId = this.getUserId(this.user.email);
            if(userId)
            {
              this.cartService.getCartUserId(userId).subscribe({
                next : response => {
                  this.productsInCart = response
                  console.log(this.productsInCart)
                }
              })
            }
          }
      }
    })
    
    this.productService.getAllProduct().subscribe({
      next : response => {
        this.products = response;
      },
      error : err => {
        console.log(err)
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

  getNameProduct(productId : string) : string {
      const product = this.products.find(p => p.id === productId)
      if(product)
      {
        return product.title;
      }

      return ''
  }

  getImageProduct(id : string) : string 
  {
    const product = this.products.find(p => p.id == id)

    if(product)
    {
      return product.thumbnail
    }

    return '';
  }

  // hàm update số lượng sản phẩm trong cart, ko thể update size bắt buộc phải mua xóa sản phẩm và mua lại
  onChangeQuantity(product : CartReponse,event: any) {
    const newQuantity = event.target.value;

    if(newQuantity >= 1)
    {
      product.quantity = newQuantity;
      this.cartService.updateCartUserId(product.userId, product.productId, newQuantity).subscribe()

      this.sumProduct();
    }
  }

  // tính tổng số lượng sản phẩm trong giỏ
  sumProduct() : number 
  {
    let total = 0;
    for(let product of this.productsInCart)
    {
      total = total + Number(product.quantity)
    }
    return total
  }

  // tính tổng số tiền trong giỏ hàng
  totalPrice() : number 
  {
    let total = 0
    for (let product of this.productsInCart)
    {
      total = total + Number(product.quantity) * Number(product.price)
    }
    return total
  }

  // quay lại trang giao diện 
  backShopping() {
    this.router.navigateByUrl('')
  }

  // Mua hàng
  onOrder() {
    if(this.productsInCart.length > 0)
    {
      this.router.navigateByUrl('order')
    }
    else 
    {
      confirm("Giỏ hàng hiện trống !")
    }
  }

  // xóa sản phẩm trong giỏ hàng
  onDeleteProductInCart(product: CartReponse) {
    this.cartService.deleteCartUserId(product.userId, product.productId).subscribe()
    this.cartService.getCartUserId(product.userId).subscribe({
      next : response => {
        this.productsInCart = this.productsInCart.filter(item => item.productId !== product.productId);
        this.sumProduct();
        this.totalPrice();
      }
    })

  }
}
