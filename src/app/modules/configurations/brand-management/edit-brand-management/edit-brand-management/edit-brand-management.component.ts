import { OnInit, ViewChild, Output, Input, Component, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { Globals } from 'src/app/services/global';
import { ExtraValidators } from 'src/app/services/validator-service';


export interface Cuisine {
  name: string;
}

export interface Keyword {
  name: string;
}

@Component({
  selector: 'edit-brand-management',
  templateUrl: './edit-brand-management.component.html',
  styleUrls: ['./edit-brand-management.component.scss']
})
export class EditBrandComponent implements OnInit {
  brandCode = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  public imgUpload = false;
  public imgUploadArabic = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  public malls = [];
  public alignCssAr = [];
  public toggleVal: boolean = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public breadCrumbData: Array<Object> = [{
    title: 'Brand Management',
    link: ''
  }, {
    title: 'Edit Brand',
    link: 'edit-brand-management'
  }
  ];
  public brandsFormGroup: FormGroup;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public brandRegionId: number;
  public brandId: number;
  public brandCategories: any = [];
  public countries: any = [];
  public showError: boolean = false;
  public alignCss = [];
  public imageUploading: boolean = false;
  public uploadFlag = [];
  public uploadError = [];
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public imagePath: any = [];
  public showImageError: boolean = false;
  public loading: boolean = false;
  public keywordArray = [];
  public keywordErrorMsg = [];
  public requiredKeywordError = [];
  public buildFlag: boolean = false;
  public brandCat = [];
  public mallVal = [];
  public imagePathLogo: any = [];
  public cuisines = [];
  public brandLocaleArray;
  public brandRegionLocaleArray;
  public brandRegionArray;
  public statusValue: string = 'ONLINE';
  public checked = true;
  public brandData: any = [];
  public countryOidVal;
  public isStoreType = false;
  public priceForTwoRequired = false;
  public cuisineRequired = false;
  public keywordEmptyErrors = [];
  public uploadLogoFlag = [];
  public uploadLogoError = [];
  public brandLogoImagePath: any = [];
  public groupByAR: boolean;
  @Input() required: boolean = false;
  brandLocaleVal;
  groupByVal;

  @ViewChild('uploadEl') uploadElRef: ElementRef;
  @ViewChild('uploadBrandLogoEl') uploadBrandLogoElRef: ElementRef;
  @ViewChild(SelectAutocompleteComponent) multiSelect: SelectAutocompleteComponent;
  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private http: HttpService,
    private router: Router, private uploadFile: UploadFile, public snackBar: MatSnackBar, private https: HttpService) {
    // this.activatedRoute.params.subscribe((params) => {
    //   this.brandRegionId = params.id;
    // });
    let data = localStorage.getItem('BrandManagementEditId');
    if(data){
      this.brandRegionId=Number(data);
      this.getBrandById();
      localStorage.removeItem('BrandManagementEditId')
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-brand-management'])
    }
  }

  ngOnInit() {

    this.getBrandCategories();
    this.getAllCountries();
  }


  // getBrandCategories() {
  //   let GET_BRAND_CATEGORIES = "api/rpa/master/brandCategory/v1/get/categories"
  //   this.https.getJson(environment.APIEndpoint + GET_BRAND_CATEGORIES).subscribe(
  //     (response) => {
  //       this.brandCategories = response;
  //     }
  //   );
  // }
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
      });
  }


  public getBrandById() {
    let GET_BRAND_BY_ID = environment.APIEndpoint + "api/rpa/master/brand/v1/view";
    let request = {
      brandRegionOid: this.brandRegionId
    }
    this.http.postJson(GET_BRAND_BY_ID, request)
      .subscribe((response) => {
        this.brandData = response;
        this.brandId = response['brandOid'];
        this.brandLocaleVal = response['brandLocales'];
        this.checked = response['status'] == 'ONLINE' ? true : false;
        this.buildEditBrandsForm(response);
        this.checkValidation(response['brandType']);
        if(response['cuisines'] && response['cuisines'].length!=0){
          this.cuisines = response['cuisines'];
        }

        for (let i = 0; i < this.brandData.brandsRegionLocale.length; i++) {
          this.imagePath[i] = this.brandData.brandsRegionLocale[i].brandImage;
          if (this.imagePath[i] != '')
            this.uploadFlag[i] = true
        }

        for (let i = 0; i < this.brandData.brandLocales.length; i++) {
          this.brandLogoImagePath[i] = this.brandData.brandLocales[i].brandLogo;
          this.groupByVal = this.brandData.brandLocales[i].groupBy;
          if (this.brandLogoImagePath[i] != '')
            this.uploadLogoFlag[i] = true;
        }

        for (let c of this.brandData.brandLocales) {
          this.alignCss.push(c.languageDirection == 'RTL' ? 'text-right' : '');
        }
        this.brandRegionLocaleArray = response["brandsRegionLocale"];
        for (let b of this.brandRegionLocaleArray) {
          this.alignCss.push(b.languageDirection == 'RTL' ? 'text-right' : '');
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
        })
  }

  public buildEditBrandsForm(editData) {
    if (editData.brandCode == undefined) {
      this.brandsFormGroup = this.fb.group({
        brandsLocale: this.fb.array([]),
        brandsRegionLocale: this.fb.array([]),
        brandCode: ["", Validators.required],
        country: ["", Validators.required],
        brandCategories: ["", Validators.required],
        mallName: ["", Validators.required],
        priceForTwo: ["",],
        brandType: ["",],
        cuisine: [""],
        activeDays: ["",]
      });
    }
    else {
      if (editData.brandCategories != null || editData.brandCategories != undefined) {
        this.brandCat = editData.brandCategories.map(function (item) {
          return item.categoryId;
        })
      }
      if (editData.malls != null || editData.malls != undefined) {
        this.mallVal = editData.malls.map(function (item) {
          return item.mallOid;
        })
      }
      this.buildFlag = true;
      this.statusValue = editData.status;
      this.countryOidVal = editData.countryOid;
      this.brandsFormGroup = this.fb.group({
        brandsLocale: this.fb.array([]),
        brandsRegionLocale: this.fb.array([]),
        brandCode: [editData.brandCode, Validators.required],
        country: [editData.countryOid, Validators.required],
        brandCategories: [this.brandCat, Validators.required],
        priceForTwo: [editData.priceForTwo,],
        mallName: [this.mallVal, Validators.required],
        brandType: [editData.brandType,],
        cuisine: [""],
        activeDays: [editData.activeDays]
      });

      this.brandLocale();
      this.getMallList();
      this.brandRegionLocale();
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

  removeDuplicatesJSON(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }


  malls1 = [];
  getMallList() {
    let GET_MALL = environment.APIEndpoint + "api/rpa/master/mall/v1/getMallByRegion";
    this.http.getJson(GET_MALL + '?countryOid=' + this.countryOidVal)
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
          var valuesArray = this.removeDuplicatesJSON(this.malls1, 'mallId');
          this.malls1 = valuesArray;
        });
      })
  }

  public brandLocale() {
    this.brandLogoImagePath = [];
    const control = <FormArray>this.brandsFormGroup.controls['brandsLocale'];
    if (this.brandData == undefined) {

      for (let i = 0; i < this.languageList.length; i++) {
        if (this.languageList[i].languageCode == 'AR') {
          this.groupByAR = true;
          this.required = true;
        } else {
          this.groupByAR = false;
          this.required = false;
        }

        let arr = this.fb.group({
          brandName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
          brandLogoImage: [],
          // groupBy: ['', Validators.compose([Validators.required, Validators.pattern(Globals.regOnlyArabic)])]
          groupBy: ['', Validators.compose([Validators.pattern(Globals.regOnlyArabic),ExtraValidators.conditional(group => this.languageList[i].languageCode == 'AR', Validators.required)])],
        });
        control.push(arr);
        this.brandLogoImagePath.push('');
        this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
        this.alignCssAr.push(this.languageList[i].direction == 'RTL' ? 'text-right' : 'd-none');
      }
    } else {
      for (let brand of this.brandData.brandLocales) {
        for (let i = 0; i < this.brandData.brandLocales.length; i++) {
          if (this.brandData.brandLocales[i].languageCode == 'EN') {
            // this.brandsFormGroup.controls['groupBy'].setValue('');
            // this.brandsFormGroup.get('groupBy').setValue('');
            this.alignCssAr.push(this.brandData.brandLocales[i].languageDirection == 'LTR' ? 'd-none' : 'Ar-val');
          } else {
            // this.brandsFormGroup.controls['groupBy'].setValue('');
            this.alignCssAr.push(this.brandData.brandLocales[i].languageDirection == 'RTL' ? 'Ar-val' : 'd-none');
          }
        }
        let arr = this.fb.group({
          brandName: [brand.brandName, Validators.compose([Validators.required, Validators.minLength(2)])],
          brandLogoImage: [brand.brandLogo],
          // groupBy: [brand.groupBy, Validators.compose([Validators.required, Validators.pattern(Globals.regOnlyArabic)])]
          groupBy: [brand.groupBy, Validators.compose([Validators.pattern(Globals.regOnlyArabic),ExtraValidators.conditional(group => brand.languageCode == 'AR', Validators.required)])],
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
    for (let i = 0; i < this.brandData.brandsRegionLocale.length; i++) {
      let arr = this.fb.group({
        content: [this.brandData.brandsRegionLocale[i].aboutBrand, Validators.required],
        brandImage: [],
        brandVideo: [this.brandData.brandsRegionLocale[i].brandVideo, Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
        keywords: ['',]
      });
      control.push(arr);
      this.keywordArray.push({
        keyword: []
      });
      this.imagePath.push('');
      this.requiredKeywordError.push(false);
      this.alignCss.push(this.brandData.brandsRegionLocale[i].languageDirection == 'RTL' ? 'text-right' : '');
      if (this.brandData.brandsRegionLocale[i].keywords != undefined) {

        for (let key of this.brandData.brandsRegionLocale[i].keywords) {
          this.keywordArray[i].keyword.push(key);
        }
      }
    }
  }


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

  public removeImage(index) {
    this.imagePath[index] = "";
    this.uploadFlag[index] = false;
    const control = this.brandsFormGroup.get('brandsRegionLocale') as FormArray;
    control.at(index).get('brandImage').setValue('');
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


  remove(cuisine: Cuisine): void {
    const index = this.cuisines.indexOf(cuisine);

    if (index >= 0) {
      this.cuisines.splice(index, 1);
    }
  }

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
        // alert("......keys...."+this.keywordArray[index].keyword.length);
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

  public groupByEng;
 
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

  updateBrands(formData) {
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
    formData.brandsLocale.forEach((brand, index) => {
      if (this.languageList[index].languageCode == "EN") {
        this.groupByEng = '';
      }
      let locale = {
        languageId: this.languageList[index].languageId,
        brandName: brand.brandName,
        brandLogo: this.brandLogoImagePath[index],
        groupBy: brand.groupBy == null ? this.groupByEng : brand.groupBy
      }
      this.brandLocaleArray.push(locale);
    })
    if (this.brandsFormGroup.invalid == true || keyWordError) {
      this.showError = true;
  
  
      return
    }
    this.loading = true;
    this.showError = false;
   
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

    let requestBody = {
      brandOid: this.brandId,
      brandCode: formData.brandCode,
      brandType: formData.brandType,
      priceForTwo: formData.priceForTwo,
      cuisines: this.cuisines,
      status: this.statusValue,
      mallName: formData.mallName,
      brandCategoryIds: formData.brandCategories,
      brandLocales: this.brandLocaleArray,
      brandsRegionLocale: this.brandRegionLocaleArray,
      brandsRegion: this.brandRegionArray
    }
    let UPDATE_BRAND = environment.APIEndpoint + "api/rpa/master/brand/v1/update";
    this.https.postJson(UPDATE_BRAND, requestBody).subscribe(
      (response) => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "success",
            message: "Brand has been updated successfully"
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