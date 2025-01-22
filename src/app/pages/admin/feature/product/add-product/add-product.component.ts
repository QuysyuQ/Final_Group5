import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductAdd } from '../model/product-add.model';
import { ProductService } from '../product-service/product.service';
import { CategoryService } from '../../category/category-service/category.service';
import { CategoryReponse } from '../../category/model/category.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

  selectedFile: File | null = null;
  product : ProductAdd;
  filePath : string;
  categories$? : Observable<CategoryReponse[]>;
  validationErrors: any = {};

  constructor(  private productService : ProductService,
                private categoryService : CategoryService,
                private router : Router,
                private http: HttpClient,
  )
  {
    this.product = 
    {
      title : '',
      price : 0  ,
      discount : 0,
      thumbnail : '',
      description : '',
      quantity : 0,
      categoryId : '',
      preserve : '',
      size : [] as string[],
    },
    this.filePath =''
  }

  ngOnInit()
  {
    this.categories$ = this.categoryService.getAllCategory();
  }


  // đẩy file ảnh lên servi và tách lấy đường dẫn
  onFileChange(event : any)
  {
    const file = event.target.files[0];
    if(file)
    {
      this.selectedFile = file
    }
    if (this.selectedFile) {
      this.productService.uploadFile(this.selectedFile).subscribe({
        next : response => {
          this.filePath = JSON.stringify(response);
          this.product.thumbnail = this.filePath.split("Images")[1].split('"')[0];
          this.product.thumbnail = "https://localhost:7042/Images"+this.product.thumbnail;
          console.log(this.product.thumbnail)
        },
        error : err => {
          console.log(err)
        }
      })
    }
  }

  // xác định các size của sản phẩm để lưu thành dạng mảng
  onSizeChange(event : any) {
    const size = event.target.value
    if(event.target.checked)
    {
      this.product.size.push(size)
    }
    else
    {
      this.product.size = this.product.size.filter(s => s !== size);
    }
  }

  validateProduct(product: ProductAdd) {
    this.validationErrors = {};

    if (!product.title || product.title.trim() === '') 
    {
      this.validationErrors.title = 'Tiêu đề sản phẩm không được để trống.';
    }
    if (product.price <= 0 || ! this.checkNumber(product.price)) 
    {
      this.validationErrors.price = 'Giá sản phẩm phải lớn hơn 0 và chỉ chứa số.';
    }
    if (product.discount < 0 || ! this.checkNumber(product.discount) ) 
    {
      this.validationErrors.discount = 'Giá khuyến mại phải lớn hơn 0 và chỉ chứa số.';
    }
    if (!product.thumbnail || product.thumbnail.trim() === '') 
    {
      this.validationErrors.thumbnail = 'Ảnh sản phẩm không được để trống.';
    }
    if (!product.description || product.description.trim() === '')
   {
      this.validationErrors.description = 'Mô tả sản phẩm không được để trống.';
    }
    if (product.quantity <= 0 || ! this.checkNumber(product.quantity)) 
    {
      this.validationErrors.quantity = 'Số lượng phải lớn hơn 0 và chỉ chứa số';
    }
    if (!product.preserve || product.preserve.trim() === '') {
      this.validationErrors.preserve = 'Thông tin bảo quản không được để trống.';
    }
    if (!product.categoryId) {
      this.validationErrors.categoryId = 'Danh mục không được để trống.';
    }
    if (product.size.length === 0) {
      this.validationErrors.size = 'Bạn phải chọn ít nhất một kích thước.';
    }
    return Object.keys(this.validationErrors).length === 0;
  }

  checkNumber(value: any): boolean {

    const strValue = value.toString();
  
    const isValidNumber = /^\d+$/.test(strValue);
  
    return isValidNumber;
  }
  


  onSave() {
    if (!this.validateProduct(this.product)) {
      return;
    }
    this.product.thumbnail = this.filePath.split("7042")[1].split('"')[0]
    this.productService.addProduct(this.product).subscribe({
      next : response => {
        this.router.navigateByUrl('admin/product');
      },
      error  : err => {
        console.log(err)
      }
    });
  }

}
