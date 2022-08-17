import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComboComponent } from './search-combo.component';

describe('SearchComboComponent', () => {
  let component: SearchComboComponent;
  let fixture: ComponentFixture<SearchComboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
