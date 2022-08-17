import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardTemplateComponent } from './add-card-template.component';

describe('AddCardTemplateComponent', () => {
  let component: AddCardTemplateComponent;
  let fixture: ComponentFixture<AddCardTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCardTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCardTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
