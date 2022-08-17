import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultiselectComponent } from './add-multiselect.component';

describe('AddMultiselectComponent', () => {
  let component: AddMultiselectComponent;
  let fixture: ComponentFixture<AddMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
