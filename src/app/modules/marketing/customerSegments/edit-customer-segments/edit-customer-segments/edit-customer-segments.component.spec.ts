import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerSegmentsComponent } from './edit-customer-segments.component';

describe('EditCustomerSegmentsComponent', () => {
  let component: EditCustomerSegmentsComponent;
  let fixture: ComponentFixture<EditCustomerSegmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCustomerSegmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
