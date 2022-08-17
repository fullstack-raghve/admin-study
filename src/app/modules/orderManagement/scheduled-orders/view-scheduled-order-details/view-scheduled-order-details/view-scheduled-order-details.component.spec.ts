import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewScheduledOrderDetailsComponent } from './view-scheduled-order-details.component';

describe('ViewScheduledOrderDetailsComponent', () => {
  let component: ViewScheduledOrderDetailsComponent;
  let fixture: ComponentFixture<ViewScheduledOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewScheduledOrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewScheduledOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
