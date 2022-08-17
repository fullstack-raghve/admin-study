import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveOrdersListingComponent } from './live-orders-listing.component';

describe('LiveOrdersListingComponent', () => {
  let component: LiveOrdersListingComponent;
  let fixture: ComponentFixture<LiveOrdersListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveOrdersListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveOrdersListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
