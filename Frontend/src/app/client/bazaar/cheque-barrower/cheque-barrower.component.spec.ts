import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBarrowerComponent } from './cheque-barrower.component';

describe('ChequeBarrowerComponent', () => {
  let component: ChequeBarrowerComponent;
  let fixture: ComponentFixture<ChequeBarrowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeBarrowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBarrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
