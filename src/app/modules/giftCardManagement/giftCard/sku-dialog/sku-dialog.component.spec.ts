import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuDialogComponent } from './sku-dialog.component';

describe('SkuDialogComponent', () => {
  let component: SkuDialogComponent;
  let fixture: ComponentFixture<SkuDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
