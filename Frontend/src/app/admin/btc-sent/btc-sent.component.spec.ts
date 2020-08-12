import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtcSentComponent } from './btc-sent.component';

describe('BtcSentComponent', () => {
  let component: BtcSentComponent;
  let fixture: ComponentFixture<BtcSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtcSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtcSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
