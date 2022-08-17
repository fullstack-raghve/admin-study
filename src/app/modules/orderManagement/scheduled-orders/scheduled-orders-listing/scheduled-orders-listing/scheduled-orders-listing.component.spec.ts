import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledOrdersListingComponent } from './scheduled-orders-listing.component';

describe('ScheduledOrdersListingComponent', () => {
  let component: ScheduledOrdersListingComponent;
  let fixture: ComponentFixture<ScheduledOrdersListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledOrdersListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledOrdersListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
