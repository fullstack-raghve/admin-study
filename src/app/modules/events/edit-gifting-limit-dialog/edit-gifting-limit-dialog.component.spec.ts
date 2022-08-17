import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGiftingLimitDialogComponent } from './edit-gifting-limit-dialog.component';

describe('EditGiftingLimitDialogComponent', () => {
  let component: EditGiftingLimitDialogComponent;
  let fixture: ComponentFixture<EditGiftingLimitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGiftingLimitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGiftingLimitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
