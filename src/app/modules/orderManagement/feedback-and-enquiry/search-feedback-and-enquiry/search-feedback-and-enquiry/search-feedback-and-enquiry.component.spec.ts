import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFeedbackAndEnquiryComponent } from './search-feedback-and-enquiry.component';

describe('SearchFeedbackAndEnquiryComponent', () => {
  let component: SearchFeedbackAndEnquiryComponent;
  let fixture: ComponentFixture<SearchFeedbackAndEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFeedbackAndEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFeedbackAndEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
