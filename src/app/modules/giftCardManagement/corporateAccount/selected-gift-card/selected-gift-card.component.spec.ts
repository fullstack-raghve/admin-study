import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedGiftCardComponent } from './selected-gift-card.component';

describe('SelectedGiftCardComponent', () => {
  let component: SelectedGiftCardComponent;
  let fixture: ComponentFixture<SelectedGiftCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedGiftCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedGiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
