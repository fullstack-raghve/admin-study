import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEWalletComponent } from './create-ewallet.component';

describe('CreateEWalletComponent', () => {
  let component: CreateEWalletComponent;
  let fixture: ComponentFixture<CreateEWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
