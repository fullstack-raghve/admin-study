import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCartConfigurationComponent } from './add-cart-configuration.component';

describe('AddCartConfigurationComponent', () => {
  let component: AddCartConfigurationComponent;
  let fixture: ComponentFixture<AddCartConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCartConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCartConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
