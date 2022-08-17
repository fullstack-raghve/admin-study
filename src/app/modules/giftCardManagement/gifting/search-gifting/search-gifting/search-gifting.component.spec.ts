import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGiftingComponent } from './search-gifting.component';

describe('SearchGiftingComponent', () => {
  let component: SearchGiftingComponent;
  let fixture: ComponentFixture<SearchGiftingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchGiftingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
