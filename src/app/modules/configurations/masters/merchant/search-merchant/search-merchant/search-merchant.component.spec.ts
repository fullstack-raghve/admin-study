import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMerchantComponent } from './search-merchant.component';

describe('SearchMerchantComponent', () => {
  let component: SearchMerchantComponent;
  let fixture: ComponentFixture<SearchMerchantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMerchantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
