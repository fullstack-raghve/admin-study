import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'add-about-us',
  templateUrl: './add-about-us.component.html',
  styleUrls: ['./add-about-us.component.scss']
})
export class AddAboutUsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'About Us',
    link: ''
  },
  ];

  @ViewChild("createAboutUsForm") createAboutUsForm;
  aboutUsFormGroup: FormGroup;
  public showError: boolean = false;
  public loading: boolean = false;
  public toggleVal: boolean = true;
  // public filePathUrl = environment.APIEndpoint + "img/";
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  checked = true;
  disabled = false;
  public imgUpload = false;
  public imgUploadList = false;
  public countryList;
  public contentForList;
  public localesList = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public imageUploading: boolean = false;
  // public imageUploadingTwo: boolean = false;
  public imageErr = [];
  public imageErrMsg = [];
  public showImageError: boolean = false;
  releaseTitle = new FormControl('', [Validators.required]);
  public imagePath: any = [];
  public uploadFlag = [];
  public keywordArray = [];
  public fullImagePath = [];
  public storeImgFlag = [];
  public contentDisplay;
  public langfieldname = [];
  public alignCss = [];
  @ViewChild('uploadImgEl') uploadImgEl: ElementRef;
  @ViewChild('uploadEl') uploadEl: ElementRef;
  message: string;

  constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, private uploadFile: UploadFile, public snackBar: MatSnackBar) {
    this.getCountryList();
    this.buildCreateAboutUsForm();
  }
  getCountryList() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.http.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countryList = response;
      });
  }

  getContentForList(conId) {
    this.contentForList = [];
    if (conId != '') {
      let GET_ALL_CONTENT = environment.APIEndpoint + "api/rpa/aboutus/v1/get/contentFor?countryId=" + conId;
      this.http.getJson(GET_ALL_CONTENT)
        .subscribe((response) => {
          this.contentForList = response;
        })
    }
  }

  getLocales(contentId) {    
    this.localesList = [];
    if (contentId != '') {
      let GET_CONTENT_BY_ID = environment.APIEndpoint + "api/rpa/master/aboutus/category/v1/view";
      let request = {
        aboutUsCategoryId: contentId
      }
      this.http.postJson(GET_CONTENT_BY_ID, request).subscribe((response) => {
        this.localesList = response['aboutUsCategoryLocales'];
        this.getGroupData();
      })
    }
  }

  ngOnInit() {
  }

  public buildCreateAboutUsForm() {
    let form = {
      aboutUsFormArray: this.fb.array([]),
      countryId: ["", Validators.required],
      contentFor: ["", Validators.required],
    }
    this.aboutUsFormGroup = this.fb.group(form);
    for (let l of this.languageList) {
      this.uploadFlag.push(false);
      this.storeImgFlag.push(false);
      this.imagePath.push('');
      this.fullImagePath.push('');
    }
  }

  public getGroupData() {
    for (let ln of this.languageList) {
      const control = <FormArray>this.aboutUsFormGroup.controls['aboutUsFormArray'];
      let newGroup = this.fb.group({
        content: ["", Validators.compose([Validators.required])],
        videoUrl: ["", Validators.compose([Validators.minLength(8)])],
        listImage: ['', Validators.required],
        detailImage: ['', Validators.required]
      });
      control.push(newGroup);
      this.imagePath.push('');
      this.fullImagePath.push('');
      for (let i = 0; i < this.languageList.length; i++) {
        this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
        this.langfieldname.push(this.languageList[i].direction == 'RTL' ? 'lang-field-right' : '');
      }      
          if (this.languageList.length){
            this.expandDataEmail();
          }
    }
  }

  public uploadImage(event: FileList, i) {
    this.imageUploading = true;
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
          .subscribe((response) => {
            this.imagePath[i] = response['message'];
            this.uploadFlag[i] = true;
            this.uploadEl.nativeElement.value = ''
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          }, err => {
            this.loading = false;
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Supported format is JPG, JPEG and PNG"
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }

          }
          )
      }
      else {
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
  public uploadFullImage(event: FileList, i) {
    this.imageUploading = true;
    if (event[0].size < 5000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'store360', 'images')
          .subscribe((response) => {
            this.fullImagePath[i] = response['message'];
            this.storeImgFlag[i] = true;
            this.uploadImgEl.nativeElement.value = ''
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
      }
      else {
        this.fullImagePath[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.fullImagePath[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 5Mb"
        }
      });
    }
  }

  public removeListImage(index) {
    this.imagePath[index] = "";
    this.uploadFlag[index] = false;
    const control = this.aboutUsFormGroup.get('aboutUsFormArray') as FormArray;
    control.at(index).get('listImage').setValue('');
  }

  public removeDetailImage(index) {
    this.fullImagePath[index] = "";
    this.storeImgFlag[index] = false;
    const control = this.aboutUsFormGroup.get('aboutUsFormArray') as FormArray;
    control.at(index).get('detailImage').setValue('');
  }

  public getSelectedContent(event) {
    let content = this.contentForList.map(i => {
      if (i.aboutUsCategoryId == event.value) {
        return i.contentFor;
      }
    })
    let other;

    [this.contentDisplay, other] = content;
  }

  createAboutUs(formData) {
    if (this.aboutUsFormGroup.invalid == true) {
      this.showError = true;
    }
    else {
      this.loading = true;
      this.showError = false;
      let locales = [];
      for (var i = 0; i < formData.aboutUsFormArray.length; i++) {
        if (formData.aboutUsFormArray[i].content != "") {
          let obj = {
            languageId: this.languageList[i].languageId,
            content: formData.aboutUsFormArray[i].content,
            imgPath: this.imagePath[i],
            imgTwoPath: this.fullImagePath[i],
            videoUrl: formData.aboutUsFormArray[i].videoUrl,

          }
          locales.push(obj);
        }
      }
      let createAboutUsReq = {
        countryId: parseFloat(formData.countryId),
        aboutUsCategoryId: parseFloat(formData.contentFor),
        status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
        aboutUsLocales: locales
      }

      this.http.postJson(environment.APIEndpoint + "api/rpa/aboutus/v1/create", createAboutUsReq)
        .subscribe((response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: `About Us ${this.contentDisplay} is added successfully`
            }
          });
          this.loading = false;
          sessionStorage.clear();
          this.router.navigate(['/search-about-us']);
        }
          , err => {
            this.loading = false;
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Your request cannot be saved at this time. Please try again later"
                }
              });
            }
          })
    }
  }

  expandDataEmail() {
    try {
        // if (this.contentForList.length || this.contentForList.length){
          var allifram = document.getElementById("arabicID");
          var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
          var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
          html_Arabic.setAttribute("style", "direction: rtl;");
        // }
    }
    catch  {

    }
  }
}