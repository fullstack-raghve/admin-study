import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowPerformanceComponent } from './flow-performance.component';

describe('FlowPerformanceComponent', () => {
  let component: FlowPerformanceComponent;
  let fixture: ComponentFixture<FlowPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
