import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCouponDialogeComponent } from './select-coupon-dialoge.component';

describe('SelectCouponDialogeComponent', () => {
  let component: SelectCouponDialogeComponent;
  let fixture: ComponentFixture<SelectCouponDialogeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCouponDialogeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCouponDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
