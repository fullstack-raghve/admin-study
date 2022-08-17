import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGiftingComponent } from './add-gifting.component';

describe('AddGiftingComponent', () => {
  let component: AddGiftingComponent;
  let fixture: ComponentFixture<AddGiftingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGiftingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
