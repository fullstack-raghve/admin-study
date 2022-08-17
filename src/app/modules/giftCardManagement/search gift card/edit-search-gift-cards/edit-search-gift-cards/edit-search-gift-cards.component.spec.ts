import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSearchGiftCardsComponent } from './edit-search-gift-cards.component';

describe('EditSearchGiftCardsComponent', () => {
  let component: EditSearchGiftCardsComponent;
  let fixture: ComponentFixture<EditSearchGiftCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSearchGiftCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSearchGiftCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
