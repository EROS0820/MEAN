import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BazaarProductComponent } from './bazaar-product.component';

describe('BazaarProductComponent', () => {
  let component: BazaarProductComponent;
  let fixture: ComponentFixture<BazaarProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BazaarProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BazaarProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
