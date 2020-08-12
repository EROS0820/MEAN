import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Convert1formComponent } from './convert1form.component';

describe('Convert1formComponent', () => {
  let component: Convert1formComponent;
  let fixture: ComponentFixture<Convert1formComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Convert1formComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Convert1formComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
