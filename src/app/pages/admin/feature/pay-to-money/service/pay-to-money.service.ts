import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PayToMoneyReponse } from '../model/pay-to-money.model';
import { BASE_URL } from '../../../../../constant.model';
import { Observable } from 'rxjs';
import { PayToMoneyAdd } from '../model/pay-to-moneyAdd.model';

@Injectable({
  providedIn: 'root'
})
export class PayToMoneyService {

  constructor(private http : HttpClient) { }

  getAllPayToMoney() : Observable<PayToMoneyReponse[]>
  {
    return this.http.get<PayToMoneyReponse[]>(`${BASE_URL}/PayToMoney/get-all-pay-to-money`);
  }

  getPayToMoneyById(id : string) : Observable<PayToMoneyReponse>
  {
    return this.http.get<PayToMoneyReponse>(`${BASE_URL}/PayToMoney/get-pay-to-money-by-id/${id}`);
  }

  getPayToMoneyPage(page : number, pageSize : number) : Observable<PayToMoneyReponse[]> 
  {
    return this.http.get<PayToMoneyReponse[]>(`${BASE_URL}/PayToMoney/get-pay-to-money-page?page=${page}&pageSize=${pageSize}`)
  }

  addPayToMoney(model : PayToMoneyAdd) : Observable<void> 
  {
    return this.http.post<void>(`${BASE_URL}/PayToMoney/add-pay-to-money`, model);
  }

  updatePayToMoney(id : string, model : PayToMoneyAdd) : Observable<void>
  {
    return this.http.put<void>(`${BASE_URL}/PayToMoney/update-pay-to-money-by-id/${id}`, model)
  }

  deletePayToMoney(id : string) : Observable<void>
  {
    return this.http.delete<void>(`${BASE_URL}/delete-pay-to-money-by-id/${id}`)
  }

}
