import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNpsDesignComponent } from './view-nps-design.component';

describe('ViewNpsDesignComponent', () => {
  let component: ViewNpsDesignComponent;
  let fixture: ComponentFixture<ViewNpsDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNpsDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNpsDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
