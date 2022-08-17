import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTransactionDetailsComponent } from './confirm-transaction-details.component';

describe('ConfirmTransactionDetailsComponent', () => {
  let component: ConfirmTransactionDetailsComponent;
  let fixture: ComponentFixture<ConfirmTransactionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmTransactionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
