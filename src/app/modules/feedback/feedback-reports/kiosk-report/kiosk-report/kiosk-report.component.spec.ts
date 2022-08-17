import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskReportComponent } from './kiosk-report.component';

describe('KioskReportComponent', () => {
  let component: KioskReportComponent;
  let fixture: ComponentFixture<KioskReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KioskReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
