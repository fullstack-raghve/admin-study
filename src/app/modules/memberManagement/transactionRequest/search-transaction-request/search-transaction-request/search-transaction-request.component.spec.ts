import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTransactionRequestComponent } from './search-transaction-request.component';

describe('SearchTransactionRequestComponent', () => {
  let component: SearchTransactionRequestComponent;
  let fixture: ComponentFixture<SearchTransactionRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTransactionRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTransactionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
