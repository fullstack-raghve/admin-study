import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateAccountDeductDialogComponent } from './corporate-account-deduct-dialog.component';

describe('CorporateAccountDeductDialogComponent', () => {
  let component: CorporateAccountDeductDialogComponent;
  let fixture: ComponentFixture<CorporateAccountDeductDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateAccountDeductDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateAccountDeductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
