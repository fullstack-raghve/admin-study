import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSearchGiftCardRedeemedDialogComponent } from './edit-search-gift-card-redeemed-dialog.component';

describe('EditSearchGiftCardRedeemedDialogComponent', () => {
  let component: EditSearchGiftCardRedeemedDialogComponent;
  let fixture: ComponentFixture<EditSearchGiftCardRedeemedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSearchGiftCardRedeemedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSearchGiftCardRedeemedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
