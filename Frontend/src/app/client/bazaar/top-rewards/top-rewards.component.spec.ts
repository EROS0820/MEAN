import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRewardsComponent } from './top-rewards.component';

describe('TopRewardsComponent', () => {
  let component: TopRewardsComponent;
  let fixture: ComponentFixture<TopRewardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopRewardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
