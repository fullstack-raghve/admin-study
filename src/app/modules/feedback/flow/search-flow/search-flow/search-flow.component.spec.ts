import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFlowComponent } from './search-flow.component';

describe('SearchFlowComponent', () => {
  let component: SearchFlowComponent;
  let fixture: ComponentFixture<SearchFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
