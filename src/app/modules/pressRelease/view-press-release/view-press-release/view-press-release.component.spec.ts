import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPressReleaseComponent } from './view-press-release.component';

describe('ViewPressReleaseComponent', () => {
  let component: ViewPressReleaseComponent;
  let fixture: ComponentFixture<ViewPressReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPressReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPressReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
