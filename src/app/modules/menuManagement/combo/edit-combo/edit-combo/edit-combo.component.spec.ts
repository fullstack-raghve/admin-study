import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComboComponent } from './edit-combo.component';

describe('EditComboComponent', () => {
  let component: EditComboComponent;
  let fixture: ComponentFixture<EditComboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditComboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
