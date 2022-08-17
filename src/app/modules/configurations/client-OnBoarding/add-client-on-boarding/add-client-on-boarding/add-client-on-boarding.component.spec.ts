import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientOnBoardingComponent } from './add-client-on-boarding.component';

describe('AddClientOnBoardingComponent', () => {
  let component: AddClientOnBoardingComponent;
  let fixture: ComponentFixture<AddClientOnBoardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClientOnBoardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClientOnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
