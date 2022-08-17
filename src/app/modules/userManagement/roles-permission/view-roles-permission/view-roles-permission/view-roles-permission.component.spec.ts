import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRolesPermissionComponent } from './view-roles-permission.component';

describe('ViewRolesPermissionComponent', () => {
  let component: ViewRolesPermissionComponent;
  let fixture: ComponentFixture<ViewRolesPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRolesPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRolesPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
