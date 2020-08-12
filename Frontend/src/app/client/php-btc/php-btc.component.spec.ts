import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhpBtcComponent } from './php-btc.component';

describe('PhpBtcComponent', () => {
  let component: PhpBtcComponent;
  let fixture: ComponentFixture<PhpBtcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhpBtcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhpBtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
