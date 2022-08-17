import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { uploadBonusFile } from 'src/app/services/uploadBonus.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { AddDirectoryDialogComponent } from '../add-directory-dialog/add-directory-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-create-file-gallery',
  templateUrl: './create-file-gallery.component.html',
  styleUrls: ['./create-file-gallery.component.scss'],
})

export class CreateFileGalleryComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Configurations',
    link: ''
  },
  {
    title: 'File Gallery',
    link: ''
  },
  ];
  name: any;
  directoryName: any;
  public imageUploading: boolean = false;
  public imagePath: any = [];
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  imageErrMsg: string;
  createFileGalleryFormGroup: FormGroup;
  directoryList: any[];
  directoryFilesList: any[];
  directories: any;
  selectedImages: any;
  imageGallery: any;
  imagesAdded: any;
  public imagesTobeDisplayed: any = [];
  selectedIndex: number = null;

  page = 0;
  size = 4;
  data = [];

  constructor(private fb: FormBuilder, public dialog: MatDialog,private http: HttpService,
    private router: Router, public uploadBonusFile: uploadBonusFile, public snackBar: MatSnackBar,
    private https: HttpService, private uploadFile: UploadFile, ) {

  }

  ngOnInit() {
    this.getAllDirectories();
  this.buildCreateGalleryForm();
  this.getData({pageIndex: this.page, pageSize: this.size});
  }

  getAllDirectories() {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/master/fileGallery/v1/getDirectories')
      .subscribe((response) => {
        this.directoryList = response;
        this.directories =this.directoryList['directories'];
      })
  }

  public buildCreateGalleryForm() {
    this.createFileGalleryFormGroup = this.fb.group({
      galleryLocaleBean: this.fb.array([]),
    });
    for (let l of this.directoryList) {
      this.imagePath.push('');
    }
  }

  public galleryLocaleBeanFormArray() {
    const control = <FormArray>this.createFileGalleryFormGroup.controls['galleryLocaleBean'];
    for (let i = 0; i <this.imageGallery.length; i++) {
      const newForm = this.fb.group({
        image: '',
        thumbImage:'',
        alt:''
      });
      control.push(newForm);
   }
  }

 
  setIndex(index: number) {
    this.selectedIndex = index;
 }

  getFilesFromDirectories(directory,index) {
    directory.active = !directory.active;
    this.directoryName = directory.directoryName;
    this.http.getJson(environment.APIEndpoint + 'api/rpa/master/fileGallery/v1/getFilesFromDirectory?directoryPath=wsstore/fileGallery/' + this.directoryName)
      .subscribe((response) => {
        this.directoryFilesList = response;
        this.imageGallery = this.directoryFilesList['files'];
        if(directory.active){
        for(let i=0;i< this.imageGallery.length;i++){
          let imageObject = {
          image :this.imageGallery[i].filePath,
          thumbImage : this.imageGallery[i].filePath,
          alt: ''
          }
         this.imagesTobeDisplayed.push(imageObject);
        };
      }
      })
  }

  getData(obj) {
    let index=0,
        startingIndex=obj.pageIndex * obj.pageSize,
        endingIndex=startingIndex + obj.pageSize;

    this.data = this.imagesTobeDisplayed.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  public uploadImage(event: FileList, i,directory) {
    this.imageUploading = true;
    this.directoryName = directory.directoryName;
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
        if (event[0].size < 1000000) {
          this.uploadFile.uploadGallery(event.item(0),this.directoryName)
            .subscribe((response) => {
              this.imagePath[i] = response['message'];
              this.uploadElRef.nativeElement.value = ''
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: " image successfully uploaded"
                }
              });
            }, err => {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }
            )
        } else {
          this.imageUploading[i] = false;
          this.imageErrMsg = "Max upload file size is 1Mb";

        }
      } else {
        this.imagePath[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.imagePath[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }

  openAddDirectoryDialog(): void {
    const dialogRef = this.dialog.open(AddDirectoryDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}