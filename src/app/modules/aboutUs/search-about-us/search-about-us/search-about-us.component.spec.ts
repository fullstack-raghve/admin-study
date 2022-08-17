import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAboutUsComponent } from './search-about-us.component';

describe('SearchAboutUsComponent', () => {
  let component: SearchAboutUsComponent;
  let fixture: ComponentFixture<SearchAboutUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAboutUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
