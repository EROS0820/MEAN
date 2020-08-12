import { Component, OnInit , Inject, Optional, ViewChild} from '@angular/core';
//dialog-box.component.ts
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/services/storage.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-modal-cheque',
  templateUrl: './modal-cheque.component.html',
  styleUrls: ['./modal-cheque.component.css']
})
export class ModalChequeComponent implements OnInit {

  // displayedColumns: string[] = [ 'referraledId', 'name', 'type', 'amount', 'ita', 'profit', 'date'];
  // dataSource: MatTableDataSource<PeriodicElement>;

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  payto: any;
  btc_amount: any;
  release_time: any;
  currentUser = [];
  lcBalance: any = 0;
  btcBalance: any = 0;
  _id: any;

  public uri = environment.backendUrl;

  constructor(
    public http:HttpClient,
    private storageService: StorageService,
    private api: HttpService,
    public dialogRef: MatDialogRef<ModalChequeComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: passData
  ) {
    // ELEMENT_DATA = []
    this.currentUser =  this.storageService.getUser()
    console.log("Originalk",data);
    this._id = data._id
    this.payto = data.userid
    this.btc_amount = data.maturity_fund
    this.release_time = data.maturity_time
    // console.log("elementdata", ELEMENT_DATA)
    // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }
  
  ngOnInit() {
    // console.log("elementData", ELEMENT_DATA)
    // this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    // console.log("datasource", this.dataSource)
    // this.dataSource = new MatTableDataSource(ELEMENT_DATA);

    this.api.get(this.uri + '/getCoinBalance/' + this.currentUser['id']).then((response) => {
      this.btcBalance = response['value'].btc;
      this.lcBalance = response['value'].lc;
      console.log("response: ", response['value'])
    });
  }

  

  createCheque() {
    console.log("createCheque")
    this.http.post(this.uri + '/barrower/', {
      btc_amount: this.btc_amount,
      payto: this.payto,
      from: this.currentUser['id'],
      releasing_date: this.release_time,
      btc_balance: this.btcBalance,
      lc_balance: this.lcBalance,
      type: 'B',
      capitalId: this._id
    })
    .subscribe(result=>{
      console.log("result: ", result)
    })
    this.dialogRef.close({event: 'done', _id: this._id});
  }
}

export interface passData {
  _id: string;
  userid: number;
  maturity_fund: number;
  maturity_time: number;
}

// let ELEMENT_DATA: PeriodicElement[] = [];
