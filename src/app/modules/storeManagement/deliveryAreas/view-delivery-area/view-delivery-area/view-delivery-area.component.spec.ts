import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeliveryAreaComponent } from './view-delivery-area.component';

describe('ViewDeliveryAreaComponent', () => {
  let component: ViewDeliveryAreaComponent;
  let fixture: ComponentFixture<ViewDeliveryAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDeliveryAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDeliveryAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
