import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVariantsComponent } from './search-variants.component';

describe('SearchVariantsComponent', () => {
  let component: SearchVariantsComponent;
  let fixture: ComponentFixture<SearchVariantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVariantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
