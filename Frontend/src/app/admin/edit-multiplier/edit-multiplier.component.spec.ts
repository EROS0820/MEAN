import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMultiplierComponent } from './edit-multiplier.component';

describe('EditMultiplierComponent', () => {
  let component: EditMultiplierComponent;
  let fixture: ComponentFixture<EditMultiplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMultiplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMultiplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
