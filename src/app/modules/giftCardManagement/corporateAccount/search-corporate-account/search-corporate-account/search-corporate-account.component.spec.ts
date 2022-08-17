import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCorporateAccountComponent } from './search-corporate-account.component';

describe('SearchCorporateAccountComponent', () => {
  let component: SearchCorporateAccountComponent;
  let fixture: ComponentFixture<SearchCorporateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCorporateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCorporateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
