import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeedbackAndEnquiryComponent } from './view-feedback-and-enquiry.component';

describe('ViewFeedbackAndEnquiryComponent', () => {
  let component: ViewFeedbackAndEnquiryComponent;
  let fixture: ComponentFixture<ViewFeedbackAndEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFeedbackAndEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFeedbackAndEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
