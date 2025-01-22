import { Component } from '@angular/core';
import { ProductService } from '../../../../admin/feature/product/product-service/product.service';
import { Observable } from 'rxjs';
import { ProductReponse } from '../../../../admin/feature/product/model/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryReponse } from '../../../../admin/feature/category/model/category.model';
import { CategoryService } from '../../../../admin/feature/category/category-service/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-website-product-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './website-product-list.component.html',
  styleUrl: './website-product-list.component.css'
})
export class WebsiteProductListComponent {

  ulStates: { [key: number]: boolean } = { 0: false, 1: false, 2: false, 3: false }

  products?: ProductReponse[];
  categoryId?: string | null;
  category: CategoryReponse;
  categories?: CategoryReponse[];

  totalPagination: number = 1;
  indexPagination: number = 1;
  sort : string  = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    this.products = []
    this.categoryId = '';
    this.category = {
      id : '',
      name : ''
    };
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe({
      next: params => {
        this.categoryId = params.get('categoryId');
        if (this.categoryId != null) {
          this.productService.getProductInCategory(this.categoryId, 0, 0, "").subscribe({
            next: (products) => {
              this.totalPagination = Math.ceil(products.length / 5);
            },
            error: (err) => {
              console.log(err);
            }
          });

          this.loadProductsForPage(this.categoryId, this.indexPagination, this.sort);
          
          this.categoryService.getCategoryById(this.categoryId).subscribe({
            next : response => {
              this.category = response
            }
          })
        }
      }
    });
  }
  
  onMouseEnter() {
    //this.isActive = true
  }
  onMouseLeave() {
    //this.isActive = false;
  }
  onClick(event: MouseEvent) {
    event.preventDefault();
    //this.isActive=true
  }

  toggleBlock(index: number, event: MouseEvent) {
    this.ulStates[index] = !this.ulStates[index];
    event.preventDefault()
  }

  loadProductsForPage(categoryId: string, page: number, sort : string): void {
    const pageSize = 3;
    this.productService.getProductInCategory(categoryId, page, pageSize, sort).subscribe({
      next: response => {
        this.products = response;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  findPagination(): void {
    this.loadProductsForPage(this.categoryId!, this.indexPagination, this.sort);
  }

  indexPaginationChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.indexPagination = Number(inputElement.value);
  }

  firstPage(): void {
    this.indexPagination = 1;
    this.loadProductsForPage(this.categoryId!, this.indexPagination, this.sort);
  }

  nextPage(): void {
    if (this.indexPagination < this.totalPagination) {
      this.indexPagination++;
      this.loadProductsForPage(this.categoryId!, this.indexPagination, this.sort);
    }
  }

  previousPage(): void {
    if (this.indexPagination > 1) {
      this.indexPagination--;
      this.loadProductsForPage(this.categoryId!, this.indexPagination, this.sort);
    }
  }

  lastPage(): void {
    this.indexPagination = this.totalPagination;
    this.loadProductsForPage(this.categoryId!, this.indexPagination, this.sort);
  }

  // sắp xếp sản phẩm theo giá sản phẩm, nút bộ lọc cần phải phân cấp danh mục mới sài đc
  onSortChange(sort: Event) {
    const selectElement = sort.target as HTMLSelectElement;
    this.sort = selectElement.value;

    this.loadProductsForPage(this.categoryId!, this.indexPagination, this.sort)
  }
}
