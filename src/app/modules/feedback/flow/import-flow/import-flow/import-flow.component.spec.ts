import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFlowComponent } from './import-flow.component';

describe('ImportFlowComponent', () => {
  let component: ImportFlowComponent;
  let fixture: ComponentFixture<ImportFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
