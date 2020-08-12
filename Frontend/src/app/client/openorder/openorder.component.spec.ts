import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenorderComponent } from './openorder.component';

describe('OpenorderComponent', () => {
  let component: OpenorderComponent;
  let fixture: ComponentFixture<OpenorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
