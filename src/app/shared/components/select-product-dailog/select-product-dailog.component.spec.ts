import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProductDailogComponent } from './select-product-dailog.component';

describe('SelectProductDailogComponent', () => {
  let component: SelectProductDailogComponent;
  let fixture: ComponentFixture<SelectProductDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectProductDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProductDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
