import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsDesignComponent } from './nps-design.component';

describe('NpsDesignComponent', () => {
  let component: NpsDesignComponent;
  let fixture: ComponentFixture<NpsDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
