import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCountryComponent } from './addCountry.component';

describe('MastersComponent', () => {
  let component: AddCountryComponent;
  let fixture: ComponentFixture<AddCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
