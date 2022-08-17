import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeebackSurveyComponent } from './add-feeback-survey.component';

describe('AddFeebackSurveyComponent', () => {
  let component: AddFeebackSurveyComponent;
  let fixture: ComponentFixture<AddFeebackSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFeebackSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeebackSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
