import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnquiryTypeComponent } from './view-enquiry-type.component';

describe('ViewEnquiryTypeComponent', () => {
  let component: ViewEnquiryTypeComponent;
  let fixture: ComponentFixture<ViewEnquiryTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEnquiryTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEnquiryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
