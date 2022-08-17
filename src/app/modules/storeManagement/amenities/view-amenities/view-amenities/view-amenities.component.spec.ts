import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAmenitiesComponent } from './view-amenities.component';

describe('ViewAmenitiesComponent', () => {
  let component: ViewAmenitiesComponent;
  let fixture: ComponentFixture<ViewAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
