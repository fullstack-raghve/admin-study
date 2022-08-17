import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPressReleaseComponent } from './edit-press-release.component';

describe('EditPressReleaseComponent', () => {
  let component: EditPressReleaseComponent;
  let fixture: ComponentFixture<EditPressReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPressReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPressReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
