import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { FormControl, Validators, FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { SnackBarComponent } from "src/app/shared/components/snack-bar/snack-bar.component";
import { Router } from "@angular/router";
import { UploadFile } from 'src/app/services/uploadFile.service';
import { DefaultDialogComponent } from "src/app/modules/feedback/nps-design/default-dialog/default-dialog.component";

@Component({
  selector: 'app-nps-design',
  templateUrl: './nps-design.component.html',
  styleUrls: ['./nps-design.component.scss']
})
export class NpsDesignComponent implements OnInit {

  public breadCrumbData: Array<Object> = [
    {
      title: "Home",
      link: ""
    },
    {
      title: "Feedback",
      link: ""
    },
    {
      title: "NPS Design",
      link: ""
    }
  ];
  public statusValue = "ONLINE";
  public toggleVal = true;

  public npsDesignFormgroup: FormGroup;
  @ViewChild("npsDesignForm") npsDesignForm;

  public kioskBrandLogoPath: any = '';
  public kioskAfterBrandLogoPath: any = '';
  public imgBaseUrl = localStorage.getItem("imgBaseUrl");
  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  @ViewChild('uploadAfterImgEl') uploadAfterImgElRef: ElementRef;
  public imageUploading: boolean = false;
  public showImageError: boolean = false;
  public imgUploaded: boolean = false;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public npsImgLogopathCtrl;
  public imagePath = [];
  public placeholderImg = [];
  public npsAfterImgLogopathCtrl;
  public imageAfterPath = [];
  public placeholderAfterImg = [];

  public showError: boolean = false;
  public imageLoader: boolean = false;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,
    private https: HttpService,
    private uploadFile: UploadFile,
  ) {

  }
  public reactions;
  public colorCodingList;
  public viewNpsDatacolourCodingCreateBean;
  DefaultColor = 'Normal';
  DefaultEmotion = 'Normal';
  ngOnInit() {
    this.getNpsView();
  }
  getNpsViewDefault(type) {
    const dialogRef = this.dialog.open(DefaultDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result != undefined) {
        // this.DefaultColor='Normal';
        // this.DefaultEmotion='Normal';
        if (result.buttonName === 'YES') {
          if (type == 'color') {
            this.DefaultColor = 'Default';
          } else {
            this.DefaultEmotion = 'Defalut';
          }
          if(type == 'emotion'){
            let arr = <FormArray>this.npsDesignFormgroup['controls']['sentimentCreateBean'];
            arr.controls = [];
            this.getGroupData(this.reactions);
          }
          if(type == 'color'){
            let arr = <FormArray>this.npsDesignFormgroup['controls']['colourCodingCreateBean'];
            arr.controls = [];
            this.getGroupColorData(this.colorCodingList);
          }
          // this.npsDesignFormgroup.reset();
          // this.getNpsView();
          if (type == 'color') {
            this.DefaultColor = 'Default';
          } else {
            this.DefaultEmotion = 'Defalut';
          }
        }
      }

    });


  }
  getNpsView() {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/feedback/nps/sentiment/v1/view').subscribe(
      (response) => {
        console.log(response);
        this.reactions = response['sentimentCreateBean'];
        this.colorCodingList = response['colourCodingCreateBean'];
        console.log(this.reactions);
        console.log(this.colorCodingList);

        this.buildNpsDesignForm(this.reactions, this.colorCodingList);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public buildNpsDesignForm(editReactions, editColorCoding) {
    let form = {
      sentimentCreateBean: this.fb.array([]),
      colourCodingCreateBean: this.fb.array([]),
    }
    this.npsDesignFormgroup = this.fb.group(form);
    this.getGroupData(editReactions);
    this.getGroupColorData(editColorCoding);
  }

  public getGroupData(editReactions) {
    console.log(editReactions);
    const control = <FormArray>this.npsDesignFormgroup.controls['sentimentCreateBean'];
    for (let i = 0; i <= this.reactions.length - 1; i++) {
      if (this.DefaultEmotion == 'Normal') {
        let newGroup = this.fb.group({
          id: [editReactions[i].id - 1],
          beforeClickSentimentImage: [editReactions[i].beforeClickSentimentImage],
          afterClickSentimentImage: [editReactions[i].afterClickSentimentImage]
        });
        control.push(newGroup);
      } else {
        let newGroup = this.fb.group({
          id: [editReactions[i].id - 1],
          beforeClickSentimentImage: [editReactions[i].defaultBeforeClickSentimentImage],
          afterClickSentimentImage: [editReactions[i].defaultAfterClickSentimentImage]
        });
        control.push(newGroup);
      }

    }

  }

  public getGroupColorData(editColorCoding) {
    console.log(editColorCoding);
    for (let i = 0; i < this.colorCodingList.length; i++) {
      const control = <FormArray>this.npsDesignFormgroup.controls['colourCodingCreateBean'];
      if (this.DefaultColor == 'Normal') {
        let newGroup = this.fb.group({
          id: [editColorCoding[i].id - 1],
          colourCoding: [editColorCoding[i].colourCoding],
        });
        control.push(newGroup);
      } else {
        let newGroup = this.fb.group({
          id: [editColorCoding[i].id - 1],
          colourCoding: [editColorCoding[i].defaultColourCoding],
        });
        control.push(newGroup);
      }

    }
  }

  // Image Upload 

  public uploadImage(event: FileList, index) {
    this.imageLoader = true;
    console.log(index);
    this.imageUploading = true;
    console.log("event[0].size" + event[0].size)
    if (event[0].size < 1000000) {
      this.uploadFile.upload(event.item(0), 'feedback', 'images')
        .subscribe((response) => {
          console.log(response);
          this.imageLoader = false;
          let kioskBrandLogoPath = response['message'];
          this.npsImgLogopathCtrl = response['message']
          console.log(kioskBrandLogoPath);
          this.npsDesignFormgroup.controls['sentimentCreateBean']['controls'][index]['controls']['beforeClickSentimentImage'].patchValue(this.npsImgLogopathCtrl);
          this.imagePath[index] = response["message"];
          console.log(this.imagePath[index]);
          if (this.imagePath[index] != '') {
            this.placeholderImg[index] = false;
          }
          else {
            this.placeholderImg[index] = true;
          }
          this.imageUploading = false;
          this.showImageError = false;
          this.uploadImgElRef.nativeElement.value = ''
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Image successfully uploaded"
            }
          });
        },
          err => {
            this.imageLoader = false;
            console.log("error Status = " + err);
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
              this.imageLoader = false;
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }

          }
        );
    } else {
      this.imageLoader = false;
      this.imageUploading = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }




  public uploadAfterImage(event: FileList, index) {
    this.imageLoader = true;
    console.log(index);
    this.imageUploading = true;
    console.log("event[0].size" + event[0].size)
    if (event[0].size < 1000000) {
      this.uploadFile.upload(event.item(0), 'feedback', 'images')
        .subscribe((response) => {
          console.log(response);
          let kioskAfterBrandLogoPath = response['message'];
          this.npsAfterImgLogopathCtrl = response['message'];
          console.log(kioskAfterBrandLogoPath);
          this.imageLoader = false;
          this.npsDesignFormgroup.controls['sentimentCreateBean']['controls'][index]['controls']['afterClickSentimentImage'].patchValue(this.npsAfterImgLogopathCtrl);
          this.imageAfterPath[index] = response["message"];
          console.log(this.imageAfterPath[index]);
          if (this.imageAfterPath[index] != '') {
            this.placeholderAfterImg[index] = false;
          }
          else {
            this.placeholderAfterImg[index] = true;
          }
          this.imageUploading = false;
          this.showImageError = false;
          this.uploadAfterImgElRef.nativeElement.value = ''
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Image successfully uploaded"
            }
          });
        },
          err => {
            this.imageLoader = false;
            console.log("error Status = " + err);
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
              this.imageLoader = false;
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }

          }
        );
    } else {
      this.imageUploading = false;
      this.imageLoader = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }

  createnpsDesign() {
    let formData = this.npsDesignFormgroup.value;
    console.log(formData);
    if (this.npsDesignFormgroup.invalid == true) {
      this.showError = true;
    }
    else {
      this.showError = false;
      let createNpsReq = {
        status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
        sentimentCreateBean: formData.sentimentCreateBean,
        colourCodingCreateBean: formData.colourCodingCreateBean
      }
      this.http.postJson(environment.APIEndpoint + 'api/rpa/feedback/nps/sentiment/v1/create', createNpsReq)
        .subscribe((response) => {
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "NPS Design has been added successfully"
            }
          });
          this.router.navigate(['view-nps-Design']);
        },
          (error) => {
            console.log(error);
          });
    }
  }
  public toggleStatus(event) {
    if (event.checked === true) {
      this.statusValue = "ONLINE";
    } else {
      this.statusValue = "OFFLINE";
    }
  }
}
