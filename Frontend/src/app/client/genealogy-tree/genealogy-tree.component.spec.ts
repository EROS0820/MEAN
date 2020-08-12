import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenealogyTreeComponent } from './genealogy-tree.component';

describe('GenealogyTreeComponent', () => {
  let component: GenealogyTreeComponent;
  let fixture: ComponentFixture<GenealogyTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenealogyTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenealogyTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
