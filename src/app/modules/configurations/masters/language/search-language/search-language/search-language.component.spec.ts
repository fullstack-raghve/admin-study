import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLanguageComponent } from './search-language.component';

describe('SearchLanguageComponent', () => {
  let component: SearchLanguageComponent;
  let fixture: ComponentFixture<SearchLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
