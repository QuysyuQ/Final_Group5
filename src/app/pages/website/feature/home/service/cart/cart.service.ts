import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartReponse } from '../../model/cart/cart.model';
import { BASE_URL } from '../../../../../../constant.model';
import { CartAdd } from '../../model/cart/cartAdd.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http : HttpClient) { }

  getAllCart() : Observable<CartReponse[]>
  {
    return this.http.get<CartReponse[]>(`${BASE_URL}/Cart/get-all-cart`)
  }

  getCartUserId(userId : string) : Observable<CartReponse[]>
  {
    return this.http.get<CartReponse[]>(`${BASE_URL}/Cart/get-cart-userId/${userId}`)
  }

  addProductToCart(model : CartAdd) : Observable<void>
  {
    return this.http.post<void>(`${BASE_URL}/Cart/add-cart`,model)
  }

  updateCartUserId(userId : string, productId : string, quantity : number) : Observable<void>
  {
    return this.http.put<void>(`${BASE_URL}/Cart/update-cart-userId/${userId}/${productId}?quantity=${quantity}`, null)
  }

  deleteCartUserId(userId : string, productId : string) :Observable<void>
  {
    return this.http.delete<void>(`${BASE_URL}/Cart/delete-product-in-cart/${userId}/${productId}`)
  }

  deleteAllCartInUserId(userId : string) : Observable<void>
  {
    return this.http.delete<void>(`${BASE_URL}/Cart/delete-all-product-in-cart-userId/${userId}`)
  }
}
