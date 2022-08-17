import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEWalletComponent } from './view-ewallet.component';

describe('ViewEWalletComponent', () => {
  let component: ViewEWalletComponent;
  let fixture: ComponentFixture<ViewEWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
