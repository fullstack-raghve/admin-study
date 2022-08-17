import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar, MatOption } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

@Component({
    selector: 'edit-press-release',
    templateUrl: './edit-press-release.component.html',
    styleUrls: ['./edit-press-release.component.scss']
})
export class EditPressReleaseComponent implements OnInit {

    public breadCrumbData: Array<Object> = [{
        title: 'Press Release',
        link: ''
    }
    ];

    @ViewChild(SelectAutocompleteComponent) multiSelect: SelectAutocompleteComponent;
    @ViewChild("editPressReleaseForm") editPressReleaseForm;
    @ViewChild('uploadEl') uploadElRef: ElementRef;
    pressFormGroup: FormGroup;
    localesFormGroup: FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public showCountryError: boolean = false;
    public statusValue: string = 'OFFLINE';
    public languageList;
    public releaseTitle: any = [];
    public content: any = [];
    public imagePath: any = [];
    checked = true;
    public prId: number = 0;
    public releaseData: any = [];
    public toggleVal;
    public countryObj = [];
    public countries: any = [];
    public brandList: any = [];
    public editImagePath = [];
    public imageUploading = false;
    public pressReleaseLocales = [];
    public uploadFlag = [];
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public minLengthError = false;
    public buildFlag = false;
    public minDate: Date = new Date();
    public uploadError = [];
    public alignCss = [];
    public langfield = [];
    public dateError1: boolean = false;
    public dateError2: boolean = false;
    public dateError3: boolean = false;
    public dateError4: boolean = false;
    disabled = false;

    @ViewChild('allSelected') private allSelected: MatOption;

    constructor(private activatedRoute: ActivatedRoute,
        private http: HttpService, public snackBar: MatSnackBar, private fb: FormBuilder, private uploadFile: UploadFile,
        private router: Router) {
        // this.activatedRoute.params.subscribe((params) => {
        //     this.prId = params.id;

        // });
        let Id = localStorage.getItem('PressReleaseEditId');
        if(Id){
          this.prId=Number(Id);
          this.getPressReleaseById();
          localStorage.removeItem('PressReleaseEditId')
        }else{
            sessionStorage.clear();
          this.router.navigate(['/search-press-release'])
        }
        let data = []
        this.buildCreatePressForm(data);

        this.getAllCountries();
        this.getAllBrands();

    }

