import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAboutUsCategoryComponent } from './edit-about-us-category.component';

describe('EditAboutUsCategoryComponent', () => {
  let component: EditAboutUsCategoryComponent;
  let fixture: ComponentFixture<EditAboutUsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAboutUsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAboutUsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
