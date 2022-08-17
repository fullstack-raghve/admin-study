import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCustomerSegmentsComponent } from './search-customer-segments.component';

describe('SearchCustomerSegmentsComponent', () => {
  let component: SearchCustomerSegmentsComponent;
  let fixture: ComponentFixture<SearchCustomerSegmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCustomerSegmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCustomerSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
