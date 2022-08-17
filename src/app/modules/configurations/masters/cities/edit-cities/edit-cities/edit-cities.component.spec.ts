import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCitiesComponent } from './edit-cities.component';

describe('EditCitiesComponent', () => {
  let component: EditCitiesComponent;
  let fixture: ComponentFixture<EditCitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
