import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBurnRuleComponent } from './add-burn-rule.component';

describe('AddBurnRuleComponent', () => {
  let component: AddBurnRuleComponent;
  let fixture: ComponentFixture<AddBurnRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBurnRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBurnRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
