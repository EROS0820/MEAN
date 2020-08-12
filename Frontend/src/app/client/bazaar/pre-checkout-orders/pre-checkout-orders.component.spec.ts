import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreCheckoutOrdersComponent } from './pre-checkout-orders.component';

describe('PreCheckoutOrdersComponent', () => {
  let component: PreCheckoutOrdersComponent;
  let fixture: ComponentFixture<PreCheckoutOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreCheckoutOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreCheckoutOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
