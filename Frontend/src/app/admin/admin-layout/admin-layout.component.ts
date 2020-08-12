import { Component, OnInit } from '@angular/core';
import { navItems } from './_nav';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
	
  public navItems = navItems;

  constructor(
  	
  ) { }

  ngOnInit() {
  }

}
