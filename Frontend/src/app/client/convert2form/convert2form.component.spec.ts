import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Convert2formComponent } from './convert2form.component';

describe('Convert2formComponent', () => {
  let component: Convert2formComponent;
  let fixture: ComponentFixture<Convert2formComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Convert2formComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Convert2formComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
