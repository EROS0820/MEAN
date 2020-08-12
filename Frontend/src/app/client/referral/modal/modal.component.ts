import { Component, OnInit , Inject, Optional, ViewChild} from '@angular/core';
//dialog-box.component.ts
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  displayedColumns: string[] = [ 'referraledId', 'name', 'type', 'amount', 'ita', 'profit', 'date'];
  dataSource: MatTableDataSource<PeriodicElement>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PeriodicElement
  ) {
    ELEMENT_DATA = []
    console.log("Originalk",data);
    let List = []
    for (let i = 0 ; i < Object.keys(data).length ; i++) {
      List.push(data[i])
    }
    for (let i = 0 ; i < Object.keys(data).length ; i++) {
      if (data[i].type == "New Member") {
        let sumR = 0
        let sumRProfit = 0
        let sumC = 0
        let sumCProfit = 0
        let sumRArray = List.filter(function(item) {
          return item.type == "Repeat Order" && item.referraledId == data[i].referraledId
        })
        sumRArray.forEach(element => {
          sumR += element.amount
          sumRProfit += element.profit
        });
        let sumCArray = List.filter(function(item) {
          return item.type == "Consumerism Fund" && item.referraledId == data[i].referraledId
        })
        sumCArray.forEach(element => {
          sumC += element.amount
          sumCProfit += element.profit
        });
        console.log("sumR sumC", sumR, sumC)
        ELEMENT_DATA.push(data[i])
        if (sumR != 0) {
          ELEMENT_DATA.push({
            type: 'Repeat Order', 
            ita: 0, 
            profit: sumRProfit, 
            name: data[i].name, 
            amount: sumR, 
            date: data[i].date, 
            referraledId: data[i].referraledId
          })
        } else if (sumC != 0) {
          ELEMENT_DATA.push({
            type: 'Consumerism Fund', 
            ita: 0, 
            profit: sumCProfit, 
            name: data[i].name, 
            amount: sumC, 
            date: data[i].date, 
            referraledId: data[i].referraledId
          })
        }
      }
    }
    console.log("elementdata", ELEMENT_DATA)
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }
  
  ngOnInit() {
    // console.log("elementData", ELEMENT_DATA)
    // this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    // console.log("datasource", this.dataSource)
    // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  // ngAfterViewInit() {
  //   this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  // }
}

export interface PeriodicElement {
  type: string;
  ita: number;
  profit: number;
  date: string;
  name: string;
  amount: number;
  referraledId: number;
}

let ELEMENT_DATA: PeriodicElement[] = [];
