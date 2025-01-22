import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderReponse } from '../../model/order/order.model';
import { BASE_URL } from '../../../../../../constant.model';
import { OrderAdd } from '../../model/order/orderAdd.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http : HttpClient) { }

  getAllOrder() : Observable<OrderReponse[]>
  {
    return this.http.get<OrderReponse[]>(`${BASE_URL}/Order/get-all-order`);
  }

  getOrderById(id : string) : Observable<OrderReponse>
  {
    return this.http.get<OrderReponse>(`${BASE_URL}/Order/get-order-by-id/${id}`);
  }

  getOrderPage(page : number, pageSize : number) : Observable<OrderReponse[]> 
  {
    return this.http.get<OrderReponse[]>(`${BASE_URL}/Order/get-order-page?page=${page}&pageSize=${pageSize}`)
  }

  addOrder(model : OrderAdd) : Observable<string> 
  {
    return this.http.post<string>(`${BASE_URL}/Order/add-order`, model);
  }

  updateOrder(id : string, model : OrderAdd) : Observable<void>
  {
    return this.http.put<void>(`${BASE_URL}/Order/update-order-by-id/${id}`, model)
  }

  deleteOrder(id : string) : Observable<void>
  {
    return this.http.delete<void>(`${BASE_URL}/Order/delete-order-by-id/${id}`)
  }
  
  getAllOrderByUserId(userId : string) : Observable<OrderReponse[]>
  {
    return this.http.get<OrderReponse[]>(`${BASE_URL}/Order/get-all-order-userId/${userId}`)
  }

  updateStatusOrder(orderId : string) : Observable<void>
  {
    return this.http.get<void>(`${BASE_URL}/Order/update-status-order/${orderId}`)
  }
}
