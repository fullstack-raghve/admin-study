import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFaqCategoryComponent } from './edit-faq-category.component';

describe('EditFaqCategoryComponent', () => {
  let component: EditFaqCategoryComponent;
  let fixture: ComponentFixture<EditFaqCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFaqCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFaqCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
