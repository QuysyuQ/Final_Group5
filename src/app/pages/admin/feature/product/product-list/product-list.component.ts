import { Component } from '@angular/core';
import { ProductReponse } from '../model/product.model';
import { Observable } from 'rxjs';
import { CategoryReponse } from '../../category/model/category.model';
import { ProductService } from '../product-service/product.service';
import { CategoryService } from '../../category/category-service/category.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products$? : Observable<ProductReponse[]>

  categories : CategoryReponse[];

  totalPagination: number = 1;
  indexPagination: number = 1;

  constructor(
    private productService : ProductService,
    private CategoryService : CategoryService,
    private router : Router
  ){
    this.categories = []
  }

  ngOnInit() {
    
    this.CategoryService.getAllCategory().subscribe({
      next : response => {
        this.categories = response;
      },
      error : err => {
        console.log(err)
      }
    })

    // tính tổng số trang    
    this.productService.getAllProduct().subscribe({
      next: (products) => {
        this.totalPagination = Math.ceil(products.length / 5);
      },
      error: (err) => {
        console.log(err);
      }
    });
    
    //Hiển thị danh sách sản phẩm theo trang
    this.loadProductsForPage(this.indexPagination);
  }

  // lấy tên danh mục theo id
  getCategoryName(id : string) : string
  {

    for(let category of this.categories)
    {
      if(category.id == id)
      {
        return category.name;
      }
    }
    return ''
  }

  onDelete(id : string) {
    if(confirm("Bạn có chắc muốn xóa không ?"))
    {
        this.productService.deleteProduct(id).subscribe({
          next : response => {
            this.loadProductsForPage(this.indexPagination);
          },
          error : err => {
            console.log(err)
          }
        })
    }
  }
  
  onEdit(id : string) {
    this.router.navigateByUrl(`admin/product/update/${id}`)
  }

  loadProductsForPage(page: number): void {
    const pageSize = 5; 
    const offset = page;  
    this.products$ = this.productService.getProductsByPage(offset, pageSize); 
  }


  findPagination(): void {
    this.loadProductsForPage(this.indexPagination);
  }

  indexPaginationChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.indexPagination = Number(inputElement.value);
  }

  firstPage(): void {
    this.indexPagination = 1;
    this.loadProductsForPage(this.indexPagination);
  }

  nextPage(): void {
    if (this.indexPagination < this.totalPagination) {
      this.indexPagination++;
      this.loadProductsForPage(this.indexPagination);
    }
  }

  previousPage(): void {
    if (this.indexPagination > 1) {
      this.indexPagination--;
      this.loadProductsForPage(this.indexPagination);
    }
  }

  lastPage(): void {
    this.indexPagination = this.totalPagination;
    this.loadProductsForPage(this.indexPagination);
  }
}
