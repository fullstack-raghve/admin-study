import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCardTemplateComponent } from './view-card-template.component';

describe('ViewCardTemplateComponent', () => {
  let component: ViewCardTemplateComponent;
  let fixture: ComponentFixture<ViewCardTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCardTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCardTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
