import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BazaarProductEditComponent } from './bazaar-product-edit.component';

describe('BazaarProductEditComponent', () => {
  let component: BazaarProductEditComponent;
  let fixture: ComponentFixture<BazaarProductEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BazaarProductEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BazaarProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
