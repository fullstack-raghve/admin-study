import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewKioskComponent } from './view-kiosk.component';

describe('ViewKioskComponent', () => {
  let component: ViewKioskComponent;
  let fixture: ComponentFixture<ViewKioskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewKioskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewKioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
