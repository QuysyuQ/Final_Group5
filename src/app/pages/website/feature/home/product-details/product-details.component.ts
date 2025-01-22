import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../admin/feature/product/product-service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../admin/feature/category/category-service/category.service';
import { ProductReponse } from '../../../../admin/feature/product/model/product.model';
import { CategoryReponse } from '../../../../admin/feature/category/model/category.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../admin/feature/auth/service/auth.service';
import { User } from '../../../../admin/feature/auth/models/user.model';
import { CartAdd } from '../model/cart/cartAdd.model';
import { CustomerService } from '../../../../admin/feature/customer/service/customer.service';
import { customerResponse } from '../../../../admin/feature/customer/model/customer.model';
import { CartService } from '../service/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../service/review/review.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductReview } from '../model/review/productReview.model';


@Component({
  selector: 'app-product-details',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  isMenu: boolean = false;
  isPreserve: boolean = false; // bảo quản
  isDetailVisible: boolean = false; // chi tiết

  toggleDetail(section: string) {
    if (section == 'chitiet') {
      this.isDetailVisible = !this.isDetailVisible;
      this.isPreserve = false;
      console.log(this.isDetailVisible, this.isPreserve);
    } else if (section == 'baoquan') {
      this.isPreserve = !this.isPreserve;
      this.isDetailVisible = false;
      console.log(this.isDetailVisible, this.isPreserve);
    }
  }

  onMenu() {
    this.isMenu = !this.isMenu;
  }

  reviews: ProductReview[] = [];
  vote: number = 0;
  comment: string = '';
  review: ProductReview = {
    productId: '',
    vote: 0,
    comment: '',
    createdAt: new Date(),
  };
  
  @ViewChild('reviewModal') reviewModal!: TemplateRef<any>;

  openReviewModal() {
    this.modalService.open(this.reviewModal);
  }

  rateProduct(star: number) {
    this.review.vote = star;
  }

  submitReview(modal: any) {
    if (this.review.vote > 0 && this.review.comment.trim()) {
      console.log('Submitting review:', { vote: this.review.vote, comment: this.review.comment });
      const newReview: ProductReview = {
        productId: this.product.id,
        vote: this.review.vote,
        comment: this.review.comment,
        createdAt: new Date(),
      };
  
      this.reviewService.addProductReview(newReview).subscribe({
        next: (response) => {
          try {
            const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;
            console.log('Review submitted response:', jsonResponse);
          } catch (e) {
            console.error('Error parsing response:', e);
          }
          this.snackBar.open('Đánh giá của bạn đã được gửi!', 'Đóng', { duration: 3000 });
          this.reviews.push(newReview);
          this.review.comment = '';
          this.review.vote = 0;
          modal.close();
        },
        error: (err) => {
          console.error('Error submitting review:', err);
          if (err.error) {
            console.error('Error details:', err.error);
          }
          this.snackBar.open('Đã có lỗi xảy ra, vui lòng thử lại!', 'Đóng', { duration: 3000 });
        }
      });
      
      
    }
  }
  
  
  // code xử lý lấy dữ liệu 
  productId?: string | null;
  categoryId?: string | null;
  product: ProductReponse;
  category: CategoryReponse;
  productsOther?: ProductReponse[];
  user? : User ;
  cart : CartAdd;
  customers : customerResponse[];

  constructor(private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private authService : AuthService,
    private customerService : CustomerService,
    private cartService : CartService,
    private snackBar: MatSnackBar,
    private reviewService: ReviewService,
    private modalService: NgbModal
  ) 
  {
    this.productId = '';
    this.categoryId = '';

    this.product = {
      id: '',
      title: '',
      price: 0,
      discount: 0,
      thumbnail: '',
      description: '',
      preserve: '',
      createdAt: new Date(1, 1, 1900),
      updatedAt: new Date(1, 1, 1900),
      quantity: 0,
      categoryId: '',
      size: []
    };

    this.category = {
      id: '',
      name: ''
    };

    this.cart = {
      userId : '',
      productId : '',
      quantity : 1,
      price : 0,
      size :''
    }
    

    this.customers = []
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe({
      next: params => {
        this.productId = params.get('productId');
        this.categoryId = params.get('categoryId');

        if (this.productId) {
          this.productService.getProductById(this.productId).subscribe({
            next: response => {
              this.product = response;
              console.log(this.product);
              
              if (this.product.categoryId && this.product.price) {

                this.productService.getProductInCategoryEqualPrice(this.product.categoryId, this.product.price).subscribe({
                  next: response => {
                    this.productsOther = response;
                    
                    
                    if(this.productsOther.length < 4)
                    {
                      this.productService.getProductsByPage(1,4).subscribe({
                        next : response => {
                          this.productsOther = response;

                        }
                      })
                    }
                  },
                  error: err => {
                    console.error( err);
                  }
                });
              }
            },
            error: err => {
              console.error(err);
            }
          });
        }

        if (this.categoryId) {
          this.categoryService.getCategoryById(this.categoryId).subscribe({
            next: response => {
              this.category = response;
              console.log(this.category);
            },
            error: err => {
              console.error(err);
            }
          });
        }
      },
      error: err => {
        console.error(err);
      }
    });

    this.customerService.getAllUser().subscribe({
      next : response => {
        this.customers = response
      }
    })
    if (this.productId) {
      this.reviewService.getProductReviews(this.productId).subscribe({
        next: (response) => {
          this.reviews = response.map(review => ({
            ...review,
            vote: Math.min(Math.max(review.vote, 1), 5), // Giới hạn vote từ 1 đến 5
            createdAt: new Date(review.createdAt), // Đảm bảo ngày là Date object
          }));
        },
        error: (err) => {
          console.error('Error loading reviews', err);
        },
      });
    }
    
  }
 

  // lấy ra size mà người dùng đặt
  selectSize(size: string) {
    this.cart.size = size
  }

  // Hàm thay đổi số lượng sản phẩm muốn mua
  onQuantityChange(quantity: number) {
    this.cart.quantity = quantity
  }

  // lấy ra thông tin email của tài khoản đang đăng nhập
  getUserId(email : string) : string 
  {
    for(let customer of this.customers)
    {
      if( customer.email.toLowerCase() == email.toLowerCase())
      {
        return customer.id;
      }
    }
    return '';
    
  }
  // thêm sản phẩm vào trong giỏ hàng
  onAddProductToCart() {
    if(this.cart.size!= '')
    {
      const email = localStorage.getItem("user-email")
      if(email==null)
      {
        if(confirm("Bạn cần đăng nhập để có thể thêm sản phẩm vào giỏ hàng !"))
        {
            this.router.navigateByUrl('loginwebsite');
        }
      }
      if(this.cart.quantity < this.product.quantity)
      {
        this.customerService.getCustomerByEmail(email!).subscribe({
          next : response => {
            let customer = response;
            if(customer != null) {
              this.cart.userId = customer.id;
              this.cart.productId = this.product.id;
              this.cart.price = this.product.discount;
              
              console.log(this.cart)

              this.cartService.addProductToCart(this.cart).subscribe({
                next : response => {
                  confirm("Thêm sản phẩm thành công vào trong giỏ hàng !")
                },
                error : err => {
                  confirm("Sản phẩm đã có trong giỏ hàng")
                }
              })
            }
            console.log(this.cart)
            }
          },
        )}
      else
      {
        confirm("Số lượng sản phẩm vượt quá số lượng hàng còn lại của shop !");
      }
    

    }  
    else {
      confirm("Vui lòng chọn size !");
    }

  }


}
