import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnclaimedOrdersComponent } from './unclaimed-orders.component';

describe('UnclaimedOrdersComponent', () => {
  let component: UnclaimedOrdersComponent;
  let fixture: ComponentFixture<UnclaimedOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnclaimedOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnclaimedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
