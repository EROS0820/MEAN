import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-change-lc',
  templateUrl: './change-lc.component.html',
  styleUrls: ['./change-lc.component.css']
})
export class ChangeLCComponent implements OnChanges  {

  constructor() { }
  @Input()
  prop !: number;
  ngOnChanges(changes: SimpleChanges) {
  	console.log(changes);
  }

}
