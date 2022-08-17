import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTransactionDialogComponent } from './select-transaction-dialog.component';

describe('SelectTransactionDialogComponent', () => {
  let component: SelectTransactionDialogComponent;
  let fixture: ComponentFixture<SelectTransactionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTransactionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
