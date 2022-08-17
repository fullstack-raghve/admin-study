import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateAdduserDialogComponent } from './corporate-adduser-dialog.component';

describe('CorporateAdduserDialogComponent', () => {
  let component: CorporateAdduserDialogComponent;
  let fixture: ComponentFixture<CorporateAdduserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateAdduserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateAdduserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
