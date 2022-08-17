import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRolesPermissionComponent } from './search-roles-permission.component';

describe('SearchRolesPermissionComponent', () => {
  let component: SearchRolesPermissionComponent;
  let fixture: ComponentFixture<SearchRolesPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchRolesPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRolesPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
