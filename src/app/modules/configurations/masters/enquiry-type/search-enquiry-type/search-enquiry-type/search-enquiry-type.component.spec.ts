import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEnquiryTypeComponent } from './search-enquiry-type.component';

describe('SearchEnquiryTypeComponent', () => {
  let component: SearchEnquiryTypeComponent;
  let fixture: ComponentFixture<SearchEnquiryTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEnquiryTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEnquiryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
