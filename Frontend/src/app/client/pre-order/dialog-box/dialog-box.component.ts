import { Component, OnInit , Inject, Optional} from '@angular/core';
//dialog-box.component.ts
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface UsersData {
  name: string;
  id: number;
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData
  ) {
    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  action:string;
  local_data:any;


  ngOnInit() {
  }
  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
