import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TierQualificationComponent } from './tier-qualification.component';

describe('TierQualificationComponent', () => {
  let component: TierQualificationComponent;
  let fixture: ComponentFixture<TierQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TierQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TierQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
