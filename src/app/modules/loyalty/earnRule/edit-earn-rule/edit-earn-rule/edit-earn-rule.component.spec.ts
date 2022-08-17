import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEarnRuleComponent } from './edit-earn-rule.component';

describe('EditEarnRuleComponent', () => {
  let component: EditEarnRuleComponent;
  let fixture: ComponentFixture<EditEarnRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEarnRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEarnRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
