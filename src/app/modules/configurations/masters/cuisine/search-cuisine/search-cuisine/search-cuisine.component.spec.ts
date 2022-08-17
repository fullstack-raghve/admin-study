import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCuisineComponent } from './search-cuisine.component';

describe('SearchCuisineComponent', () => {
  let component: SearchCuisineComponent;
  let fixture: ComponentFixture<SearchCuisineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCuisineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCuisineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
