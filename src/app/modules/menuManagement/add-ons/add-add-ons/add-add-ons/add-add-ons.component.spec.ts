import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddOnsComponent } from './add-add-ons.component';

describe('AddAddOnsComponent', () => {
  let component: AddAddOnsComponent;
  let fixture: ComponentFixture<AddAddOnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAddOnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddOnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
