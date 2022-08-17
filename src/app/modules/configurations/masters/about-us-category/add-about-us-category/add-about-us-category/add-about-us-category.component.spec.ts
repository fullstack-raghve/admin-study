import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAboutUsCategoryComponent } from './add-about-us-category.component';

describe('AddAboutUsCategoryComponent', () => {
  let component: AddAboutUsCategoryComponent;
  let fixture: ComponentFixture<AddAboutUsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAboutUsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAboutUsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
