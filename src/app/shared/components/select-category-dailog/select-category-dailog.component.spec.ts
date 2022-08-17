import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCategoryDailogComponent } from './select-category-dailog.component';

describe('SelectCategoryDailogComponent', () => {
  let component: SelectCategoryDailogComponent;
  let fixture: ComponentFixture<SelectCategoryDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCategoryDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCategoryDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
