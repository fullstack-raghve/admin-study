import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedstoreDataComponent } from './selectedstore-data.component';

describe('SelectedstoreDataComponent', () => {
  let component: SelectedstoreDataComponent;
  let fixture: ComponentFixture<SelectedstoreDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedstoreDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedstoreDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
