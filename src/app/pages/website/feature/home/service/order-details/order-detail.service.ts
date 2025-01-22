import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetailReponse } from '../../model/order/orderDetail.model';
import { BASE_URL } from '../../../../../../constant.model';
import { OrderDetailAdd } from '../../model/order/orderDetailAdd.model';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {

  constructor(private http : HttpClient) { }

  getAllOrderDetail() : Observable<OrderDetailReponse[]>
  {
    return this.http.get<OrderDetailReponse[]>(`${BASE_URL}/OrderDetail/get-all-order-detail`)
  }

  getOrderDetailById(id : string) : Observable<OrderDetailReponse>
  {
    return this.http.get<OrderDetailReponse>(`${BASE_URL}/OrderDetail/get-order-detail-by-id/${id}`)
  }

  addOrderDetail(model : OrderDetailAdd) : Observable<void>
  {
    return this.http.post<void>(`${BASE_URL}/OrderDetail/add-order-detail`, model)
  }

  deteteOrderDetail(id : string) : Observable<void>
  {
    return this.http.delete<void>(`${BASE_URL}/OrderDetail/delete-order-detail-by-id/${id}`)
  }

  getAllOrderDetailByOrderId(orderId : string) : Observable<OrderDetailReponse[]>
  {
    return this.http.get<OrderDetailReponse[]>(`${BASE_URL}/OrderDetail/get-all-order-detail-in-orderId/${orderId}`)
  }
}
