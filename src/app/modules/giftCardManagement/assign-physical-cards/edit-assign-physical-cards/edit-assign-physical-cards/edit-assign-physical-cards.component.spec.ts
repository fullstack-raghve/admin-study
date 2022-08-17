import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssignPhysicalCardsComponent } from './edit-assign-physical-cards.component';

describe('EditAssignPhysicalCardsComponent', () => {
  let component: EditAssignPhysicalCardsComponent;
  let fixture: ComponentFixture<EditAssignPhysicalCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssignPhysicalCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssignPhysicalCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
