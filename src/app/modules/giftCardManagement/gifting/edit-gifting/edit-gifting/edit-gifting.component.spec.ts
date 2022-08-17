import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGiftingComponent } from './edit-gifting.component';

describe('EditGiftingComponent', () => {
  let component: EditGiftingComponent;
  let fixture: ComponentFixture<EditGiftingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGiftingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
