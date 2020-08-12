import {Component, Inject} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {environment} from "../../../environments/environment";
import {BinarySellerService} from "../../services/side_services/binary-seller.service";
export interface DialogData {
  _id:string,
  userid: number,
  image: string,
  product_name: string,
  market_price: number,
  seller_price: string,
  availability: number,
  upload_date:Date
}
@Component({
  selector: 'app-dialog-edit-product-dialog',
  templateUrl: './dialog-edit-product-dialog.component.html',
  styleUrls: ['./dialog-edit-product-dialog.component.css']
})
export class DialogEditProductDialogComponent {
  upload_url = 'http://localhost:8080/upload/image/';
  constructor(
    public dialogRef: MatDialogRef<DialogEditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public binarySeller:BinarySellerService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
