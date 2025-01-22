import { Component, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { CategoryService } from '../category-service/category.service';
import { Router } from '@angular/router';
import { CategoryReponse } from '../model/category.model';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryAdd } from '../model/category-add.model';
import { NgbModal,NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categories-list',
  imports: [FormsModule, CommonModule,NgbModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent {

  addcategory : CategoryAdd;

  updateCategory : CategoryAdd;

  categories$? : Observable<CategoryReponse[]>;

  totalPagination: number = 1; //Tổng số trang
  indexPagination: number = 1; // trang hiện tại
  categoryNull : boolean = false ; // check dữ liệu

  constructor(private categoryService : CategoryService,
              private router : Router,
              private modalService : NgbModal 
            )
  {
    this.addcategory = {
      name : '',
    };
    this.updateCategory = {
      name : ''
    }
    
  }

  ngOnInit() : void {
    // tính tổng số trang    
    this.categoryService.getAllCategory().subscribe({
      next: (categories) => {
        this.totalPagination = Math.ceil(categories.length / 5);
      },
      error: (err) => {
        console.log(err);
      }
    });
    
    //Hiển thị danh sách sản phẩm theo trang
    this.loadCategoriesForPage(this.indexPagination);
  }

  // chạy hộp thoại modal
  openModal(content: TemplateRef<any>){
    this.modalService.open(content)
    
  }

  // hàm xóa danh mục
  onDelete(id : string) {

    if(confirm('Bạn có chắc muốn xóa không ?'))
    {
      this.categoryService.deleteCategory(id).subscribe({
        next : reponse => {
          this.loadCategoriesForPage(this.indexPagination);
        },

        error : err => {
          confirm("Xóa danh mục thất bại")
        }});
    }
  }

  // Bật hộp thoại ( modal ) cho update danh mục
  onModalUpdate(content: TemplateRef<any>,id : string) {
    this.modalService.open(content)

    this.categoryService.getCategoryById(id).subscribe({
      next : response => {
        if(response) {
          this.updateCategory = response
        }
      },
      error : err => {
        confirm("Không thể lấy được thông tin danh mục !");
      }
    })
  }
  

  // hàm lưu danh mục
  onSave(modal : any) {
    if(this.addcategory.name == '')
    {
      this.categoryNull = true;
      return;
    }
    this.categoryService.addCategory(this.addcategory).subscribe({

      next : response => {
        this.loadCategoriesForPage(this.indexPagination);
        modal.close()
        this.addcategory.name ='';
      },
      error : err => {
        confirm("Không thể lưu danh mục sản phẩm !")
      }
    })
  }

  // hàm update danh mục
  onUpdate(modal : any,id : string,name : string) {

    this.updateCategory.name = name;

    if(this.updateCategory.name == '')
    {
      this.categoryNull = true;
      return;
    }

    this.categoryService.updateCategory(id,this.updateCategory).subscribe({

      next : response => {
        this.loadCategoriesForPage(this.indexPagination);
        modal.close()
      },

      error : err => {
        confirm("Sửa danh mục thất bại")
      }
    });
  }


  onCategoryChange() {
    this.categoryNull = this.addcategory.name.trim() === '';
  }


  // hàm lấy dữ liệu theo phân trang, hiện tại đặt 5 danh mục trên 1 trang
  loadCategoriesForPage(page: number): void {
    const pageSize = 5; 
    const offset = page;  
    this.categories$ = this.categoryService.getProductsByPage(offset, pageSize); 
  }

  // chuyển tới trang theo số trang nhập
  findPagination(): void {
    this.loadCategoriesForPage(this.indexPagination);
  }

  // Lấy ra trang hiện tại
  indexPaginationChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.indexPagination = Number(inputElement.value);
  }

  // chuyển tới trang đầu tiên
  firstPage(): void {
    this.indexPagination = 1;
    this.loadCategoriesForPage(this.indexPagination);
  }

  // chuyển tới trang tiếp theo
  nextPage(): void {
    if (this.indexPagination < this.totalPagination) {
      this.indexPagination++;
      this.loadCategoriesForPage(this.indexPagination);
    }
  }

  // chuyển tới trang trước 
  previousPage(): void {
    if (this.indexPagination > 1) {
      this.indexPagination--;
      this.loadCategoriesForPage(this.indexPagination);
    }
  }

  // chuyển tới trang cuối cùng
  lastPage(): void {
    this.indexPagination = this.totalPagination;
    this.loadCategoriesForPage(this.indexPagination);
  }
}
