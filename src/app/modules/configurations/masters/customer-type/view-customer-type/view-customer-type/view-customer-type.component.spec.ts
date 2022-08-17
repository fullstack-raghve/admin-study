import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerTypeComponent } from './view-customer-type.component';

describe('ViewCustomerTypeComponent', () => {
  let component: ViewCustomerTypeComponent;
  let fixture: ComponentFixture<ViewCustomerTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCustomerTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
