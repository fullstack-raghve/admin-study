import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimReportsComponent } from './tim-reports.component';

describe('TimReportsComponent', () => {
  let component: TimReportsComponent;
  let fixture: ComponentFixture<TimReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
