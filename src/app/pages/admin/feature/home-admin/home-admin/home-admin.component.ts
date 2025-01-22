import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CustomerService } from '../../customer/service/customer.service';
import { OrderDetailService } from '../../../../website/feature/home/service/order-details/order-detail.service';
import { customerResponse } from '../../customer/model/customer.model';
import { OrderDetailReponse } from '../../../../website/feature/home/model/order/orderDetail.model';
import { OrderReponse } from '../../../../website/feature/home/model/order/order.model';
import { OrderService } from '../../../../website/feature/home/service/order/order.service';
import { GoogleChartsModule } from 'angular-google-charts';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [IonicModule, GoogleChartsModule], 
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css'],
})
export class HomeAdminComponent {
  
  customers : customerResponse[];
  countCustomer : number = 0;
  orderDetails : OrderDetailReponse[];
  revenue : number = 0;
  orders : OrderReponse[];
  countOrder : number = 0;

  constructor(private customerService : CustomerService,
              private orderDetailService : OrderDetailService,
              private orderService : OrderService
  ){
    this.customers = [];
    this.orderDetails = [];
    this.orders = []
  }

  ngOnInit( ) {
    this.customerService.getAllUser().subscribe({
      next : response => {
        this.customers = response;
        if(this.customers)
        {
          this.countCustomer = this.customers.length
        }
      }
    })
    this.orderDetailService.getAllOrderDetail().subscribe({
      next : response => {
        this.orderDetails = response;
        for(let order of this.orderDetails)
        {
          this.revenue += order.totalMoney
        }
      }
    })
    this.orderService.getAllOrder().subscribe({
      next : response => {
        this.orders = response;
        this.countOrder = this.orders.length
      }
    })
  }

   drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['task', 'house per day'],
      ['work', 11],
      ['eat', 2],
      ['commute', 2]
    ]);

    var options = {
      title : 'my daily'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart')!);

    chart.draw(data, options);
  }

}
