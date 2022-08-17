import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotificationsComponent } from './add-notifications.component';

describe('AddNotificationsComponent', () => {
  let component: AddNotificationsComponent;
  let fixture: ComponentFixture<AddNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
