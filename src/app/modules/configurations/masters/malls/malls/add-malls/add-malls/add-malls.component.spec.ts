import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMallsComponent } from './add-malls.component';

describe('AddMallsComponent', () => {
  let component: AddMallsComponent;
  let fixture: ComponentFixture<AddMallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
