import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndirectSavingsComponent } from './indirect-savings.component';

describe('IndirectSavingsComponent', () => {
  let component: IndirectSavingsComponent;
  let fixture: ComponentFixture<IndirectSavingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndirectSavingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndirectSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
