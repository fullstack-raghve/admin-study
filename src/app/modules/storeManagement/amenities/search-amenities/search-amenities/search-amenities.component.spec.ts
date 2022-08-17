import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAmenitiesComponent } from './search-amenities.component';

describe('SearchAmenitiesComponent', () => {
  let component: SearchAmenitiesComponent;
  let fixture: ComponentFixture<SearchAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
