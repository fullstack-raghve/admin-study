import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRolesPermissionComponent } from './edit-roles-permission.component';

describe('EditRolesPermissionComponent', () => {
  let component: EditRolesPermissionComponent;
  let fixture: ComponentFixture<EditRolesPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRolesPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRolesPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
