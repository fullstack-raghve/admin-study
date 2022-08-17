import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDeliveryAreaComponent } from './search-delivery-area.component';

describe('SearchDeliveryAreaComponent', () => {
  let component: SearchDeliveryAreaComponent;
  let fixture: ComponentFixture<SearchDeliveryAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDeliveryAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDeliveryAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
