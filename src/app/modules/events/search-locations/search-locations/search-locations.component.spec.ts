import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLocationsComponent } from './search-locations.component';

describe('SearchLocationsComponent', () => {
  let component: SearchLocationsComponent;
  let fixture: ComponentFixture<SearchLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
