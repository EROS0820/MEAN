import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinarySellerComponent } from './binary-seller.component';

describe('BinarySellerComponent', () => {
  let component: BinarySellerComponent;
  let fixture: ComponentFixture<BinarySellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinarySellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinarySellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
