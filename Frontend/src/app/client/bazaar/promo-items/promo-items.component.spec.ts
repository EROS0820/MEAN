import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoItemsComponent } from './promo-items.component';

describe('PromoItemsComponent', () => {
  let component: PromoItemsComponent;
  let fixture: ComponentFixture<PromoItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
