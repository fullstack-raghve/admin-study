import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHistoryDialogComponent } from './edit-history-dialog.component';

describe('EditHistoryDialogComponent', () => {
  let component: EditHistoryDialogComponent;
  let fixture: ComponentFixture<EditHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
