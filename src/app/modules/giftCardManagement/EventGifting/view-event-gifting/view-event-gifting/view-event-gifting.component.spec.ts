import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEventGiftingComponent } from './view-event-gifting.component';

describe('ViewEventGiftingComponent', () => {
  let component: ViewEventGiftingComponent;
  let fixture: ComponentFixture<ViewEventGiftingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEventGiftingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEventGiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
