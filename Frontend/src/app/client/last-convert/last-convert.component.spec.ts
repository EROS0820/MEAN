import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastConvertComponent } from './last-convert.component';

describe('LastConvertComponent', () => {
  let component: LastConvertComponent;
  let fixture: ComponentFixture<LastConvertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastConvertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
