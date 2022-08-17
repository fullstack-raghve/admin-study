import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrdersListingComponent } from './new-orders-listing.component';

describe('NewOrdersListingComponent', () => {
  let component: NewOrdersListingComponent;
  let fixture: ComponentFixture<NewOrdersListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOrdersListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrdersListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
