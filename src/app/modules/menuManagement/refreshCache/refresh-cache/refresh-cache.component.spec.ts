import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshCacheComponent } from './refresh-cache.component';

describe('RefreshCacheComponent', () => {
  let component: RefreshCacheComponent;
  let fixture: ComponentFixture<RefreshCacheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshCacheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
