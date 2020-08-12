import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditProductDialogComponent } from './dialog-edit-product-dialog.component';

describe('DialogEditProductDialogComponent', () => {
  let component: DialogEditProductDialogComponent;
  let fixture: ComponentFixture<DialogEditProductDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditProductDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
