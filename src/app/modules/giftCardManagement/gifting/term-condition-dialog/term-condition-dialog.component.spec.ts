import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermConditionDialogComponent } from './term-condition-dialog.component';

describe('TermConditionDialogComponent', () => {
  let component: TermConditionDialogComponent;
  let fixture: ComponentFixture<TermConditionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermConditionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermConditionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
