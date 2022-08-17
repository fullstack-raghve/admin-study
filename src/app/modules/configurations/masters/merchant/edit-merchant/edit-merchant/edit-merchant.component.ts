import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';

import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'edit-merchant',
  templateUrl: './edit-merchant.component.html',
  styleUrls: ['./edit-merchant.component.scss']
})
export class EditMerchantComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Configurations',
    link: '/search-cuisine'
  }
  ];
  checked = true;
  disabled = false;
  @ViewChild("createMerchantForm") createMerchantForm;
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  merchantFormGroup: FormGroup;
  public showError: boolean = false;
  public loading: boolean = false;
  public showCityError: boolean = false;
  public statusValue: string = 'ONLINE';
  public matcher;
  public toggleVal: boolean = true;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public cityArr: any = [];
  public merchantLocales: any = [];
  public arr: any = [];
  public countries: any = [];
  public alignCss = [];
  public imagePath: string = '';
  public imageUploading: boolean = false;
  public showImageError: boolean = false;
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  public imageErrMsg;
  public showImage = false;
  public imageErrStatus :boolean;

  constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, public snackBar: MatSnackBar,private uploadFile: UploadFile ) {
    this.buildCreateCityForm();
  }

  ngOnInit() {
    this.merchantLocale();
    this.getAllCountries();
  }
  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
  }
  public buildCreateCityForm() {
    let form = {
      merchantLocale: this.fb.array([]),
      merchantCode: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9]{1,20}$")])],
      country: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9 ]{1,20}$")])],
    }
    this.merchantFormGroup = this.fb.group(form);
  }
  public merchantLocale() {
    console.log("size = " + this.languageList.length);
    const control = <FormArray>this.merchantFormGroup.controls['merchantLocale'];
    for (let ln of this.languageList) {
      let arr = this.fb.group({
        merchantName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z\u0600-\u06FF \"\'&(),.-:?_]*')])]
      });
      control.push(arr);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
    }
  }

  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.http.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        console.log(response);
        this.countries = response;

      })
  }

  createMerchant(formData) {
    this.merchantLocales = [];
    if (this.merchantFormGroup.invalid == true) {
      this.showError = true;
    }
    else {
      this.loading = true;
      this.showError = false;

      formData.merchantLocale.forEach((city, index) => {
        this.merchantLocales.push({
          merchantName: city.merchantName,
          languageId: this.languageList[index].languageId
        })
      })

      let createCityReq = {
        merchantLocales: this.merchantLocales,
        merchantCode: formData.merchantCode,
        countryId: parseInt(formData.country),
        status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
      }
      let CREATE_CITY = environment.APIEndpoint + "api/rpa/master/city/v1/create";
      this.http.postJson(CREATE_CITY, createCityReq)
        .subscribe((response) => {
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "City master has been added successfully"
            }
          });
          this.loading = false;
          this.router.navigate(['/search-cities']);
        }
          , err => {
            this.loading = false;
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

  public uploadImage(event: FileList) {
    this.imageUploading = true;
    if (event[0].size < 1000000) {
        if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
            if (event[0].size < 1000000) {
                this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
                    .subscribe((response) => {
                        console.log(response);
                        this.imagePath = response['message'];
                        this.imageUploading = false;
                        this.showImageError = false;
                        this.uploadElRef.nativeElement.value = ''
                        this.imageErrStatus=false;

                        console.log("res ::: " + response)
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "success",
                                message: " image successfully uploaded"
                            }
                        });

                        this.imageAppear();
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
                this.imageUploading = false;
                this.imageErrMsg = "Max upload file size is 1Mb";

            }
        } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Supported format is JPG, JPEG and PNG"
                }
            });
        }
    } else {
        this.imagePath = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
                status: "failure",
                message: "Max upload file size is 1Mb"
            }
        });
    }
}

imageAppear() {
    if (this.imagePath != "") {
        this.showImage=true;
    }
    else {
        this.showImage=false;
    }
}

removeImage() {
    this.showImage=false;
    this.imagePath = '';
    console.log(this.imagePath);
}

formImageStatus(){
  if(this.imagePath =='')
  {
      this.imageErrStatus=true;
  }
  else{
      this.imageErrStatus=false;
  }
}
}
