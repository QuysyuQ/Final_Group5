import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObjectUnsubscribedErrorCtor } from 'rxjs/internal/util/ObjectUnsubscribedError';
import { ProductReponse } from '../model/product.model';
import { BASE_URL } from '../../../../../constant.model';
import { ProductAdd } from '../model/product-add.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http : HttpClient) { }

  getAllProduct() : Observable<ProductReponse[]>
  {
    return this.http.get<ProductReponse[]>(`${BASE_URL}/Product/get-all-product`)
  }

  getProductById(id : string) : Observable<ProductReponse>
  {
    return this.http.get<ProductReponse>(`${BASE_URL}/Product/get-product-by-id/${id}`)
  }

  addProduct(model : ProductAdd) : Observable<void>
  {
    return this.http.post<void>(`${BASE_URL}/Product/add-product`,model)
  }

  updateProduct(id: string,model : ProductAdd) : Observable<void>
  {
    return this.http.put<void>(`${BASE_URL}/Product/update-product-by-id/${id}`,model)
  }

  deleteProduct(id: string) : Observable<void>
  {
    return this.http.delete<void>(`${BASE_URL}/Product/delete-product-by-id/${id}`)
  }

  uploadFile(file : File) : Observable<string> 
  {
    const formData = new FormData();

    formData.append('file',file,file.name);

    return this.http.post<string>(`${BASE_URL}/FileUpload/upload`, formData)
  }

  getProductsByPage(page: number, pageSize : number): Observable<ProductReponse[]> {
    
    return this.http.get<ProductReponse[]>(`${BASE_URL}/product/get-product-page?page=${page}&pageSize=${pageSize}`);
  }

  getProductInCategory(categoryId : string, page : number , pagesize : number , sort : string): Observable<ProductReponse[]> 
  {
    if(page == 0 && pagesize == 0 && sort === '')
      {
        return this.http.get<ProductReponse[]>(`${BASE_URL}/Product/get-product-in-category?categoryId=${categoryId}`);
      }
    return this.http.get<ProductReponse[]>(`${BASE_URL}/Product/get-product-in-category?categoryId=${categoryId}&page=${page}&pageSize=${pagesize}&sort=${sort}`)
  }

  getProductInCategoryEqualPrice(categoryId : string, price : number ) : Observable<ProductReponse[]> 
  {
    
    if(price-500000 < 0)
    {
      const priceStart = 0;
      return this.http.get<ProductReponse[]>(`${BASE_URL}/Product/get-product-in-category-equal-price?categoryId=${categoryId}&priceStart=${priceStart}&priceEnd=${price+500000}&page=${1}&pageSize=${4}`)
    }
    else 
    {
      const priceStart = price - 500000;
      return this.http.get<ProductReponse[]>(`${BASE_URL}/Product/get-product-in-category-equal-price?categoryId=${categoryId}&priceStart=${priceStart}&priceEnd=${price+500000}&page=${1}&pageSize=${4}`)
    }
  }

  searchProduct(nameProduct : string) : Observable<ProductReponse[]>
  {
    return this.http.get<ProductReponse[]>(`${BASE_URL}/Product/search-product-name?name=${nameProduct}&sort=asc`)
  }

  
}
