import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAssignPhysicalCardsComponent } from './search-assign-physical-cards.component';

describe('SearchAssignPhysicalCardsComponent', () => {
  let component: SearchAssignPhysicalCardsComponent;
  let fixture: ComponentFixture<SearchAssignPhysicalCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAssignPhysicalCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAssignPhysicalCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
