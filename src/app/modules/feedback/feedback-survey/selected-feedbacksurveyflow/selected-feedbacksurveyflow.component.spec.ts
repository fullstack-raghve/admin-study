import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedFeedbacksurveyflowComponent } from './selected-feedbacksurveyflow.component';

describe('SelectedFeedbacksurveyflowComponent', () => {
  let component: SelectedFeedbacksurveyflowComponent;
  let fixture: ComponentFixture<SelectedFeedbacksurveyflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedFeedbacksurveyflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedFeedbacksurveyflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
