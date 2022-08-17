import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPhysicalCardsComponent } from './search-physical-cards.component';

describe('SearchPhysicalCardsComponent', () => {
  let component: SearchPhysicalCardsComponent;
  let fixture: ComponentFixture<SearchPhysicalCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPhysicalCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPhysicalCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
