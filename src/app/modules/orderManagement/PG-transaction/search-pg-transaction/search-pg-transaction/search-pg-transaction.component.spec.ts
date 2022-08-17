import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPgTransactionComponent } from './search-pg-transaction.component';

describe('SearchPgTransactionComponent', () => {
  let component: SearchPgTransactionComponent;
  let fixture: ComponentFixture<SearchPgTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPgTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPgTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
