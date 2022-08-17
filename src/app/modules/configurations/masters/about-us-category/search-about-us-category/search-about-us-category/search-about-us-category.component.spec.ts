import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAboutUsCategoryComponent } from './search-about-us-category.component';

describe('SearchAboutUsCategoryComponent', () => {
  let component: SearchAboutUsCategoryComponent;
  let fixture: ComponentFixture<SearchAboutUsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAboutUsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAboutUsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
