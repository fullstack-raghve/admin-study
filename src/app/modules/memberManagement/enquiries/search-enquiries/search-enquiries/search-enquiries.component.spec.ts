import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEnquiriesComponent } from './search-enquiries.component';

describe('SearchEnquiriesComponent', () => {
  let component: SearchEnquiriesComponent;
  let fixture: ComponentFixture<SearchEnquiriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEnquiriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
