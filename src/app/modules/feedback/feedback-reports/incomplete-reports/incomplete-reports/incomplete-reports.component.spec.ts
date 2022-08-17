import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompleteReportsComponent } from './incomplete-reports.component';

describe('IncompleteReportsComponent', () => {
  let component: IncompleteReportsComponent;
  let fixture: ComponentFixture<IncompleteReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncompleteReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncompleteReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
