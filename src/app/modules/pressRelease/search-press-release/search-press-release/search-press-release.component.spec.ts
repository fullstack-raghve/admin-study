import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPressReleaseComponent } from './search-press-release.component';

describe('SearchPressReleaseComponent', () => {
  let component: SearchPressReleaseComponent;
  let fixture: ComponentFixture<SearchPressReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPressReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPressReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
