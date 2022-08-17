import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPressReleaseComponent } from './add-press-release.component';

describe('AddPressReleaseComponent', () => {
  let component: AddPressReleaseComponent;
  let fixture: ComponentFixture<AddPressReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPressReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPressReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
