import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBrandComponent } from './view-brand-management.component';

describe('ViewMemberComponent', () => {
  let component: ViewBrandComponent;
  let fixture: ComponentFixture<ViewBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
