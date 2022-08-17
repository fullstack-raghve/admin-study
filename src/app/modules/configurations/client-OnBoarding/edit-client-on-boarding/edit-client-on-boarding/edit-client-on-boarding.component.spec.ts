import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientOnBoardingComponent } from './edit-client-on-boarding.component';

describe('EditClientOnBoardingComponent', () => {
  let component: EditClientOnBoardingComponent;
  let fixture: ComponentFixture<EditClientOnBoardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClientOnBoardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClientOnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
