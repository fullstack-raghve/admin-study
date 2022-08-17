import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSearchGiftCardsComponent } from './add-search-gift-cards.component';

describe('AddSearchGiftCardsComponent', () => {
  let component: AddSearchGiftCardsComponent;
  let fixture: ComponentFixture<AddSearchGiftCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSearchGiftCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSearchGiftCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
