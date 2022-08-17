import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCartConfigurationComponent } from './edit-cart-configuration.component';

describe('EditCartConfigurationComponent', () => {
  let component: EditCartConfigurationComponent;
  let fixture: ComponentFixture<EditCartConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCartConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCartConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
