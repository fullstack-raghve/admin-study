import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFeebackSurveyComponent } from './search-feeback-survey.component';

describe('SearchFeebackSurveyComponent', () => {
  let component: SearchFeebackSurveyComponent;
  let fixture: ComponentFixture<SearchFeebackSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFeebackSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFeebackSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
