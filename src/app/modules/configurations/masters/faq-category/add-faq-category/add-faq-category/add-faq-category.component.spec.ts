import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFaqCategoryComponent } from './add-faq-category.component';

describe('AddFaqCategoryComponent', () => {
  let component: AddFaqCategoryComponent;
  let fixture: ComponentFixture<AddFaqCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFaqCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFaqCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
