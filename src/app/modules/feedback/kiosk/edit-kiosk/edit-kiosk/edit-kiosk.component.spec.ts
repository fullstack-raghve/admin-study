import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKioskComponent } from './edit-kiosk.component';

describe('EditKioskComponent', () => {
  let component: EditKioskComponent;
  let fixture: ComponentFixture<EditKioskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditKioskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
