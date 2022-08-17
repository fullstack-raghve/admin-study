import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurrencyConversionComponent } from './edit-currency-conversion.component';

describe('EditCurrencyConversionComponent', () => {
  let component: EditCurrencyConversionComponent;
  let fixture: ComponentFixture<EditCurrencyConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCurrencyConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCurrencyConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
