import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSearchGiftCardCardStatusDialogComponent } from './add-search-gift-card-card-status-dialog.component';

describe('AddSearchGiftCardCardStatusDialogComponent', () => {
  let component: AddSearchGiftCardCardStatusDialogComponent;
  let fixture: ComponentFixture<AddSearchGiftCardCardStatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSearchGiftCardCardStatusDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSearchGiftCardCardStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
