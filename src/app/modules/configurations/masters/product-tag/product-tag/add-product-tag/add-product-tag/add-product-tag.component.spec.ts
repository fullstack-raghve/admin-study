import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductTagComponent } from './add-product-tag.component';

describe('MastersComponent', () => {
  let component: AddProductTagComponent;
  let fixture: ComponentFixture<AddProductTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
