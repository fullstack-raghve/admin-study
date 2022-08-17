import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSearchGiftCardsComponent } from './search-search-gift-cards.component';

describe('SearchSearchGiftCardsComponent', () => {
  let component: SearchSearchGiftCardsComponent;
  let fixture: ComponentFixture<SearchSearchGiftCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSearchGiftCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSearchGiftCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
