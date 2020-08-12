import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillableProductComponent } from './refillable-product.component';

describe('RefillableProductComponent', () => {
  let component: RefillableProductComponent;
  let fixture: ComponentFixture<RefillableProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefillableProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillableProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
