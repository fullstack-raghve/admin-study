import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGiftCardProductDialogComponent } from './view-gift-card-product-dialog.component';

describe('ViewGiftCardProductDialogComponent', () => {
  let component: ViewGiftCardProductDialogComponent;
  let fixture: ComponentFixture<ViewGiftCardProductDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGiftCardProductDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGiftCardProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
