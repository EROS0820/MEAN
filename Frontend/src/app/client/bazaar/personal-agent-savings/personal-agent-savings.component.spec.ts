import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAgentSavingsComponent } from './personal-agent-savings.component';

describe('PersonalAgentSavingsComponent', () => {
  let component: PersonalAgentSavingsComponent;
  let fixture: ComponentFixture<PersonalAgentSavingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalAgentSavingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalAgentSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
