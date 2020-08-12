import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChequeComponent } from './modal-cheque.component';

describe('ModalChequeComponent', () => {
  let component: ModalChequeComponent;
  let fixture: ComponentFixture<ModalChequeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChequeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
