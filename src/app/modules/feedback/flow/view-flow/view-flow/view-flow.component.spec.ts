import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFlowComponent } from './view-flow.component';

describe('ViewFlowComponent', () => {
  let component: ViewFlowComponent;
  let fixture: ComponentFixture<ViewFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
