import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEWalletComponent } from './edit-e-wallet.component';

describe('EditEWalletComponent', () => {
  let component: EditEWalletComponent;
  let fixture: ComponentFixture<EditEWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
