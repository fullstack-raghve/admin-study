import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateAccountHistoryComponent } from './corporate-account-history.component';

describe('CorporateAccountHistoryComponent', () => {
  let component: CorporateAccountHistoryComponent;
  let fixture: ComponentFixture<CorporateAccountHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateAccountHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateAccountHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
