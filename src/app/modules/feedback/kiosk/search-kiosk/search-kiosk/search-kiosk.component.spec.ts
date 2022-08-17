import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchKioskComponent } from './search-kiosk.component';

describe('SearchKioskComponent', () => {
  let component: SearchKioskComponent;
  let fixture: ComponentFixture<SearchKioskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchKioskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchKioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
