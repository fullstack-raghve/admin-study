import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBrandsComponent } from './edit-brands.component';

describe('EditBrandsComponent', () => {
  let component: EditBrandsComponent;
  let fixture: ComponentFixture<EditBrandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBrandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
