import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BazaarHomeComponent } from './bazaar-home.component';

describe('BazaarHomeComponent', () => {
  let component: BazaarHomeComponent;
  let fixture: ComponentFixture<BazaarHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BazaarHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BazaarHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
