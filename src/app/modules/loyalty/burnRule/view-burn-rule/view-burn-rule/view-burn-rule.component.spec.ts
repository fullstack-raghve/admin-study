import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBurnRuleComponent } from './view-burn-rule.component';

describe('ViewBurnRuleComponent', () => {
  let component: ViewBurnRuleComponent;
  let fixture: ComponentFixture<ViewBurnRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBurnRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBurnRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
