import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { SocketService } from '../../services/socket.service';
@Component({
  selector: 'app-last-convert',
  templateUrl: './last-convert.component.html',
  styleUrls: ['./last-convert.component.css']
})
export class LastConvertComponent implements OnChanges {

  constructor(private socket: SocketService) { }

  @Input() type;
  @Input() status;
  conversions = [];
  ngOnChanges(changes: SimpleChanges) {
    if (this.status) {
      if (this.type === 'ltob') {
        this.conversions = this.socket.last_ltob_conversions;
      } else {
        this.conversions = this.socket.last_btol_conversions;
      }
    }
  }
}
