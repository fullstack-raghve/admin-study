import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCouponsComponent } from './search-coupons.component';

describe('SearchCouponsComponent', () => {
  let component: SearchCouponsComponent;
  let fixture: ComponentFixture<SearchCouponsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCouponsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
