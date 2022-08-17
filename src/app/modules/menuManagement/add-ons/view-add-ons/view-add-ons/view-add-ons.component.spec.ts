import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAddOnsComponent } from './view-add-ons.component';

describe('ViewAddOnsComponent', () => {
  let component: ViewAddOnsComponent;
  let fixture: ComponentFixture<ViewAddOnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAddOnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAddOnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
