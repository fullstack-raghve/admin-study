import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGiftcardTemplateComponent } from './select-giftcard-template.component';

describe('SelectGiftcardTemplateComponent', () => {
  let component: SelectGiftcardTemplateComponent;
  let fixture: ComponentFixture<SelectGiftcardTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGiftcardTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGiftcardTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
