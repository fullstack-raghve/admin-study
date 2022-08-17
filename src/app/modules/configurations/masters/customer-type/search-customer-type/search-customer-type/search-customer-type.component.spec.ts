import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCustomerTypeComponent } from './search-customer-type.component';

describe('SearchCustomerTypeComponent', () => {
  let component: SearchCustomerTypeComponent;
  let fixture: ComponentFixture<SearchCustomerTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCustomerTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCustomerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
