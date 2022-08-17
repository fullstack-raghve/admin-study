import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProductItemsDialogComponent } from './select-product-items-dialog.component';

describe('SelectProductItemsDialogComponent', () => {
  let component: SelectProductItemsDialogComponent;
  let fixture: ComponentFixture<SelectProductItemsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectProductItemsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProductItemsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
