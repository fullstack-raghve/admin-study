import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'edit-about-us',
  templateUrl: './edit-about-us.component.html',
  styleUrls: ['./edit-about-us.component.scss']
})
export class EditAboutUsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'About Us',
    link: ''
  },
  ];
  public langfieldname = [];
  public alignCss = [];
  @ViewChild("createAboutUsForm") createAboutUsForm;
  editFormGroup: FormGroup;
  public showError: boolean = false;
  public loading: boolean = false;
  public toggleVal: boolean = true;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public id;
  checked = true;
  disabled = false;
  imgUpload = false;
  public imageUploading: boolean = false;
  public imagePath = [];
  public imageErr = [];
  public imageErrMsg = [];
  public showImageError: boolean = false;
  public localesList = [];
  public buildFlag = false;
  public viewData = [];
  module = '';
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  isEdit = false;
  placeholder = 'Content For';
  buttonVal = 'ADD';
  public countryList;
  public contentForList;
  public uploadFlag = [];
  public storeLocalesArr = [];
  public imgUploadList = false;
  public keywordArray = [];
  public fullImagePath = [];
  public storeImgFlag = [];
  public uploadError = [];
  public uploadErrorTwo = [];
  public aboutUsLocales: any = [];

  @ViewChild('uploadImgEl') uploadImgEl: ElementRef;
  @ViewChild('uploadEl') uploadEl: ElementRef;
  imgPath: any;
  imgTwoPath: any;

  constructor(private fb: FormBuilder, private http: HttpService, private uploadFile: UploadFile,
    private router: Router, private activatedRoute: ActivatedRoute, public snackBar: MatSnackBar) {
    this.activatedRoute.params.subscribe((params) => {
      // this.id = params.id;
      this.module = params.module;
    });
    this.getCountryList();
    let viewData = localStorage.getItem('AboutUsEditId');
        if(viewData){
          this.id = viewData.split('-')[0];
            this.module = viewData.split('-')[1];
          // this.id=Number(Id);
          localStorage.removeItem('AboutUsEditId')
          this.getViewAboutUsData();
        }else{
            sessionStorage.clear();
          this.router.navigate(['/search-about-us'])
        }
    let data = []
    this.buildEditAboutUsForm(data);
  }
  //image upload

  getCountryList() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.http.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countryList = response;

      })
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

  public buildEditAboutUsForm(viewData) {
    if (viewData.length == 0) {
      let form = {
        aboutUsFormArray: this.fb.array([]),
        countryId: ["", Validators.required],
        contentFor: ["", Validators.required]
      }
      this.editFormGroup = this.fb.group(form);
    } else {
      this.buildFlag = true;
      this.editFormGroup = this.fb.group({
        aboutUsFormArray: this.fb.array([]),
        countryId: [viewData.countryId.toString(), Validators.required],
        contentFor: [this.module == 'edit' ? viewData.aboutUsCategoryId.toString() : "", Validators.required]
      })
      for (let i = 0; i < viewData.aboutUsLocales.length; i++) {
        const control = <FormArray>this.editFormGroup.controls['aboutUsFormArray'];
        let newGroup = this.fb.group({
          content: [viewData.aboutUsLocales[i].content, Validators.compose([Validators.required])],
          videoUrl: [viewData.aboutUsLocales[i].videoUrl, Validators.compose([Validators.minLength(8)])],
          listImage: [],
          detailImage: []
        });

        control.push(newGroup);
        // this.imagePath.push(viewData.aboutUsLocales[i].imgPath);
        // this.fullImagePath.push(viewData.aboutUsLocales[i].imgTwoPath);
        for (let l of this.languageList) {
          this.uploadFlag.push(false);
          this.storeImgFlag.push(false);
          this.uploadError.push(false);
          this.uploadErrorTwo.push(false);
        }
        for (let i = 0; i < this.languageList.length; i++) {
          this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
          this.langfieldname.push(this.languageList[i].direction == 'RTL' ? 'lang-field-right' : '');
        }
      }
    }
  }

  public getViewAboutUsData() {
    let GET_PRESS_RELEASE_BY_ID = environment.APIEndpoint + "api/rpa/aboutus/v1/view";
    let data = {
      "aboutUsId": parseFloat(this.id)
    }
    this.http.postJson(GET_PRESS_RELEASE_BY_ID, data)
      .subscribe((response: any) => {
        this.viewData = response;

        for (let i = 0; i < response.aboutUsLocales.length; i++) {
          this.imagePath[i] = response.aboutUsLocales[i].imgPath;
          if (this.imagePath[i] != '')
            this.uploadFlag[i] = true
        }
        for (let i = 0; i < response.aboutUsLocales.length; i++) {
          this.fullImagePath[i] = response.aboutUsLocales[i].imgTwoPath;
          if (this.fullImagePath[i] != '')
            this.storeImgFlag[i] = true
        }

        this.buildEditAboutUsForm(this.viewData);
        if (this.module == 'edit') {
          this.isEdit = true;
          this.placeholder = this.viewData['contentFor'];
          this.buttonVal = 'UPDATE';
        }


      }
        , err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
        });
  }

  ngOnInit() {
    this.expandDataEmail();
  }

  public uploadImage(event: FileList, i) {
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
          .subscribe((response) => {
            this.imagePath[i] = response['message'];
            this.uploadFlag[i] = true;
            this.uploadError[i] = false;
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
    if (event[0].size < 5000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'store360', 'images')
          .subscribe((response) => {
            this.fullImagePath[i] = response['message'];
            this.storeImgFlag[i] = true;
            this.uploadErrorTwo[i] = false;
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
    this.imagePath[index] = '';
    this.uploadFlag[index] = false;
    const control = this.editFormGroup.get('aboutUsFormArray') as FormArray;
    control.at(index).get('listImage').setValue('');
  }

  public removeDetailImage(index) {
    this.fullImagePath[index] = "";
    this.storeImgFlag[index] = false;
    const control = this.editFormGroup.get('aboutUsFormArray') as FormArray;
    control.at(index).get('detailImage').setValue('');
  }

  editAboutUs(formData) {
    if (this.imagePath.length > 0) {
      for (let i = 0; i < formData.aboutUsFormArray.length; i++) {
        if (this.imagePath[i] == '') {
          this.uploadError[i] = true;
          this.showError = true;
        }
      }
    }
    if (this.fullImagePath.length > 0) {
      for (let i = 0; i < formData.aboutUsFormArray.length; i++) {
        if (this.fullImagePath[i] == '') {
          this.uploadErrorTwo[i] = true;
          this.showError = true;
        }
      }
    }

    // if (this.editFormGroup.invalid == true) {
    //   this.showError = true;
    // }
    // else {
    this.loading = true;
    this.showError = false;
    let locales = [];
    for (var i = 0; i < formData.aboutUsFormArray.length; i++) {
      if (formData.aboutUsFormArray[i].content !== '') {
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

    let createAboutUsReq;
    let url = '';
    if (this.module == 'edit') {
      createAboutUsReq = {
        aboutUsId: this.id,
        countryId: this.viewData['countryId'],
        aboutUsCategoryId: this.viewData['aboutUsCategoryId'],
        status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
        aboutUsLocales: locales
      }
      url = environment.APIEndpoint + "api/rpa/aboutus/v1/update"
    } else {
      createAboutUsReq = {
        countryId: parseFloat(formData.countryId),
        aboutUsCategoryId: parseFloat(formData.contentFor),
        status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
        aboutUsLocales: locales
      }
      url = environment.APIEndpoint + "api/rpa/aboutus/v1/create"
    }

    this.http.postJson(url, createAboutUsReq).subscribe((response) => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "success",
          message: "About Us is updated successfully"
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
// }

