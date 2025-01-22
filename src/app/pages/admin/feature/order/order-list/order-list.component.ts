import { Component } from '@angular/core';
import { OrderService } from '../../../../website/feature/home/service/order/order.service';
import { OrderReponse } from '../../../../website/feature/home/model/order/order.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {

  orders$? : Observable<OrderReponse[]>

  totalPagination: number = 1;
  indexPagination: number = 1;

  constructor(
    private orderService : OrderService
  ) {
    
  }

  ngOnInit()
  {
    // tính tổng số trang    
    this.orderService.getAllOrder().subscribe({
      next: orders => {
          this.totalPagination = Math.ceil(orders.length / 5);
        },
      error: (err) => {
        console.log(err);
        }
      });
        
    //Hiển thị danh sách sản phẩm theo trang
    this.loadOrderForPage(this.indexPagination);
  }

  // hàm đổi sang định dạng ngày/ tháng/ năm 
  formatDate(date: any): string {

    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const day = date.getDate().toString().padStart(2, '0'); // Lấy ngày và đảm bảo 2 chữ số
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng, nhớ cộng thêm 1 vì tháng bắt đầu từ 0
    const year = date.getFullYear(); // Lấy năm

    return `${day}/${month}/${year}`;
  }

  // Tên các trạng thái của đơn hàng
  orderStatus(status : number) : string
  {
    if(status == 0)
    {
      return "Chờ xác nhận";
    }
    else if(status == 1)
    {
      return "Đóng hàng và gửi hàng";
    }
    else if( status == 2)
    {
      return "Đang giao";
    }
    else ( status == 3)
    {
      return "Giao thành công";
    }
  }

  // hàm update trạng thái đơn hàng từ 0 -> 3
  updateStatusOrder(id : string) {
    this.orderService.updateStatusOrder(id).subscribe({
      next : response => {
        this.loadOrderForPage(this.indexPagination);
      },
      error : err => {
        console.log(err)
      }
    })
  }
    
  // xóa đơn hàng
  deleteOrder(id : string) {
    if(confirm("Bạn có chắc muốn xóa đơn hàng này không ?"))
    {
      this.orderService.deleteOrder(id).subscribe({
        next : response => {
          this.loadOrderForPage(this.indexPagination);
        },
        error : err => {
          console.log(err)
        }
      })
    }
    else
    {
      this.loadOrderForPage(this.indexPagination);
    }
  }

  loadOrderForPage(page: number): void {
    const pageSize = 5; 
    const offset = page;  
    this.orders$ = this.orderService.getOrderPage(offset, pageSize); 
  }


  findPagination(): void {
    this.loadOrderForPage(this.indexPagination);
  }

  indexPaginationChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.indexPagination = Number(inputElement.value);
  }

  firstPage(): void {
    this.indexPagination = 1;
    this.loadOrderForPage(this.indexPagination);
  }

  nextPage(): void {
    if (this.indexPagination < this.totalPagination) {
      this.indexPagination++;
      this.loadOrderForPage(this.indexPagination);
    }
  }

  previousPage(): void {
    if (this.indexPagination > 1) {
      this.indexPagination--;
      this.loadOrderForPage(this.indexPagination);
    }
  }

  lastPage(): void {
    this.indexPagination = this.totalPagination;
    this.loadOrderForPage(this.indexPagination);
  }
}
