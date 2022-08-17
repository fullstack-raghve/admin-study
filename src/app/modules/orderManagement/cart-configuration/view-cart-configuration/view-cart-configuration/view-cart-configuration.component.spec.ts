import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCartConfigurationComponent } from './view-cart-configuration.component';

describe('ViewCartConfigurationComponent', () => {
  let component: ViewCartConfigurationComponent;
  let fixture: ComponentFixture<ViewCartConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCartConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCartConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
