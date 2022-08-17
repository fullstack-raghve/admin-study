import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackKioskReportsComponent } from './feedback-kiosk-reports.component';

describe('FeedbackKioskReportsComponent', () => {
  let component: FeedbackKioskReportsComponent;
  let fixture: ComponentFixture<FeedbackKioskReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackKioskReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackKioskReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
