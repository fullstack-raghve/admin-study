import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDeliveryComponent } from './app-delivery.component';

describe('AppDeliveryComponent', () => {
  let component: AppDeliveryComponent;
  let fixture: ComponentFixture<AppDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
