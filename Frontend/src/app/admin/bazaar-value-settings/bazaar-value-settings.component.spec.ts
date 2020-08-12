import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BazaarValueSettingsComponent } from './bazaar-value-settings.component';

describe('BazaarValueSettingsComponent', () => {
  let component: BazaarValueSettingsComponent;
  let fixture: ComponentFixture<BazaarValueSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BazaarValueSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BazaarValueSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
