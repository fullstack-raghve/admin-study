import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFlowNameComponent } from './add-flow-name.component';

describe('AddFlowNameComponent', () => {
  let component: AddFlowNameComponent;
  let fixture: ComponentFixture<AddFlowNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFlowNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFlowNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
