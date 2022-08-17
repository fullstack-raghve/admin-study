import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFaqCategoryComponent } from './view-faq-category.component';

describe('ViewFaqCategoryComponent', () => {
  let component: ViewFaqCategoryComponent;
  let fixture: ComponentFixture<ViewFaqCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFaqCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFaqCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
