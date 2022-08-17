import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVariantsComponent } from './view-variants.component';

describe('ViewVariantsComponent', () => {
  let component: ViewVariantsComponent;
  let fixture: ComponentFixture<ViewVariantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVariantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
