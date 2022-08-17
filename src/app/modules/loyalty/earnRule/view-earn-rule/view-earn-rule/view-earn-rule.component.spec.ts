import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEarnRuleComponent } from './view-earn-rule.component';

describe('ViewEarnRuleComponent', () => {
  let component: ViewEarnRuleComponent;
  let fixture: ComponentFixture<ViewEarnRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEarnRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEarnRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
