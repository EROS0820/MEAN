import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.css']
})

export class SubheaderComponent implements OnInit {
  @Input() action;
  constructor() { }

  ngOnInit() {
  	
  }

}
