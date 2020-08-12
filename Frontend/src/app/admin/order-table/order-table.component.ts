import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.css']
})
export class OrderTableComponent implements OnInit {

  constructor(private route: ActivatedRoute, private adminservice: AdminService) { }
  display
  orders = []
  ngOnInit() {
  	this.route
      .data
      .subscribe(v => { 
        this.display = v.display;
        
        this.orders = this.adminservice.orders.filter(order => {
          if(v.display == 'btc-to-lc-success') {  
            return order.type == 'btol' && order.status == 'successful';
          }
          if(v.display == 'lc-to-btc-success') {
            return order.type == 'ltob' && order.status == 'successful';
          }
          if(v.display == 'cancelled-conversion') {
            return order.status == 'cancel';
          }
          if(v.display == 'open-orders') {
            return order.status == 'open';
          }
          return true;
        })
      } );
  }

}
