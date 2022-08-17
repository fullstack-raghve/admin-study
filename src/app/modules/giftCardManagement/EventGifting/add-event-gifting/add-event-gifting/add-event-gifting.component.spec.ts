import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventGiftingComponent } from './add-event-gifting.component';

describe('AddEventGiftingComponent', () => {
  let component: AddEventGiftingComponent;
  let fixture: ComponentFixture<AddEventGiftingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEventGiftingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventGiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
