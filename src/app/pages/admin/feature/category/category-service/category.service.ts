import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryAdd } from '../model/category-add.model';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../../constant.model';
import { CategoryReponse } from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http : HttpClient) { }

  addCategory(model : CategoryAdd) : Observable<void>
  {
    return this.http.post<void>(`${BASE_URL}/Category/add-category`,model)
  }

  getAllCategory() : Observable<CategoryReponse[]>
  {
    return this.http.get<CategoryReponse[]>(`${BASE_URL}/Category/get-all-categories`)
  }

  getCategoryById(id : string) : Observable<CategoryReponse>
  {
    return this.http.get<CategoryReponse>(`${BASE_URL}/Category/get-category-by-id/${id}`)
  }

  updateCategory(id : string, model : CategoryAdd) : Observable<void>
  {
    return this.http.put<void>(`${BASE_URL}/Category/update-category-by-id/${id}`, model)
  }

  deleteCategory(id : string) 
  {
    return this.http.delete<void>(`${BASE_URL}/Category/delete-category-by-id/${id}`)
  }

  getProductsByPage(page: number, pageSize : number): Observable<CategoryReponse[]> {
    
    return this.http.get<CategoryReponse[]>(`${BASE_URL}/category/get-categories-page?page=${page}&pageSize=${pageSize}`);
  }
}
