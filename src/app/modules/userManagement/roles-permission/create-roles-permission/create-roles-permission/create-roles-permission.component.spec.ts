import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRolesPermissionComponent } from './create-roles-permission.component';

describe('CreateRolesPermissionComponent', () => {
  let component: CreateRolesPermissionComponent;
  let fixture: ComponentFixture<CreateRolesPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRolesPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRolesPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
