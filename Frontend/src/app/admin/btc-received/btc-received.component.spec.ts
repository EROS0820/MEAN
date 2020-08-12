import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtcReceivedComponent } from './btc-received.component';

describe('BtcReceivedComponent', () => {
  let component: BtcReceivedComponent;
  let fixture: ComponentFixture<BtcReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtcReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtcReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
