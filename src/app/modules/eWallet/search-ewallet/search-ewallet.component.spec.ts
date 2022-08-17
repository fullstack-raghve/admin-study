import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEWalletComponent } from './search-ewallet.component';

describe('SearchEWalletComponent', () => {
  let component: SearchEWalletComponent;
  let fixture: ComponentFixture<SearchEWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
