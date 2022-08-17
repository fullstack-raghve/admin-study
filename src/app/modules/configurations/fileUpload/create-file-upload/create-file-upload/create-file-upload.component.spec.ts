import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFileUploadComponent } from './create-file-upload.component';

describe('CreateFileUploadComponent', () => {
  let component: CreateFileUploadComponent;
  let fixture: ComponentFixture<CreateFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
