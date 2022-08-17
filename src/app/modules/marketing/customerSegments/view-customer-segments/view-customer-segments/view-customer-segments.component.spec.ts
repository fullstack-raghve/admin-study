import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerSegmentsComponent } from './view-customer-segments.component';

describe('ViewCustomerSegmentsComponent', () => {
  let component: ViewCustomerSegmentsComponent;
  let fixture: ComponentFixture<ViewCustomerSegmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCustomerSegmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
