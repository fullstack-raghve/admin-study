import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCorporateAccountComponent } from './view-corporate-account.component';

describe('ViewCorporateAccountComponent', () => {
  let component: ViewCorporateAccountComponent;
  let fixture: ComponentFixture<ViewCorporateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCorporateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCorporateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
