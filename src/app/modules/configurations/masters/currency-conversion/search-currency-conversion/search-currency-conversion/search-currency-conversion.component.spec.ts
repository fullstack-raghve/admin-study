import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCurrencyConversionComponent } from './search-currency-conversion.component';

describe('SearchCurrencyConversionComponent', () => {
  let component: SearchCurrencyConversionComponent;
  let fixture: ComponentFixture<SearchCurrencyConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCurrencyConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCurrencyConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
