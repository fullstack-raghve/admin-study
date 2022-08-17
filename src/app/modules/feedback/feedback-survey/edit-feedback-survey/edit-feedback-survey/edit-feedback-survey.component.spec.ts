import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeedbackSurveyComponent } from './edit-feedback-survey.component';

describe('EditFeedbackSurveyComponent', () => {
  let component: EditFeedbackSurveyComponent;
  let fixture: ComponentFixture<EditFeedbackSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFeedbackSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFeedbackSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
