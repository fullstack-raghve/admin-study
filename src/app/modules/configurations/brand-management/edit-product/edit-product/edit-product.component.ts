import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { ActivatedRoute } from '@angular/router';
import { Globals } from 'src/app/services/global';


@Component({
    selector: 'edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
    public imgUploadProductEnglish = false;
    public imgUploadProductArabic = false;
    public imgUploadSku = false;
    public breadCrumbData: Array<Object> = [{
        title: 'Brand Management',
        link: ''
    }, {
        title: 'Edit Product',
        link: 'edit-product'
    }
    ];
    public brandWallFormGroup: FormGroup;
    public brandWallData;
    public imageUploading: boolean = false;
    @ViewChild('skuBarcodeImgFile') uploadElRefSku: ElementRef;
    @ViewChild('uploadEl') uploadElRef: ElementRef;
    public skuBarcodeImgPath: string = '';
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public previousUrl = localStorage.getItem('previousUrl');
    alignCss = [];
    public toggleVal: boolean = true;
    public imagePath: any = [];
    public showImageError: boolean = false;
    public uploadFlag = [];
    public uploadError = [];
    public loading: boolean = false;
    public statusValue: string = 'ONLINE';
    public checked = true;
    public showError: boolean = false;
    public brandWallLocaleList;
    public brandOid: number;
    public countryOid: number;
    public cities: any = [];
    public showCountryError: boolean = false;
    public showCityError = false;
    public buildFlag: boolean = false;
    public cityId = [];
    public brandWallId: number;
    public brandRegionOid: number;

    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private https: HttpService,
        private uploadFile: UploadFile,
        public snackBar: MatSnackBar, ) {
        this.activatedRoute.params.subscribe((params) => {
            this.brandRegionOid = params['brandRegionId']
            this.brandWallId = params['brandWallId'];
            this.brandOid = params['brandId'];
            this.countryOid = params['countryId']
        });
    }


    ngOnInit() {
        this.getAllCities();
        this.getBrandWallById();
    }

    getAllCities() {
        if (this.countryOid == undefined || null == this.countryOid) {
            //    this.showCountryError=true;
        } else {
            let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
            this.https.getJson(GET_ALL_CITIES + "?countryIds=" + this.countryOid)
                .subscribe((response) => {
                    this.cities = response;
                    this.showCountryError = false;
                })
        }
    }

    checkIsCityPresent() {
        if (this.cities.length == 0)
            this.showCountryError = true;
        else
            this.showCountryError = false
    }

    public getBrandWallById() {
        let GET_BRAND_WALL_BY_ID = environment.APIEndpoint + "api/rpa/master/brand/wall/v1/view";
        let request = {
            brandWallOid: this.brandWallId
        }
        this.http.postJson(GET_BRAND_WALL_BY_ID, request)
            .subscribe((response) => {
                this.brandWallData = response;
                this.checked = response['status'] == 'ONLINE' ? true : false;
                this.skuBarcodeImgPath = response['skuBarcodeImagePath'];
                this.buildEditBrandWallForm(response);
                for (let i = 0; i < this.brandWallData.brandWallLocales.length; i++) {
                    this.imagePath[i] = this.brandWallData.brandWallLocales[i].productImagePath;
                    if (this.imagePath[i] != '')
                        this.uploadFlag[i] = true
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

    public buildEditBrandWallForm(editData) {
        if (editData.productSku == undefined) {
            this.brandWallFormGroup = this.fb.group({
                brandWallLocale: this.fb.array([]),
                isMarkDefault: ["",],
                productSku: ["", Validators.compose([Validators.required, Validators.pattern(Globals.regAlbhanumericVal)])],
                imageType: ["", Validators.required],
                cities: ["", Validators.required]
            });
        } else {
            this.cityId = editData.cities.map(function (item) {
                return item.cityOid;
            })
            this.buildFlag = true;
            this.statusValue = editData.status;
            this.brandWallFormGroup = this.fb.group({
                brandWallLocale: this.fb.array([]),
                isMarkDefault: [editData.isMarkDefault],
                productSku: [editData.productSku, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]*')])],
                imageType: [editData.imageType, Validators.required],
                cities: [this.cityId, Validators.required]
            });
            this.brandWallLocaleArray();
        }
        for (let l of this.languageList) {
            this.uploadFlag.push(false);
            this.uploadError.push(false);
            this.imagePath.push('');
        }
    }

    public brandWallLocaleArray() {
        const control = <FormArray>this.brandWallFormGroup.controls['brandWallLocale'];
        for (let ln of this.brandWallData.brandWallLocales) {
            let arr = this.fb.group({
                productName: [ln.productName, Validators.compose([Validators.required, Validators.minLength(2)])],
                brandWallImage: []
            });
            control.push(arr);
            this.imagePath.push('');
            this.alignCss.push(ln.languageDirection == 'RTL' ? 'text-right' : '');
        }
    }

    public skuBarcodeImg(event: FileList) {
        this.imageUploading = true;
        if (event[0].size < 1000000) {
            if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg") {
                this.uploadFile.upload(event.item(0), 'brand', 'images')
                    .subscribe((response) => {
                        this.skuBarcodeImgPath = response['message'];
                        this.imageUploading = false;
                        this.uploadElRefSku.nativeElement.value = ''
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "success",
                                message: " image successfully uploaded"
                            }
                        });


                    }, err => {
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
                                    message: "Internal server error"
                                }
                            });
                        }

                    }
                    )
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
            this.skuBarcodeImgPath = '';
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Max upload file size is 1Mb"
                }
            });
        }
    }

    removeSkuImage() {
        this.skuBarcodeImgPath = '';
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
                        this.showError = false;
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
        const control = this.brandWallFormGroup.get('brandWallLocale') as FormArray;
        control.at(index).get('brandWallImage').setValue('');
    }

    updateBrandWall(formData) {
        this.brandWallLocaleList = [];
        if (this.imagePath.length > 0) {
            for (let i = 0; i < formData.brandWallLocale.length; i++) {
                if (this.imagePath[i] == '') {
                    this.uploadError[i] = true;
                    this.showError = true;
                }
            }
        }
        if (this.brandWallFormGroup.invalid == true) {
            this.showError = true;
            return
        } else if (this.skuBarcodeImgPath == '') {
            this.showImageError = true;
        }
        this.loading = true;
        this.showError = false;
        for (var i = 0; i < formData.brandWallLocale.length; i++) {
            let locale = {
                languageOid: this.languageList[i].languageId,
                productName: formData.brandWallLocale[i].productName,
                productImagePath: this.imagePath[i],
            }
            this.brandWallLocaleList.push(locale);
        }

        let requestBody = {
            brandWallOid: this.brandWallId,
            brandRegionOid: this.brandRegionOid,
            isMarkDefault: formData.isMarkDefault,
            imageType: formData.imageType,
            productSku: formData.productSku,
            skuBarcodeImagePath: this.skuBarcodeImgPath,
            status: this.statusValue,
            cityOids: formData.cities,
            brandWallLocales: this.brandWallLocaleList
        }

        let UPDATE_BRAND_WALL = environment.APIEndpoint + "api/rpa/master/brand/wall/v1/update";
        this.https.postJson(UPDATE_BRAND_WALL, requestBody).subscribe(
            (response) => {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "success",
                        message: "Brand wall updated successfully"
                    }
                });
                this.router.navigate(['/view-brand-management/' + this.brandRegionOid + '/3']);
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

    public toggleStatus(event) {
        if (event.checked) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }

    }

}
