import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftingLimitDialogComponent } from './gifting-limit-dialog.component';

describe('GiftingLimitDialogComponent', () => {
  let component: GiftingLimitDialogComponent;
  let fixture: ComponentFixture<GiftingLimitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftingLimitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftingLimitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
