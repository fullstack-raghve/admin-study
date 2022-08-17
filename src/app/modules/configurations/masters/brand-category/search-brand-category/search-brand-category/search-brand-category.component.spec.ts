import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBrandCategoryComponent } from './search-brand-category.component';

describe('SearchBrandCategoryComponent', () => {
  let component: SearchBrandCategoryComponent;
  let fixture: ComponentFixture<SearchBrandCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBrandCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBrandCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
