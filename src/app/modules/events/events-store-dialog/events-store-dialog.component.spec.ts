import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsStoreDialogComponent } from './events-store-dialog.component';

describe('EventsStoreDialogComponent', () => {
  let component: EventsStoreDialogComponent;
  let fixture: ComponentFixture<EventsStoreDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsStoreDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsStoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
