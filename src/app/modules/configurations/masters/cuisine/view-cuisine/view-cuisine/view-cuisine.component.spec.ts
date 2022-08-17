import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCuisineComponent } from './view-cuisine.component';

describe('ViewCuisineComponent', () => {
  let component: ViewCuisineComponent;
  let fixture: ComponentFixture<ViewCuisineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCuisineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCuisineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
