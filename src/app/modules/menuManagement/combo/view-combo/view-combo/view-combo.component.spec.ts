import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComboComponent } from './view-combo.component';

describe('ViewComboComponent', () => {
  let component: ViewComboComponent;
  let fixture: ComponentFixture<ViewComboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewComboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
