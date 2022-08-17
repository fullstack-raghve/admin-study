import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientOnBoardingComponent } from './view-client-on-boarding.component';

describe('ViewClientOnBoardingComponent', () => {
  let component: ViewClientOnBoardingComponent;
  let fixture: ComponentFixture<ViewClientOnBoardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewClientOnBoardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClientOnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
