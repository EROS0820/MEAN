import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-convert2',
  templateUrl: './convert2.component.html',
  styleUrls: ['./convert2.component.css']
})
export class Convert2Component implements OnInit {

  constructor(public socket: SocketService) { }

  ngOnInit() {}

}
