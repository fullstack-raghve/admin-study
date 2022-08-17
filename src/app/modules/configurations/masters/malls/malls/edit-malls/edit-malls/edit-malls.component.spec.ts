import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMallsComponent } from './edit-malls.component';

describe('EditMallsComponent', () => {
  let component: EditMallsComponent;
  let fixture: ComponentFixture<EditMallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
