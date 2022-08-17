import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditlogDialogComponent } from './auditlog-dialog.component';

describe('AuditlogDialogComponent', () => {
  let component: AuditlogDialogComponent;
  let fixture: ComponentFixture<AuditlogDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditlogDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditlogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
