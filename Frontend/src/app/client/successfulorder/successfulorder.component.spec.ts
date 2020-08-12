import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulorderComponent } from './successfulorder.component';

describe('SuccessfulorderComponent', () => {
  let component: SuccessfulorderComponent;
  let fixture: ComponentFixture<SuccessfulorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessfulorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfulorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
