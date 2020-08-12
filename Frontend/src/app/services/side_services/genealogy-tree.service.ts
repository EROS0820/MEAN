import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpService} from "../http.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GenealogyTreeService {
  constructor(private http: HttpClient,
              private httpService:HttpService) {
  }

  getUsers() {
    return this.http.get(this.httpService.initUrl('/genealogy-tree/getUsers'), {responseType: "json"})
      .pipe(map(res => {return res;}))
  }
  createOrder(ordered_products) {
    return this.http.post(this.httpService.initUrl('/genealogy-tree/createOrder'), {products: JSON.stringify(ordered_products)})
      .pipe(res => {return res})
  }
  initializeTree(tree) {
    console.log('here in service', tree);
    return this.http.post(this.httpService.initUrl('/genealogy-tree/initTree'), {tree: tree})
      .pipe(map(res=> {return res;}))
  }
  getUsersFromTree() {
    return this.http.get(this.httpService.initUrl('/genealogy-tree/getUsersFromTree'), {})
      .pipe(map(res => {return res;}));
  }
  getUsersFromTreeByStarter(starter_id: any) {
    let params = new HttpParams().set('starter_id', starter_id);
    return this.http.get(this.httpService.initUrl('/genealogy-tree/getUsersFromTreeByStarter'), {params})
      .pipe(map(res => {
        return res;}));
  }
  createTree(user_to_tree) {
    return this.http.post(this.httpService.initUrl('/genealogy-tree/createTree'), {data: user_to_tree})
      .pipe(map(res=> {return res;}))
  }
  updateLCBalance(buyerId, payResult) {
    console.log("http, byerId, payReuslt: ", buyerId, payResult)
    return this.http.put(this.httpService.initUrl('/genealogy-tree/updateLCBalance'), {userid: buyerId, lc: payResult})
      .pipe(map(res => {return res;}));
  }
  getPrevTotalIta(consumer_id) {
    let params = new HttpParams().set('user_id', consumer_id);
    return this.http.get(this.httpService.initUrl('/genealogy-tree/getPrevTotalIta'), {params})
      .pipe(map(res => {return res;}));
  }
  getTotalEarningBalance(userid) {
    let params = new HttpParams().set('user_id', userid);
    return this.http.get(this.httpService.initUrl('/genealogy-tree/getTotalEarningBalance'), {params})
      .pipe(map(res => {return res;}));
  }
  updateTotalEarningBalance(userid, current_balance) {
    return this.http.put(this.httpService.initUrl('/genealogy-tree/updateTotalEarningBalance'), {user_id: userid, current_balance: current_balance})
      .pipe(map(res => {return res;}));
  }
  updateCurrentBalance(userid, current_balance) {
    return this.http.put(this.httpService.initUrl('/genealogy-tree/updateCurrentBalance'), {user_id: userid, current_balance: current_balance})
      .pipe(map(res => {return res;}));
  }
  updateAvailability(product_id, qty) {
    return this.http.put(this.httpService.initUrl('/genealogy-tree/updateAvailability'), {product_id: product_id, qty:qty})
  }
  updateSellerLCBalance(seller_id, lc) {
    return this.http.put(this.httpService.initUrl('/genealogy-tree/updateSellerLCBalance'), {seller_id: seller_id, lc: lc})
  }
  setBalance(balancePlus, ita, id, add_id, type) {
    console.log("balance, id: ", balancePlus, id)
    return this.http.put(this.httpService.initUrl('/genealogy-tree/updateBalancePlus'), {user_id: id, balancePlus: balancePlus, ita: ita, add_id: add_id, type: type})
      .pipe(map(res => {return res;}));
  }
  getBalance() {
    return this.http.get(this.httpService.initUrl('/genealogy-tree/getBalancePlus'))
      .pipe(map(res => {return res;}));
  }
  setAvailable(userid, flag) {
    return this.http.post(this.httpService.initUrl('/setAvailable'), {userid: userid, flag: flag})
      .pipe(map(res => {return res;}));
  }
  addProfit(userid, profit) {
    console.log("userid, profit", userid, profit)
    return this.http.post(this.httpService.initUrl('/genealogy-tree/addProfit'), {user_id: userid, profit: profit})
      .pipe(map(res => {return res;}));
  }

  addReferralProfit(userid, profit) {
    console.log("userid, profit", userid, profit)
    return this.http.post(this.httpService.initUrl('/genealogy-tree/addReferralProfit'), {user_id: userid, profit: profit})
      .pipe(map(res => {return res;}));
  }

  getUserByReferral(user_id) {
    return this.http.get(this.httpService.initUrl('/genealogy-tree/getUserByReferral/' + user_id))
      .pipe(map(res => {return res;}));
  }

  positionExist(userid, position) {
    return this.http.post(this.httpService.initUrl('/genealogy-tree/positionExist'), {user_id: userid, position: position})
      .pipe(map(res => {return res;}));
  }
}
