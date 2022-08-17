import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMallsComponent } from './view-malls.component';

describe('ViewMallsComponent', () => {
  let component: ViewMallsComponent;
  let fixture: ComponentFixture<ViewMallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
