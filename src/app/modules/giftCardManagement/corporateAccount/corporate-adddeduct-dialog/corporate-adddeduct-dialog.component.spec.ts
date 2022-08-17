import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateAdddeductDialogComponent } from './corporate-adddeduct-dialog.component';

describe('CorporateAdddeductDialogComponent', () => {
  let component: CorporateAdddeductDialogComponent;
  let fixture: ComponentFixture<CorporateAdddeductDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateAdddeductDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateAdddeductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
