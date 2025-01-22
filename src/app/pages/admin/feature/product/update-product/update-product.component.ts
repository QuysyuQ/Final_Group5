import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductReponse } from '../model/product.model';
import { ProductService } from '../product-service/product.service';
import { CategoryService } from '../../category/category-service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryReponse } from '../../category/model/category.model';
import { Observable } from 'rxjs';
import { ProductAdd } from '../model/product-add.model';

@Component({
  selector: 'app-update-product',
  imports: [FormsModule, CommonModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent {


  product : ProductReponse;
  categories$? : Observable<CategoryReponse[]>;
  id? : string | null;
  filePath : string;
  selectedFile: File | null = null;
  validationErrors : any = {}

  constructor(private productService : ProductService,
              private categoryService : CategoryService,
              private router : Router,
              private activatedRoute : ActivatedRoute
  )
  {
    this.product = {
        id : '',
        title : '',
        price : 0,
        discount : 0,
        thumbnail : '',
        description : '',
        createdAt : new Date(1,1,1900),
        updatedAt : new Date(1,1,1900),
        preserve : '',
        quantity : 0,
        categoryId : '',
        size : [] as string[],
    };
    this.filePath =''
    //this.categories = [];

    this.id =''
  }
  
  ngOnInit() {
      this.activatedRoute.paramMap.subscribe({
        next : params => {
          this.id = params.get('id')
          if(this.id != null){
            this.productService.getProductById(this.id).subscribe({
              next : reponse => {
                this.product = reponse;
                this.product.size = []
              }
            })
          }
        }
      });
  
      this.categories$ = this.categoryService.getAllCategory()
  }


  onFileChange(event: any) {
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
            this.product.thumbnail = "/Images"+this.product.thumbnail;
          },
          error : err => {
            console.log(err)
          }
        })
      }
  }
  
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

  onSave() {
    this.product.thumbnail = this.filePath.split("7042")[1].split('"')[0]
    var updateProduct : ProductAdd = {
      title : this.product.title,
      price : this.product.price,
      discount : this.product.discount,
      thumbnail : this.product.thumbnail,
      description : this.product.description,
      quantity : this.product.quantity,
      categoryId : this.product.categoryId,
      preserve : this.product.preserve,
      size : this.product.size,
    }

    if(!this.validateProduct(updateProduct))
    {
      return;
    }
    this.productService.updateProduct(this.product.id, updateProduct).subscribe({
      next : response => {
        this.router.navigateByUrl('admin/product')
      },
      error : err => {
        console.log(err)
      }
    })
  }
    
  onBack() {
    this.router.navigateByUrl('admin/product')
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
    // Chuyển giá trị thành chuỗi
    const strValue = value.toString();
  
    // Kiểm tra nếu chuỗi chỉ chứa các chữ số
    const isValidNumber = /^\d+$/.test(strValue);
  
    return isValidNumber;
  }
}
