import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimedOrdersComponent } from './claimed-orders.component';

describe('ClaimedOrdersComponent', () => {
  let component: ClaimedOrdersComponent;
  let fixture: ComponentFixture<ClaimedOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimedOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
