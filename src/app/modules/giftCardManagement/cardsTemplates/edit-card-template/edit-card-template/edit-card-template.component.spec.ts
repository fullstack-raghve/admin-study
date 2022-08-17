import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCardTemplateComponent } from './edit-card-template.component';

describe('EditCardTemplateComponent', () => {
  let component: EditCardTemplateComponent;
  let fixture: ComponentFixture<EditCardTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCardTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCardTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
