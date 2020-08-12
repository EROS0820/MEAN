import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpService} from "../http.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PreOrderService {

  constructor(
    private http: HttpClient,
    private httpService:HttpService
  ) { }

  getPreOrder( userid, status, column) {
    return this.http.post(this.httpService.initUrl('/pre-order/getPreOrder'), {userid: userid, status: status, column: column}, {observe: 'response'})
      .pipe(map(res => {return res;}))
  }

  deletePreOrder(order_id) {
    let params = new HttpParams().set('order_id', order_id);
    return this.http.get(this.httpService.initUrl('/pre-order/deletePreOrder'), {params})
      .pipe(map(res => {return res;}));
  }

  releasePreOrder(order_id) {
    return this.http.post(this.httpService.initUrl('/pre-order/releasePreOrder'), {order_id: order_id})
  }
  updateTreeStatus(consumer_id, column, value) {
    return this.http.put(this.httpService.initUrl('/pre-order/updateTreeStatus'), {consumer_id: consumer_id, column: column, value: value} )
      .pipe(map(res => { return res;}));
  }
  removeTree(user_id) {
    console.log("user_id+++++++: ", user_id)
    return this.http.put(this.httpService.initUrl('/pre-order/removeTree'), {user_id: user_id} )
      .pipe(map(res => { return res;}));
  }
  updateLCBalance(consumer_id, total_amount) {
    return this.http.put(this.httpService.initUrl('/pre-order/updateLCBalance'), {consumer_id: consumer_id, total_amount: total_amount})
      .pipe(map(res => { return res;}));
  }

  placeOrder(consumer_id, seller_id, code) {
    return this.http.put(this.httpService.initUrl('/pre-order/placeOrder'), {consumer_id: consumer_id, seller_id: seller_id, code: code})
      .pipe(map(res => {return res;}));
  }
}
