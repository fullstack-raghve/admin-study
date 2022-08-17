import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGifitingComponent } from './view-gifiting.component';

describe('ViewGifitingComponent', () => {
  let component: ViewGifitingComponent;
  let fixture: ComponentFixture<ViewGifitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGifitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGifitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
