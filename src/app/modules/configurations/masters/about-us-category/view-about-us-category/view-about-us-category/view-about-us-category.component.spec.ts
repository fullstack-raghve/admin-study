import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAboutUsCategoryComponent } from './view-about-us-category.component';

describe('ViewAboutUsCategoryComponent', () => {
  let component: ViewAboutUsCategoryComponent;
  let fixture: ComponentFixture<ViewAboutUsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAboutUsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAboutUsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
