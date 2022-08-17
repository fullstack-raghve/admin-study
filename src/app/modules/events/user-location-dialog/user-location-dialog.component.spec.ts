import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocationDialogComponent } from './user-location-dialog.component';

describe('UserLocationDialogComponent', () => {
  let component: UserLocationDialogComponent;
  let fixture: ComponentFixture<UserLocationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLocationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
