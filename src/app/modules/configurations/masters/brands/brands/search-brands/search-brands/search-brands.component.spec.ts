import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBrandsComponent } from './search-brands.component';

describe('SearchBrandsComponent', () => {
  let component: SearchBrandsComponent;
  let fixture: ComponentFixture<SearchBrandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBrandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
