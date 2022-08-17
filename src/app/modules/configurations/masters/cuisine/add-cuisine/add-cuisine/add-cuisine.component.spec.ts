import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCuisineComponent } from './add-cuisine.component';

describe('AddCuisineComponent', () => {
  let component: AddCuisineComponent;
  let fixture: ComponentFixture<AddCuisineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCuisineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCuisineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
