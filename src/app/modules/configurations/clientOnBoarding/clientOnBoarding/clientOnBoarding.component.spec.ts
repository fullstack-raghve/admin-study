import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { clientOnBoardingComponent } from './clientOnBoarding.component';

describe('clientOnBoardingComponent', () => {
  let component: clientOnBoardingComponent;
  let fixture: ComponentFixture<clientOnBoardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ clientOnBoardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(clientOnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
