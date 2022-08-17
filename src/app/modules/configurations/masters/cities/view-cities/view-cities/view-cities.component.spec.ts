import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCitiesComponent } from './view-cities.component';

describe('ViewCitiesComponent', () => {
  let component: ViewCitiesComponent;
  let fixture: ComponentFixture<ViewCitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
