import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBurnRuleComponent } from './edit-burn-rule.component';

describe('EditBurnRuleComponent', () => {
  let component: EditBurnRuleComponent;
  let fixture: ComponentFixture<EditBurnRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBurnRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBurnRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
