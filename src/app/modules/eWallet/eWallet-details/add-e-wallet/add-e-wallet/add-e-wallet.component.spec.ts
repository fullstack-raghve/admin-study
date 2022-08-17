import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEWalletComponent } from './add-e-wallet.component';

describe('AddEWalletComponent', () => {
  let component: AddEWalletComponent;
  let fixture: ComponentFixture<AddEWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
