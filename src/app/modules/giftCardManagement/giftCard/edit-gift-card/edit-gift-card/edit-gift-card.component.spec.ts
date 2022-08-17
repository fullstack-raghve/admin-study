import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGiftCardComponent } from './edit-gift-card.component';

describe('EditGiftCardComponent', () => {
  let component: EditGiftCardComponent;
  let fixture: ComponentFixture<EditGiftCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGiftCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
