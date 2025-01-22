import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductReview } from '../../model/review/productReview.model';
import { BASE_URL } from '../../../../../../constant.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http:HttpClient) { 

  }

  addProductReview(model : ProductReview) : Observable<void>
  {
    return this.http.post<void>(`${BASE_URL}/Feedback/add-feedback`, model,{ responseType: 'text' as 'json' })
  }
  getProductReviews(id:string) : Observable<ProductReview[]>
  {
    return this.http.get<ProductReview[]>(`${BASE_URL}/Feedback/get-feedback-by-product/${id}`);
  }
}
