import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFaqCategoryComponent } from './search-faq-category.component';

describe('SearchFaqCategoryComponent', () => {
  let component: SearchFaqCategoryComponent;
  let fixture: ComponentFixture<SearchFaqCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFaqCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFaqCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
