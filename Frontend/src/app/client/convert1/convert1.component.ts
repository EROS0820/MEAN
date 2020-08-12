import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'app-convert1',
  templateUrl: './convert1.component.html',
  styleUrls: ['./convert1.component.css']
})
export class Convert1Component implements OnInit {

  constructor(public socket: SocketService) { }

  ngOnInit() {}

}
