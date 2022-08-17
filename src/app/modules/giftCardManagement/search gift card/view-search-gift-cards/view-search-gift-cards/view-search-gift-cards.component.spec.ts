import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSearchGiftCardsComponent } from './view-search-gift-cards.component';

describe('ViewSearchGiftCardsComponent', () => {
  let component: ViewSearchGiftCardsComponent;
  let fixture: ComponentFixture<ViewSearchGiftCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSearchGiftCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSearchGiftCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
