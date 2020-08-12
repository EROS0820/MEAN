import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Convert2Component } from './convert2.component';

describe('Convert2Component', () => {
  let component: Convert2Component;
  let fixture: ComponentFixture<Convert2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Convert2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Convert2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
