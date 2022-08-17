import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUploadedFilesComponent } from './search-uploaded-files.component';

describe('SearchUploadedFilesComponent', () => {
  let component: SearchUploadedFilesComponent;
  let fixture: ComponentFixture<SearchUploadedFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchUploadedFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUploadedFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
