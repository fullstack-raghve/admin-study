import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFeedbackComponent } from './search-feedback.component';

describe('SearchFeedbackComponent', () => {
  let component: SearchFeedbackComponent;
  let fixture: ComponentFixture<SearchFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
