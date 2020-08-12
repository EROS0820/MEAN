import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pipe } from 'rxjs';
import {filter, first, map, tap} from 'rxjs/operators';
import { requiredFileType } from '../file-upload/upload-file-validators';
import {BinarySellerService} from '../../services/side_services/binary-seller.service';
import {StorageService} from '../../services/storage.service';
import {environment} from "../../../environments/environment";
import {MatDialog} from '@angular/material/dialog';
import {DialogEditProductDialogComponent} from "../dialog-edit-product-dialog/dialog-edit-product-dialog.component";
import {DialogConfirmationComponent} from "../dialog-confirmation/dialog-confirmation.component";

export function uploadProgress<T>(cb: (progress: number ) => void ) {
  return tap(( event: HttpEvent<T> ) => {
    if ( event.type === HttpEventType.UploadProgress ) {
      cb(Math.round((100 * event.loaded) / event.total));
    }
  });
}

export function toResponseBody<T>() {
  return pipe(
    filter(( event: HttpEvent<T> ) => event.type === HttpEventType.Response),
    map(( res: HttpResponse<T> ) => res.body)
  );
}

@Component({
  selector: 'app-binary-seller',
  templateUrl: './binary-seller.component.html',
  styleUrls: ['./binary-seller.component.css']
})
export class BinarySellerComponent implements OnInit{
  progress = 0;
  upload_url = environment.upload_url;
  binaryForm:FormGroup;
  success = false;
  market_price = 0.00;
  products:any = [];
  currentUser = [];
  userid:any;
  users = [];
  constructor( private http: HttpClient,
               private storageService: StorageService,
               private binarySeller: BinarySellerService,
               public dialog: MatDialog) {
    this.initBinaryForm();
    this.currentUser =  this.storageService.getUser()
  }
  ngOnInit(): void {
    if(this.currentUser) {
      this.userid = this.currentUser['id'];
      this.setUserId();
      this.getProducts()
    }
  }
  setUserId(){
    this.binaryForm.controls['userid'].setValue(this.userid);
  }
  initBinaryForm() {
    this.binaryForm = new FormGroup({
      userid:new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required, requiredFileType('png', 'jpg')]),
      product_name: new FormControl(null, Validators.required),
      seller_price: new FormControl(null, Validators.required),
      availability: new FormControl(null, Validators.required),
      market_price: new FormControl(),
    });
  }
  submit() {
    this.success = false;
    if ( !this.binaryForm.valid ) {
      markAllAsDirty(this.binaryForm);
      return;
    }

    this.binarySeller.fileUpload('/binary-seller/fileUpload', toFormData(this.binaryForm.value))
      .pipe(uploadProgress(progress => (this.progress = progress)),
        toResponseBody()).subscribe(res => {
        if(res['status']){
          this.progress = 0;
          this.success = true;
          this.getProducts();
          this.binaryForm.reset();
          this.initBinaryForm()
          this.setUserId()
        }
    });
  }

  hasError( field: string, error: string ) {
    const control = this.binaryForm.get(field);
    return control.dirty && control.hasError(error);
  }

  getMarketPrice(event) {
    this.market_price = event.target.value*2.19;
    this.binaryForm.controls['market_price'].setValue(this.market_price);
  }

  getProducts() {
    return this.binarySeller.getProducts('/binary-seller/getProducts', this.userid)
      .pipe(first()).subscribe(res=>{
        this.products = res;
      });
  }

  deleteProduct(_id, id) {
    this.openConfirmation(_id, id);
  }
  openConfirmation(_id, id) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent);
      dialogRef.afterClosed().subscribe(res => {
        if(res) {
          return this.binarySeller.deleteProducts('/binary-seller/deleteProducts', _id, id)
            .pipe().subscribe(res=> {
              if(res['status']) {
                this.getProducts();
              }
            })
        }
    })
  }

  editProduct(_id) {
    for (let product of this.products) {
      if(product._id == _id) {
        this.openDialog(product);
      }
    }
  }

  openDialog(product): void {
    const dialogRef = this.dialog.open(DialogEditProductDialogComponent,  {
      width: '250px',
      data: {_id: product._id, userid: product.userid, image: product.image,
        market_price: product.market_price, seller_price: product.seller_price, availability: product.availability
        ,upload_date: product.upload_date, product_name: product.product_name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        result.market_price = result.seller_price * 2.19;
        this.updateProduct(result);
      }
    });
  }

  updateProduct(data) {
    this.binarySeller.updateProduct('/binary-seller/updateProduct', data)
      .pipe().subscribe(res => {
      if(res['status']) {
        this.getProducts();
      }
    });
  }
}



export function markAllAsDirty( form: FormGroup ) {
  for ( const control of Object.keys(form.controls) ) {
    form.controls[control].markAsDirty();
  }
}

export function toFormData<T>( formValue: T ) {
  const formData = new FormData();
  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key];
    formData.append(key, value);
  }
  return formData;
}
