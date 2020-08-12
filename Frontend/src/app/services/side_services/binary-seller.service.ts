import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {HttpService} from "../http.service";
@Injectable({
  providedIn: 'root'
})
export class BinarySellerService {
  constructor(private http: HttpClient,
              private httpService:HttpService) { }
  fileUpload(url, data:FormData) {
    return this.http.post(this.httpService.initUrl(url), data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map(res => {return res}));
  }
  getProducts(url, userid:any) {
    return this.http.post(this.httpService.initUrl(url),{id: userid})
      .pipe(map(res => {return res}))
  }
  deleteProducts(url, _id, id) {
    return this.http.post(this.httpService.initUrl(url), {_id:_id, id:id})
      .pipe(map(res => {return res}));
  }
  updateProduct(url, data) {
    return this.http.post(this.httpService.initUrl(url), {data:data})
      .pipe(map(res=> {return res}));
  }
}
