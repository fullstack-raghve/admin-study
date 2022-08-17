import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProgramsComponent } from './search-programs.component';

describe('SearchProgramsComponent', () => {
  let component: SearchProgramsComponent;
  let fixture: ComponentFixture<SearchProgramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchProgramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
