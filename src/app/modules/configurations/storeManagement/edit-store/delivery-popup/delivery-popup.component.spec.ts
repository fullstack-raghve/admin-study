import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPopupComponent } from './delivery-popup.component';

describe('DeliveryPopupComponent', () => {
  let component: DeliveryPopupComponent;
  let fixture: ComponentFixture<DeliveryPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
