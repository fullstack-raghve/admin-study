import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrandCategoryComponent } from './add-brand-category.component';

describe('AddBrandCategoryComponent', () => {
  let component: AddBrandCategoryComponent;
  let fixture: ComponentFixture<AddBrandCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBrandCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBrandCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
