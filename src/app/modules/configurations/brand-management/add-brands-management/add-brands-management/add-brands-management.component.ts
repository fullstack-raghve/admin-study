import { OnInit, ViewChild, Output, Input, Component, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { Globals } from 'src/app/services/global';
import { ExtraValidators } from 'src/app/services/validator-service';



// export interface Keywords {
//   name: string;
// }

export interface Cuisine {
  name: string;
}

export interface Cuisine {
  nameCuisine: string;
}

export interface Keyword {
  name: string;
}


@Component({
  selector: 'add-brands-management',
  templateUrl: './add-brands-management.component.html',
  styleUrls: ['./add-brands-management.component.scss']
})
export class AddBrandsComponent implements OnInit {
  brandCode = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  public imgUpload = false;
  public imgUploadArabic = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  public toggleVal: boolean = true;
  public groupByAR: boolean;
  cuisines = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  public breadCrumbData: Array<Object> = [{
    title: 'Brand Management',
    link: ''
  }, {
    title: 'Add Brand',
    link: 'add-brands-management'
  }
  ];


  @ViewChild(SelectAutocompleteComponent) multiSelect: SelectAutocompleteComponent;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public brandsFormGroup: FormGroup;
  public showError: boolean = false;
  public brandCategories: any = [];
  public countries: any = [];
  public alignCss = [];
  public fieldright = [];
  public alignCssAr = [];
  public imageUploading: boolean = false;
  public uploadFlag = [];
  public uploadError = [];
  public uploadLogoFlag = [];
  public uploadLogoError = [];
  public brandLogoImagePath: any = [];
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public imagePath: any = [];
  public showImageError: boolean = false;
  public loading: boolean = false;

  public keywordArray = [];
  public keywordErrorMsg = [];
  public requiredKeywordError = [];

  public brandLocaleArray;
  public brandRegionLocaleArray;
  public brandRegionArray;
  public statusValue: string = 'ONLINE';
  public checked = true;
  public isStoreType = false;
  public priceForTwoRequired = false;
  public cuisineRequired = false;
  public keywordRequired = false;
  public keywordEmptyErrors = [];
  public priceForTwoVal: string = '';
  public enteredBrandCode: string = '';
  public brandCodeList: any = [];
  public brandData;
  public malls = [];
  @Input() required: boolean = false;
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  @ViewChild('uploadBrandLogoEl') uploadBrandLogoElRef: ElementRef;

  constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, private uploadFile: UploadFile, public snackBar: MatSnackBar, private https: HttpService) {
    this.buildCreateBrandsForm();
  }

  ngOnInit() {
    this.getAllCountries();
    this.getBrandCategories();
    this.brandLocale();
    this.brandRegionLocale();
  }


  categories1 = [];
  getBrandCategories() {
    let GET_BRAND_CATEGORIES = "api/rpa/master/brandCategory/v1/get/categories"
    this.https.getJson(environment.APIEndpoint + GET_BRAND_CATEGORIES).subscribe(
      (response) => {
        this.brandCategories = response;
        this.brandCategories.forEach(res => {
          this.categories1.push({
            "categoryCode": res.categoryCode,
            "categoryId": res.categoryId,
            "categoryImgPath": res.categoryImgPath,
            "categoryTitle": res.categoryTitle,
            "languageDirection": res.languageDirection,
            "status": res.status,
            "value": res.categoryId
          });
        });
      })
  }




  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.http.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countries = response;
      })
  }

  malls1 = [];
  getMallList(countryId) {
    let GET_MALL = environment.APIEndpoint + "api/rpa/master/mall/v1/getMallByRegion";
    this.http.getJson(GET_MALL + '?countryOid=' + countryId)
      .subscribe((response) => {
        this.malls = response;
        this.malls.forEach(res => {
          this.malls1.push({
            "languageDirection": res.languageDirection,
            "mallcode": res.mallCode,
            "mallId": res.mallId,
            "mallName": res.mallName,
            "status": res.status,
            "value": res.mallId
          });
        });
      })
  }

  public buildCreateBrandsForm() {
    if (this.brandData == undefined) {
      this.brandsFormGroup = this.fb.group({
        brandsLocale: this.fb.array([]),
        brandsRegionLocale: this.fb.array([]),
        brandCode: ["", Validators.required],
        country: ["", Validators.required],
        mallName: ["", Validators.required],
        brandCategories: ["", Validators.required],
        priceForTwo: ["",],
        brandType: ["",],
        cuisine: [""],
        activeDays: ["",]
      });
    } else {
      let data = this.brandsFormGroup.value
      this.brandsFormGroup = this.fb.group({
        brandsLocale: this.fb.array([]),
        brandsRegionLocale: this.fb.array([]),
        brandCode: [this.brandData.brandCode, Validators.required],
        country: [data.country, Validators.required],
        brandCategories: [data.brandCategories, Validators.required],
        priceForTwo: [this.brandData.priceForTwo,],
        brandType: [this.brandData.brandType,],
        cuisine: [""],
        activeDays: [],
        mallName: [data.mallName, Validators.required],
      });
      this.cuisines = this.brandData.cuisines;
          
    }
    for (let i = 0; i < this.languageList.length; i++) {
      this.uploadFlag.push(false);
      this.uploadError.push(false);
      this.keywordEmptyErrors[i] = false;
      this.imagePath.push('');
      this.uploadLogoFlag.push(false);
      this.uploadLogoError.push(false);
      this.brandLogoImagePath.push('');
    }
  }

  public brandLocale() {
    this.brandLogoImagePath = [];
    const control = <FormArray>this.brandsFormGroup.controls['brandsLocale'];
    if (this.brandData == undefined) {
      for (let i = 0; i < this.languageList.length; i++) {

        if (this.languageList[i].languageCode == 'AR') {
          this.groupByAR = true;
          this.required = true;
          //this.brandsFormGroup.get('groupBy').setValidators([Validators.required, Validators.pattern(Globals.regOnlyArabic)]);
          // this.brandsFormGroup.get('groupBy').updateValueAndValidity();
        } else {
          this.groupByAR = false;
          this.required = false;
        }
        let arr = this.fb.group({
          brandName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
          brandLogoImage: [''],
          // groupBy: ['',Validators.pattern(Globals.regOnlyArabic)]
          groupBy: ['', Validators.compose([Validators.pattern(Globals.regOnlyArabic),ExtraValidators.conditional(group => this.languageList[i].languageCode == 'AR', Validators.required)])],
        });
        control.push(arr);
        this.brandLogoImagePath.push('');
        this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
        this.alignCssAr.push(this.languageList[i].direction == 'RTL' ? 'text-right' : 'd-none');
        // this.alignCssAr.push(this.languageList[i].direction == 'LTR' ? 'd-none' : '');
      }
    } else {
      for (let brand of this.brandData.brandLocales) {
        let arr = this.fb.group({
          brandName: [brand.brandName, Validators.compose([Validators.required, Validators.minLength(2)])],
          brandLogoImage: [''],
          groupBy: ['',Validators.pattern(Globals.regOnlyArabic)]
        });
        control.push(arr);
        this.brandLogoImagePath.push('');
        this.alignCss.push(brand.languageDirection == 'RTL' ? 'text-right' : '');
      }
    }
  }

  public brandRegionLocale() {
    this.imagePath = [];
    const control = <FormArray>this.brandsFormGroup.controls['brandsRegionLocale'];
    for (let ln of this.languageList) {
      let arr = this.fb.group({
        content: ['', Validators.required],
        brandImage: [],
        brandVideo: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
        keywords: ['',]
      });
      control.push(arr);
      this.keywordArray.push({
        keyword: []
      });
      this.imagePath.push('');
      this.requiredKeywordError.push(false);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
      this.fieldright.push(ln.direction == 'RTL' ? 'right-field-right' : '');
    }
  }

  // baseUrlEnglish:any = '';
  // uploadImageEnglish(event) {
  //   if (event.target.files && event.target.files[0]) {
  //     this.imgUpload = true;
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     reader.onload = (event) => {
  //       this.baseUrlEnglish = <string>reader.result;

  //     }
  //   }
  // }


  // removeBrandImageEnglish(){
  //   this.baseUrlEnglish='';
  // }

  // baseUrlArabic:any = '';
  // uploadImageArabic(event) {
  //   if (event.target.files && event.target.files[0]) {
  //     this.imgUploadArabic = true;
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     reader.onload = (event) => {
  //       this.baseUrlArabic = <string>reader.result;

  //     }
  //   }
  // }

  public uploadImage(event: FileList, i) {
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'brand', 'images')
          .subscribe((response) => {
            this.imagePath[i] = response['message'];
            this.uploadFlag[i] = true;
            this.uploadError[i] = false;
            this.uploadElRef.nativeElement.value = ''
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

  public uploadBrandLogo(event: FileList, i) {
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'brand', 'images')
          .subscribe((response) => {
            this.brandLogoImagePath[i] = response['message'];
            this.uploadLogoFlag[i] = true;
            this.uploadLogoError[i] = false;
            this.showError = false;
            this.uploadBrandLogoElRef.nativeElement.value = ''
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
        this.brandLogoImagePath[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.brandLogoImagePath[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }

  public removeLogo(index) {
    this.brandLogoImagePath[index] = "";
    this.uploadLogoFlag[index] = false;
    const control = this.brandsFormGroup.get('brandsLocale') as FormArray;
    control.at(index).get('brandLogoImage').setValue('');
  }
  public removeImage(index) {
    this.imagePath[index] = "";
    this.uploadFlag[index] = false;
    const control = this.brandsFormGroup.get('brandsRegionLocale') as FormArray;
    control.at(index).get('brandImage').setValue('');
  }

  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our fruit
  //   if ((value || '').trim()) {
  //   this.keywordData.push({name: value.trim()});
  // }

  // // Reset the input value
  // if (input) {
  // input.value = '';
  // }
  // }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our cuisine
    if ((value || '').trim()) {
           this.cuisines.push(value.trim());
         }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  // remove(keyword: Keywords): void {
  //   const index = this.keywordData.indexOf(keyword);

  //   if (index >= 0) {
  //     this.keywordData.splice(index, 1);
  //   }
  // }

  remove(cuisine: Cuisine): void {
       const index = this.cuisines.indexOf(cuisine);

    if (index >= 0) {
      this.cuisines.splice(index, 1);
    }
     }

  // addArabic(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   if ((value || '').trim()) {
  //   this.keywordArabic.push({nameArabic: value.trim()});
  // }

  // // Reset the input value
  // if (input) {
  // input.value = '';
  // }
  // }


  // removeArabic(arabic: KeywordsArabic): void {
  //   const index = this.keywordArabic.indexOf(arabic);

  //   if (index >= 0) {
  //     this.keywordArabic.splice(index, 1);
  //   }
  // }

  //keywords chips
  keywords: Keyword[] = [];

  addKeyword(event: MatChipInputEvent, index): void {
    const input = event.input;
    const value = event.value;

    let regex = /^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*$/;
    if (value != '') {
      let valid = value.match(regex)
      if (!valid) {
        this.keywordErrorMsg[index] = true;
      } else {
        this.keywordErrorMsg[index] = false;
        // Add our keyword
        if ((value || '').trim()) {
          this.keywordArray[index].keyword.push(value.trim());
          this.requiredKeywordError[index] = false;
          this.keywordEmptyErrors[index] = false;
        }
        // this.keywordArray.push()

        // Reset the input value
        if (input) {
          input.value = '';
        }
      }
    }
  }

  removeKeyword(keyword: Keyword, ind): void {
    const index = this.keywordArray[ind].keyword.indexOf(keyword);

    if (index >= 0) {
      this.keywordArray[ind].keyword.splice(index, 1);
    }
  }

  public toggleStatus(event) {
    if (event.checked) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
  }

  checkValidation(brandType) {
    if (brandType == "RETAIL") {
      this.isStoreType = true;
      this.cuisines = [];
    } else {
      this.isStoreType = false;
    }
     }

  validateForm() {
    let storetype = this.brandsFormGroup.get('brandType').value;
    let priceForTwo = this.brandsFormGroup.get('priceForTwo').value;
    if (storetype === 'FB' && ('' == priceForTwo || priceForTwo == undefined)) {
      this.priceForTwoRequired = true;
    } else {
      this.priceForTwoRequired = false;
    }
       if (storetype == 'FB' && this.cuisines.length <= 0) {
      this.cuisineRequired = true;
    } else {
      this.cuisineRequired = false;
    }
  }

  public getBrandCodeList(brandCode) {
    this.enteredBrandCode = brandCode.value;
    this.resetAddBrandForm();
    let GET_BRAND_CODE_BY_BRAND_CODE = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brandCode";
    let request = {
      brandCode: this.enteredBrandCode
    }
    this.http.postJson(GET_BRAND_CODE_BY_BRAND_CODE, request)
      .subscribe((response) => {
        this.brandCodeList = response;
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


  public getBrandDetailsByBrandOid(brandId) {
    let GET_BRAND_BY_BRAND_ID = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandById";
    let request = {
      brandOid: brandId
    }
    this.http.postJson(GET_BRAND_BY_BRAND_ID, request)
      .subscribe((response) => {
        this.brandData = response;
        this.buildCreateBrandsForm();
        this.brandLocale();
        this.brandRegionLocale();

        for (let i = 0; i < this.brandData.brandLocales.length; i++) {
          this.brandLogoImagePath[i] = this.brandData.brandLocales[i].brandLogo;
          if (this.brandLogoImagePath[i] != '')
            this.uploadLogoFlag[i] = true;
        }

        for (let c of this.brandData.brandLocales) {
          this.alignCss.push(c.languageDirection == 'RTL' ? 'text-right' : '');
        }
      }, err => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message: "Your request cannot be saved at this time. Please try again later"
          }
        });
      })
  }

  resetAddBrandForm() {
    this.brandsFormGroup.get('brandType').reset();
    this.brandsFormGroup.get('priceForTwo').reset();
    this.brandsFormGroup.controls['brandsLocale'].reset();
    this.cuisines = [];
    for (let i = 0; i < this.languageList.length; i++) {
      this.brandLogoImagePath[i] = "";
      this.uploadLogoFlag[i] = false;
      this.uploadLogoError[i] = false;
      const control = this.brandsFormGroup.get('brandsLocale') as FormArray;
      control.at(i).get('brandLogoImage').setValue('');
    }
  }

  createBrands(formData) {
    this.brandLocaleArray = [];
   this.brandRegionLocaleArray = [];
   this.brandRegionArray = [];
   if (this.imagePath.length > 0) {
     for (let i = 0; i < formData.brandsRegionLocale.length; i++) {
       if (this.imagePath[i] == '') {
         this.uploadError[i] = true;
         this.showError = true;
       }
     }
   }

   if (this.brandLogoImagePath.length > 0) {
     for (let i = 0; i < formData.brandsLocale.length; i++) {
       if (this.brandLogoImagePath[i] == '') {
         this.uploadLogoError[i] = true;
         this.showError = true;
       }
     }
   }

   for (let i = 0; i < this.keywordArray.length; i++) {
     let keyword = this.keywordArray[i].keyword;
     if (keyword.length == undefined || keyword.length <= 0) {
       this.keywordEmptyErrors[i] = true;
     } else {
       this.keywordEmptyErrors[i] = false;
     }
   }

   let keyWordError = false;
   for (let i = 0; i < this.keywordEmptyErrors.length; i++) {
     if (this.keywordEmptyErrors[i] == true) {
       keyWordError = true;
     }
   }

   if (this.brandsFormGroup.invalid == true) {
     this.showError = true;
     return
   }
   this.loading = true;
   this.showError = false;
   formData.brandsLocale.forEach((brand, index) => {
     let locale = {
       languageId: this.languageList[index].languageId,
       brandName: brand.brandName,
       brandLogo: this.brandLogoImagePath[index],
       groupBy: brand.groupBy != '' ?  brand.groupBy : null
     }
     this.brandLocaleArray.push(locale);
   })

   for (var i = 0; i < formData.brandsRegionLocale.length; i++) {
     let locale = {
       languageId: this.languageList[i].languageId,
       aboutBrand: formData.brandsRegionLocale[i].content,
       brandVideo: formData.brandsRegionLocale[i].brandVideo,
       brandImage: this.imagePath[i],
       keywords: this.keywordArray[i].keyword,
     }
     this.brandRegionLocaleArray.push(locale);
   }

   this.brandRegionArray.push({
     countryOid: formData.country,
     activeDays: formData.activeDays,
     mallOids: formData.mallName
   })

   if (formData.priceForTwo == '') {
     this.priceForTwoVal = null;
   } else {
     this.priceForTwoVal = formData.priceForTwo;
   }
      let requestBody = {
     brandCode: formData.brandCode,
     brandType: formData.brandType,
     priceForTwo: this.priceForTwoVal,
     cuisines: this.cuisines,
     status: this.statusValue,
     brandCategoryIds: formData.brandCategories,
     brandLocales: this.brandLocaleArray,
     brandsRegionLocale: this.brandRegionLocaleArray,
     brandsRegion: this.brandRegionArray
   }

   let CREATE_BRAND = environment.APIEndpoint + "api/rpa/master/brand/v1/create";
   this.https.postJson(CREATE_BRAND, requestBody).subscribe(
     (response) => {
       this.snackBar.openFromComponent(SnackBarComponent, {
         duration: 10000,
         data: {
           status: "success",
           message: "Brand master has been added successfully"
         }
       });
       sessionStorage.clear();
       this.router.navigate(['/search-brand-management']);
     },
     (error) => {
       if (error.error.errorType == 'VALIDATION') {
         this.snackBar.openFromComponent(SnackBarComponent, {
           duration: 10000,
           data: {
             status: "failure",
             message: error.error.errorDetails[0].description
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
     }
   );
 }
}
