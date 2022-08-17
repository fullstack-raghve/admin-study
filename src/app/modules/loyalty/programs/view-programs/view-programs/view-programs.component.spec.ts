import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgramsComponent } from './view-programs.component';

describe('ViewProgramsComponent', () => {
  let component: ViewProgramsComponent;
  let fixture: ComponentFixture<ViewProgramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProgramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
