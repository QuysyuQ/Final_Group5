import { Component, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { CategoryService } from '../../../admin/feature/category/category-service/category.service';
import { Observable } from 'rxjs';
import { CategoryReponse } from '../../../admin/feature/category/model/category.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../admin/feature/product/product-service/product.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductReponse } from '../../../admin/feature/product/model/product.model';

@Component({
  selector: 'app-header-website',
  imports: [FormsModule, CommonModule],
  templateUrl: './header-website.component.html',
  styleUrls: ['./header-website.component.css']
})
export class HeaderWebsiteComponent {

  search: string = '';
  mousePointer: number = 0;
  categories$?: Observable<CategoryReponse[]>;
  products?: ProductReponse[];

  @ViewChild('searchResultsModal') searchResultsModal!: TemplateRef<any>;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.mousePointer = window.pageYOffset;

    if (this.mousePointer) {
      document.querySelector("header")?.classList.add("sticky");
    } else {
      document.querySelector("header")?.classList.remove("sticky");
    }
  }

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.products = [];
   }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategory();
  }

 
  onSearch() {
    if (this.search.trim() === '') {
      return;
    }

    this.productService.searchProduct(this.search).subscribe({
      next : response => {
        this.products = response;
        console.log(this.products)
      }
    })

    this.openSearchResultsModal() 
  }

  // Hàm mở modal hiển thị kết quả tìm kiếm
  openSearchResultsModal() {
    if (this.search.trim() !== '') {
      this.modalService.open(this.searchResultsModal);
    }
  }
}
