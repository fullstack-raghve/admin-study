import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerSegmentsComponent } from './add-customer-segments.component';

describe('AddCustomerSegmentsComponent', () => {
  let component: AddCustomerSegmentsComponent;
  let fixture: ComponentFixture<AddCustomerSegmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomerSegmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
