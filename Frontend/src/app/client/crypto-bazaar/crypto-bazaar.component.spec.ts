import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoBazaarComponent } from './crypto-bazaar.component';

describe('CryptoBazaarComponent', () => {
  let component: CryptoBazaarComponent;
  let fixture: ComponentFixture<CryptoBazaarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoBazaarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoBazaarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
