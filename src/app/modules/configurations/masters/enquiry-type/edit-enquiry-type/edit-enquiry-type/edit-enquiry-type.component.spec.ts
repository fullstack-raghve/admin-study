import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnquiryTypeComponent } from './edit-enquiry-type.component';

describe('EditEnquiryTypeComponent', () => {
  let component: EditEnquiryTypeComponent;
  let fixture: ComponentFixture<EditEnquiryTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEnquiryTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEnquiryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
