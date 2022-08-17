import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEarnRuleComponent } from './add-earn-rule.component';

describe('AddEarnRuleComponent', () => {
  let component: AddEarnRuleComponent;
  let fixture: ComponentFixture<AddEarnRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEarnRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEarnRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
