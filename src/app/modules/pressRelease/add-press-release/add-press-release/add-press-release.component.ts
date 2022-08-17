import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import { MatSnackBar, MatOption } from '@angular/material';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

@Component({
    selector: 'app-add-press-release',
    templateUrl: './add-press-release.component.html',
    styleUrls: ['./add-press-release.component.scss']
})
export class AddPressReleaseComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Press Release',
        link: ''
    },
    ];

    @ViewChild(SelectAutocompleteComponent) multiSelect: SelectAutocompleteComponent;
    @ViewChild('uploadEl') uploadElRef: ElementRef;
    pressFormGroup: FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public showCountryError: boolean = false;
    public statusValue: string = 'ONLINE';
    public releaseTitle: any[];
    public content: any[];
    public checked = true;
    imgUpload = false;
    imgUploadArabic = false;
    public countries: any = [];
    public brandList: any = [];
    public buildLocale = false;
    public pressRelease: any = [];
    public imageUploading: boolean = false;
    public toggleVal: boolean = true;
    public imagePath: any = [];
    public showImageError: boolean = false;
    public uploadFlag = [];
    public uploadError = [];
    public buildFlag = false;
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public minDate: Date = new Date();
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public alignCss = [];
    public langfield = [];
    public pressReleaseLocaleArray: any = [];
    minCal: boolean;
    startDate: any;
    disabled = false;

    //    releaseTitle = new FormbrandInputol('', [Validators.required]);

    @ViewChild('allSelected') private allSelected: MatOption;
    countryId: string;

    constructor(
        private http: HttpService, public snackBar: MatSnackBar, private fb: FormBuilder, private uploadFile: UploadFile,
        private router: Router) {

    }
    //image upload

    urlEn: any = '';
    onSelectFileEn(event) {
        if (event.target.files && event.target.files[0]) {
            this.imgUpload = true;
            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                // this.url = event.target.result;
                this.urlEn = <string>reader.result;

            }
        }
    }
    urlAr: any = '';
    onSelectFileAr(event) {
        if (event.target.files && event.target.files[0]) {
            this.imgUploadArabic = true;
            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                // this.url = event.target.result;
                this.urlAr = <string>reader.result;

            }
        }
    }
    ngOnInit() {
        this.buildCreatePressForm();
        this.getAllCountries();
        this.getAllBrands();
        let selectedDate = this.startDate.getDate();
        this.minCal = this.minDate > selectedDate;
        console.log(selectedDate);
        console.log(this.minDate);
    }

    public toggleStatus(event) {
        if (event.checked === true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }

    }

    public buildCreatePressForm() {
        this.pressFormGroup = this.fb.group({
            pressRelease: this.fb.array([]),
            selectCountry: ['', Validators.required],
            selectBrand: ['', Validators.required],
            startDate: ['', Validators.required],
            publishFromTime: ['', Validators.required],
            endDate: ['', Validators.required],
            publishToTime: ['', Validators.required]

        });
        for (const l of this.languageList) {
            this.uploadFlag.push(false);
            this.uploadError.push(false);
            this.imagePath.push('');
        }
        this.pressRelLocale();
        this.pressFormGroup.get('selectCountry').patchValue(this.countries);
    }

    public pressRelLocale() {
        const control = <FormArray>this.pressFormGroup.controls['pressRelease'];
        for (let i = 0; i < this.languageList.length; i++) {
            const newForm = this.fb.group({
                release: ['', Validators.compose([Validators.required])],
                viedoUrl: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
                content: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
                image: ['', Validators.required]
            });
            control.push(newForm);
            this.alignCss.push(this.languageList[i].direction === 'RTL' ? 'text-right' : '');
            this.langfield.push(this.languageList[i].direction == 'RTL' ? 'lang-name-right' : '');
        }
        // this.expandDataEmail();
    }

    public countries1 = [];
    getAllCountries(): void {
        let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
        this.http.getJson(GET_ALL_COUNTRIES)
            .subscribe((response) => {
                console.log(response);
                this.countries = response;
                this.countries.forEach(res => {
                    this.countries1.push({
                        "countryCode": res.countryCode,
                        "countryId": res.countryId,
                        "countryName": res.countryName,
                        "currencyCode": res.currencyCode,
                        "languageDirection": res.languageDirection,
                        "value": res.countryId
                    });
                });
            })
    }

    getAllBrands() {
        let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
        this.http.getJson(GET_ALL_ONLINE_BRANDS)
            .subscribe((response) => {
                console.log(response);
                this.brandList = response;

            })
    }

    public uploadImage(event: FileList, i) {
        this.imageUploading = true;
        if (event[0].type == "image/jpeg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG" || event[0].type == "image/png" || event[0].type == "image/jpg") {
            this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
                .subscribe((response) => {
                    console.log(response);
                    this.imagePath[i] = response['message'];
                    this.uploadFlag[i] = true;
                    this.uploadError[i] = false;
                    this.imageUploading = false;
                    this.uploadElRef.nativeElement.value = ''

                    console.log("res ::: " + response)
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: " image successfully uploaded"
                        }
                    });
                }, err => {
                    this.loading = false;
                    console.log("error Status = " + err);
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
        } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Supported format is JPG, JPEG and PNG"
                }
            });
        }


    }
    public removeImage(index) {
        this.imagePath[index] = "";
        this.uploadFlag[index] = false;

    }

    createPressRelease(formData) {
        this.pressRelease = [];
        if (this.imagePath.length > 0) {
            for (let i = 0; i < formData.pressRelease.length; i++) {
                if (this.imagePath[i] == '') {
                    this.uploadError[i] = true;
                    this.showError = true;
                }
            }
        }

        // if (this.pressFormGroup.invalid == true) {
        //     this.showError = true;
        //     return;
        // }

        if (this.pressFormGroup.valid == true) {
            this.loading = true;
            // this.showError = false;
            for (let i = 0; i < formData.pressRelease.length; i++) {
                if (formData.pressRelease[i] !== '') {
                    const locale = {
                        content: formData.pressRelease[i].content,
                        imgPath: this.imagePath[i],
                        languageId: this.languageList[i].languageId,
                        title: formData.pressRelease[i].release,
                        viedoUrl: formData.pressRelease[i].viedoUrl
                    }
                    this.pressRelease.push(locale);
                }
            }

            const request = {
                countryIds: formData.selectCountry,
                brandId: formData.selectBrand,
                pressReleaseLocale: this.pressRelease,
                publishFromDate: moment(formData.startDate).format('DD/MM/YYYY') + ' ' + moment(this.pressFormGroup.get('publishFromTime').value).format('HH:mm:ss'),
                publishToDate: moment(formData.endDate).format('DD/MM/YYYY') + ' ' + moment(this.pressFormGroup.get('publishToTime').value).format('HH:mm:ss'),
                status: this.toggleVal === true ? 'ONLINE' : 'OFFLINE'
            }

            console.log(request);
            const CREATE_PRESS = environment.APIEndpoint + 'api/rpa/pressrelease/v1/add';
            this.http.postJson(CREATE_PRESS, request).subscribe(
                (response) => {
                    console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "Press Release category master has been added successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-press-release']);
                },
                (error) => {
                    this.loading = false;
                    console.log(error);
                    if (error.error.errorType === 'VALIDATION') {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 10000,
                            data: {
                                status: 'failure',
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
    public descriptionError: boolean = false;
    removeErrorMsg(index) {
        let totalLength = this.languageList.length;
        if (totalLength - 1 == index) {
            console.log("length = " + index);
            this.descriptionError = false;
        }
    }
    expandDataEmail() {
        var allifram = document.getElementById("arabicID");
        var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
        var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
        html_Arabic.setAttribute("style", "direction: rtl;");
      }
}
