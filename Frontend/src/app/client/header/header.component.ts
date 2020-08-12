import { Component, OnInit, OnChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaChange } from '@angular/flex-layout';
import { MediaObserver  } from '@angular/flex-layout';
import { StorageService } from '../../services/storage.service';
import { ShareService } from '../../services/share.service';
import { SocketService } from '../../services/socket.service';
import { Router } from '@angular/router';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  opened = true;
  over = 'side';
  expandHeight = '42px';
  collapseHeight = '42px';
  displayMode = 'flat';
  // overlap = false;
  navFlag = 1;

  watcher: Subscription;
  constructor(
    private storage: StorageService,
    private router: Router,
    private change: ChangeDetectorRef,
    public share: ShareService,
    private socket: SocketService,
    media: MediaObserver) {
    this.watcher = media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.opened = false;
        this.over = 'over';
      } else {
        this.opened = true;
        this.over = 'side';
      }
    });
  }


  logout() {
    this.storage.destroyUser();
    this.share.updateUser(false);
    this.socket.reconnect();
    this.change.detectChanges();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    console.log("screenwidth: ", screen.width)
    if (screen.width < 960) {
      this.navFlag = -1
    }
  }

  menuBtn() {
    if (this.navFlag == -1) {
      this.navFlag = 1 
    } else {
      this.navFlag = -1
    }
    console.log("navBtn: ", this.navFlag)
  }
}