    urlEn: any = '';
    onSelectFileEn(event) {
        if (event.target.files && event.target.files[0]) {
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
            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                // this.url = event.target.result;
                this.urlAr = <string>reader.result;

            }
        }
    }
    getLanguage() {
        this.languageList = [
            { code: 'EN', name: 'English' },
            { code: 'AR', name: 'Arabic' },
            { code: 'ITL', name: 'Italian' },
            { code: 'FR', name: 'French' }
        ]
        for (let l of this.languageList) {
            this.uploadFlag.push(false);
            this.uploadError.push(false);
            this.imagePath.push('');
        }


    }
    ngOnInit() {
        this.getLanguage();


    }

    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }

    }
   
    public buildCreatePressForm(editData) {

        if (editData.brandId == undefined) {
            let form = {
                //pressReleaseLocale:this.fb.array([]),
                selectCountry: ["", Validators.required],
                selectBrand: ["", Validators.required],
                publishFromTime: [''],
                publishToTime: [''],
                startDate: [""],
                endDate: [""],
            }
            this.pressFormGroup = this.fb.group(form);
            this.pressFormGroup.get('selectCountry').patchValue(this.countries);
        }
        else {

            console.log(editData.publishFromTime);
            this.countryObj = editData.countries.map(function (item) {
                return item.countryId;
            })
            let startDate = new Date(editData.publishFromDate);
            let endDate = new Date(editData.publishToDate);
            let publishFromTime = new Date(editData.publishFromDate);
            if (editData.publishFromDate) {
                let s = editData.publishFromDate.split(" ");
                let s1 = s[1].split(":");
                publishFromTime.setHours(s1[0]);
                publishFromTime.setMinutes(s1[1]);
                publishFromTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })
            }
            let publishToTime = new Date(editData.publishToDate);
            if (editData.publishToDate) {
                let s = editData.publishToDate.split(" ");
                let s1 = s[1].split(":");
                publishToTime.setHours(s1[0]);
                publishToTime.setMinutes(s1[1]);
                publishToTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })
            }
            console.log(this.countryObj);
            this.pressFormGroup.patchValue({
                selectCountry: this.countryObj,
                selectBrand: editData.brandId.toString(),
                startDate: startDate,
                endDate: endDate,
                publishFromTime: publishFromTime,
                publishToTime: publishToTime,
            })
            this.localesFormGroup = this.fb.group({
                pressReleaseLocale: this.fb.array([]),
            })
            //    this.pressFormGroup=this.fb.group(form);
            this.pressRelLocale(this.releaseData);
            this.buildFlag = true;

            this.toggleVal = editData.status == 'ONLINE' ? true : false;
            this.statusValue = editData.status;


            let d1 = moment(new Date(this.pressFormGroup.get('startDate').value)).format('DD-MM-YYYY');
            let d2 = moment(new Date(this.pressFormGroup.get('endDate').value)).format('DD-MM-YYYY');
            // let d3 = moment(new Date(this.pressFormGroup.get('publishFromTime').value)).format('hh:mm A');
            // let d4 = moment(new Date(this.pressFormGroup.get('publishToTime').value)).format('hh:mm A');
            let date = moment(new Date()).format('DD-MM-YYYY');
            // let time = moment(new Date()).format('hh:mm A');


            this.dateError1 = d1 > d2 || d1 < date ? true : false;
            // this.dateError2 = d3 > time ? true : false;
            this.dateError3 = d2 > d1 || d2 < date ? true : false;
            // this.dateError4 = d4 > time ? true : false;
            // this.dateError3 = d3 < date ? true : false;
        }
    }
    // startDate = new FormControl('', [Validators.required]);

    // getErrorMessage() {
    //   return  this.startDate.hasError('minlength') ? 'min lenth error' :
    //           '';
    // }

    public pressRelLocale(editData) {
        console.log("size = " + editData.pressReleaseLocaleList.length);
        for (let i = 0; i < editData.pressReleaseLocaleList.length; i++) {
            const control = <FormArray>this.localesFormGroup.controls['pressReleaseLocale'];
            let newForm = this.fb.group({
                releaseTitle: [editData.pressReleaseLocaleList[i].title, Validators.compose([Validators.required])],
                content: [editData.pressReleaseLocaleList[i].content, Validators.compose([Validators.required])],
                viedoUrl: [editData.pressReleaseLocaleList[i].viedoUrl, Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])]
            });
            control.push(newForm);
            this.alignCss.push(editData.pressReleaseLocaleList[i].languageDirection == 'RTL' ? 'text-right' : '');
            this.langfield.push(editData.pressReleaseLocaleList[i].languageDirection == 'RTL' ? 'lang-name-right' : '');
        }
    }
    // getAllCountries() {
    //     let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    //     this.http.getJson(GET_ALL_COUNTRIES)
    //         .subscribe((response) => {
    //             console.log(response);
    //             this.countries = response;
    //         })
    // }


    // countries1 = [];
    // getAllCountries(): void {
    //     let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    //     this.http.getJson(GET_ALL_COUNTRIES)
    //         .subscribe((response) => {
    //             console.log(response);
    //             this.countries = response;
    //             this.countries.forEach(res => {
    //                 this.countries1.push({
    //                     "countryCode": res.countryCode,
    //                     "countryId": res.countryId,
    //                     "countryName": res.countryName,
    //                     "currencyCode": res.currencyCode,
    //                     "languageDirection": res.languageDirection,
    //                     "value": res.countryId
    //                 });
    //                 var valuesArray = this.removeDuplicatesJSON(this.countries1, 'countryId');
    //                 this.countries1 = valuesArray;
    //             });
    //         })
    // }

    countries1 = [];
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
    public getPressReleaseById() {
        this.uploadFlag = [];
        let GET_PRESS_RELEASE_BY_ID = environment.APIEndpoint + "api/rpa/pressrelease/v1/view";
        let request = {
            pressReleaseId: this.prId
        }
        this.http.postJson(GET_PRESS_RELEASE_BY_ID, request)
            .subscribe((response) => {
                console.log(response);
                this.releaseData = response;
                this.buildCreatePressForm(this.releaseData);
                for (let i = 0; i < this.releaseData.pressReleaseLocaleList.length; i++) {
                    // this.releaseTitle[i] = this.releaseData.pressReleaseLocaleList[i].title;
                    // this.content[i] = this.releaseData.pressReleaseLocaleList[i].content;
                    this.imagePath[i] = this.releaseData.pressReleaseLocaleList[i].imgPath;
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
                    console.log("error Status = " + err.status);

                })
    }
    public uploadImage(event: FileList, i) {
        this.imageUploading = true;
        if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
            this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
                .subscribe((response) => {
                    console.log(response);
                    this.imagePath[i] = response['message'];
                    this.uploadFlag[i] = true;
                    this.imageUploading = false;
                    this.uploadError[i] = false;
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

    }
    updatePressRelease(formData, localesFormData) {
        this.showError = false;
        this.pressReleaseLocales = [];
        if (this.imagePath.length > 0) {
            for (let i = 0; i < localesFormData.pressReleaseLocale.length; i++) {
                if (this.imagePath[i] == '') {
                    this.uploadError[i] = true;
                    this.showError = true;
                }
            }
        }

        if (formData.selectCountry.invalid || formData.selectBrand.invalid || this.localesFormGroup.invalid) {
            this.showError = true;
        } else {
            for (let i = 0; i < localesFormData.pressReleaseLocale.length; i++) {
                if (localesFormData.pressReleaseLocale[i] != '') {
                    let locales = {
                        content: localesFormData.pressReleaseLocale[i].content,
                        imgPath: this.imagePath[i],
                        languageId: this.releaseData.pressReleaseLocaleList[i].languageId,
                        title: localesFormData.pressReleaseLocale[i].releaseTitle,
                        viedoUrl: localesFormData.pressReleaseLocale[i].viedoUrl
                    }
                    this.pressReleaseLocales.push(locales);
                }
            }
            console.log(formData.selectCountry);
            let request = {
                pressReleaseId: this.prId,
                countryIds: formData.selectCountry,
                brandId: formData.selectBrand,
                pressReleaseLocale: this.pressReleaseLocales,
                // publishFromDate: moment(formData.startDate).format('DD/MM/YYYY') + ' ' + formData.publishFromTime + ':' + 0 + 0,
                publishFromDate: moment(formData.startDate).format('DD/MM/YYYY') + ' ' + moment(this.pressFormGroup.get('publishFromTime').value).format('hh:mm:ss'),
                publishToDate: moment(formData.endDate).format('DD/MM/YYYY') + ' ' + moment(this.pressFormGroup.get('publishToTime').value).format('hh:mm:ss'),
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
            }
            let UPDATE_PRESS_RELEASE = environment.APIEndpoint + "api/rpa/pressrelease/v1/update";
            this.http.postJson(UPDATE_PRESS_RELEASE, request)
                .subscribe((response) => {
                    console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "Press Release category master has been updated successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-press-release']);
                }
                    , err => {
                        this.loading = false;
                        console.log("error Status = " + err);
                        if (err.error.errorType == 'VALIDATION') {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 1500,
                                data: {
                                    status: "failure",
                                    message: err.error.errorDetails[0].description
                                }
                            });
                        } else {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 1500,
                                data: {
                                    status: "failure",
                                    message: "Your request cannot be saved at this time. Please try again later"
                                }
                            });
                        }
                    })
        }
    }
    public removeImage(index) {
        this.imagePath[index] = "";
        this.uploadFlag[index] = false;

    }
    onKey(value) {
        if (value.length < 2)
            this.minLengthError = true;
        else
            this.minLengthError = false;
    }
    public descriptionError: boolean = false;
    removeErrorMsg(index) {
        let totalLength = this.languageList.length;
        if (totalLength - 1 == index) {
            console.log("length = " + index);
            this.descriptionError = false;
        }
    }
    ngAfterViewChecked() {
        this.expandDataEmail();
    }
    expandDataEmail() {
        var allifram = document.getElementById("arabicID");
        if(allifram != null){
            var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
            var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
            html_Arabic.setAttribute("style", "direction: rtl;");
        }
    }
}