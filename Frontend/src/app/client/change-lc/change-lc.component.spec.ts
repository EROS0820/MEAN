import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLCComponent } from './change-lc.component';

describe('ChangeLCComponent', () => {
  let component: ChangeLCComponent;
  let fixture: ComponentFixture<ChangeLCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeLCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
