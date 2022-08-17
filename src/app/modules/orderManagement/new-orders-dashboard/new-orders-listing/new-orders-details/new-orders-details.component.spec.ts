import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrdersDetailsComponent } from './new-orders-details.component';

describe('NewOrdersDetailsComponent', () => {
  let component: NewOrdersDetailsComponent;
  let fixture: ComponentFixture<NewOrdersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOrdersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrdersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
