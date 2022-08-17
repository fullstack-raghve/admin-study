import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGiftingLimitComponent } from './view-gifting-limit.component';

describe('ViewGiftingLimitComponent', () => {
  let component: ViewGiftingLimitComponent;
  let fixture: ComponentFixture<ViewGiftingLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGiftingLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGiftingLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
