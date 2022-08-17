import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMallsComponent } from './search-malls.component';

describe('SearchMallsComponent', () => {
  let component: SearchMallsComponent;
  let fixture: ComponentFixture<SearchMallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
