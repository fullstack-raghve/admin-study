import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBrandCategoryComponent } from './edit-brand-category.component';

describe('EditBrandCategoryComponent', () => {
  let component: EditBrandCategoryComponent;
  let fixture: ComponentFixture<EditBrandCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBrandCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBrandCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
