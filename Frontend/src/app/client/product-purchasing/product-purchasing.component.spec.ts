import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPurchasingComponent } from './product-purchasing.component';

describe('AboutComponent', () => {
  let component: ProductPurchasingComponent;
  let fixture: ComponentFixture<ProductPurchasingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPurchasingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPurchasingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});