import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeLedgerComponent } from './cheque-ledger.component';

describe('ChequeLedgerComponent', () => {
  let component: ChequeLedgerComponent;
  let fixture: ComponentFixture<ChequeLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
