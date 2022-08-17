import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveOrdersGlobalSearchComponent } from './live-orders-global-search.component';

describe('LiveOrdersGlobalSearchComponent', () => {
  let component: LiveOrdersGlobalSearchComponent;
  let fixture: ComponentFixture<LiveOrdersGlobalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveOrdersGlobalSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveOrdersGlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
