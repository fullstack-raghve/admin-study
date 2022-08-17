import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssignPhysicalCardsComponent } from './add-assign-physical-cards.component';

describe('AddAssignPhysicalCardsComponent', () => {
  let component: AddAssignPhysicalCardsComponent;
  let fixture: ComponentFixture<AddAssignPhysicalCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssignPhysicalCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssignPhysicalCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
