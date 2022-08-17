import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGiftCardComponent } from './view-gift-card.component';

describe('ViewGiftCardComponent', () => {
  let component: ViewGiftCardComponent;
  let fixture: ComponentFixture<ViewGiftCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGiftCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
