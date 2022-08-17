import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchKioskAlertsComponent } from './search-kiosk-alerts.component';

describe('SearchKioskAlertsComponent', () => {
  let component: SearchKioskAlertsComponent;
  let fixture: ComponentFixture<SearchKioskAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchKioskAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchKioskAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
