import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGiftCardComponent } from './search-gift-card.component';

describe('SearchGiftCardComponent', () => {
  let component: SearchGiftCardComponent;
  let fixture: ComponentFixture<SearchGiftCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchGiftCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
