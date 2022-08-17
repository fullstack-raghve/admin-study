import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateFileGalleryComponent } from './create-file-gallery.component';
describe('CreateFileUploadComponent', () => {
  let component: CreateFileGalleryComponent;
  let fixture: ComponentFixture<CreateFileGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFileGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFileGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
