import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCartConfigurationComponent } from './search-cart-configuration.component';

describe('SearchCartConfigurationComponent', () => {
  let component: SearchCartConfigurationComponent;
  let fixture: ComponentFixture<SearchCartConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCartConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCartConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
