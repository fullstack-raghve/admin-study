import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeedbackSurveyComponent } from './view-feedback-survey.component';

describe('ViewFeedbackSurveyComponent', () => {
  let component: ViewFeedbackSurveyComponent;
  let fixture: ComponentFixture<ViewFeedbackSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFeedbackSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFeedbackSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
