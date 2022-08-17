import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGiftingTncDialogComponent } from './view-gifting-tnc-dialog.component';

describe('ViewGiftingTncDialogComponent', () => {
  let component: ViewGiftingTncDialogComponent;
  let fixture: ComponentFixture<ViewGiftingTncDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGiftingTncDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGiftingTncDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
