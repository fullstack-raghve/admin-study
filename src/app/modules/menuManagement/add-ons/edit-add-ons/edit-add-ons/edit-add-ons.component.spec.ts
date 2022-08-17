import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddOnsComponent } from './edit-add-ons.component';

describe('EditAddOnsComponent', () => {
  let component: EditAddOnsComponent;
  let fixture: ComponentFixture<EditAddOnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAddOnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAddOnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
