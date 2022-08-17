import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCardTemplateComponent } from './search-card-template.component';

describe('SearchCardTemplateComponent', () => {
  let component: SearchCardTemplateComponent;
  let fixture: ComponentFixture<SearchCardTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCardTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCardTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
