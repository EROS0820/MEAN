import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalistBrokerComponent } from './capitalist-broker.component';

describe('CapitalistBrokerComponent', () => {
  let component: CapitalistBrokerComponent;
  let fixture: ComponentFixture<CapitalistBrokerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapitalistBrokerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalistBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
