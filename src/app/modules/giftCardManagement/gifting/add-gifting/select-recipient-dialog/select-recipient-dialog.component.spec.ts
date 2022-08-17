import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRecipientDialogComponent } from './select-recipient-dialog.component';

describe('SelectRecipientDialogComponent', () => {
  let component: SelectRecipientDialogComponent;
  let fixture: ComponentFixture<SelectRecipientDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectRecipientDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRecipientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
