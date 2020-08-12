import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Convert1Component } from './convert1.component';

describe('Convert1Component', () => {
  let component: Convert1Component;
  let fixture: ComponentFixture<Convert1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Convert1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Convert1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
