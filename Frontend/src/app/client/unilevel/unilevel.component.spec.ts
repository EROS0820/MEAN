import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnilevelComponent } from './unilevel.component';

describe('UnilevelComponent', () => {
  let component: UnilevelComponent;
  let fixture: ComponentFixture<UnilevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnilevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnilevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
