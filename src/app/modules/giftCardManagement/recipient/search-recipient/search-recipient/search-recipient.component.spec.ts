import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRecipientComponent } from './search-recipient.component';

describe('SearchRecipientComponent', () => {
  let component: SearchRecipientComponent;
  let fixture: ComponentFixture<SearchRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchRecipientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
