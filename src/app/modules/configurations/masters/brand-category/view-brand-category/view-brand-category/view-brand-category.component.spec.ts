import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBrandCategoryComponent } from './view-brand-category.component';

describe('ViewBrandCategoryComponent', () => {
  let component: ViewBrandCategoryComponent;
  let fixture: ComponentFixture<ViewBrandCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBrandCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBrandCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
