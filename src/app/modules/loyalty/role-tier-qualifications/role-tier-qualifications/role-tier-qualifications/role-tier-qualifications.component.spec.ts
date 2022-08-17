import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleTierQualificationsComponent } from './role-tier-qualifications.component';

describe('RoleTierQualificationsComponent', () => {
  let component: RoleTierQualificationsComponent;
  let fixture: ComponentFixture<RoleTierQualificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleTierQualificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleTierQualificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
