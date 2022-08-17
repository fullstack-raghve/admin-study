import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCurrencyConversionComponent } from './view-currency-conversion.component';

describe('ViewCurrencyConversionComponent', () => {
  let component: ViewCurrencyConversionComponent;
  let fixture: ComponentFixture<ViewCurrencyConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCurrencyConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCurrencyConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
