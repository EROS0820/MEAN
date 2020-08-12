import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncashmentComponent } from './encashment.component';

describe('AboutComponent', () => {
  let component: EncashmentComponent;
  let fixture: ComponentFixture<EncashmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncashmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncashmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});