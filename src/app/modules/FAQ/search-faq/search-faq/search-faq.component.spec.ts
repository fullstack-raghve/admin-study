import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFaqComponent } from './search-faq.component';

describe('SearchFaqComponent', () => {
  let component: SearchFaqComponent;
  let fixture: ComponentFixture<SearchFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
