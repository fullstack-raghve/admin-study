import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAddOnsComponent } from './search-add-ons.component';

describe('SearchAddOnsComponent', () => {
  let component: SearchAddOnsComponent;
  let fixture: ComponentFixture<SearchAddOnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAddOnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAddOnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
