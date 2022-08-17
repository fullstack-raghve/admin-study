import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAmenitiesComponent } from './edit-amenities.component';

describe('EditAmenitiesComponent', () => {
  let component: EditAmenitiesComponent;
  let fixture: ComponentFixture<EditAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
