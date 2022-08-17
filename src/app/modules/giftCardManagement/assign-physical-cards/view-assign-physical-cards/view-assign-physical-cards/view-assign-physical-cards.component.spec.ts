import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssignPhysicalCardsComponent } from './view-assign-physical-cards.component';

describe('ViewAssignPhysicalCardsComponent', () => {
  let component: ViewAssignPhysicalCardsComponent;
  let fixture: ComponentFixture<ViewAssignPhysicalCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAssignPhysicalCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssignPhysicalCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
