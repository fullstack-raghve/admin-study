import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonInvalidCommentsComponent } from './reason-invalid-comments.component';

describe('ReasonInvalidCommentsComponent', () => {
  let component: ReasonInvalidCommentsComponent;
  let fixture: ComponentFixture<ReasonInvalidCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReasonInvalidCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonInvalidCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
