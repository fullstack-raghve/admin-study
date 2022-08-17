import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
// import { access } from 'fs';
import { HttpService } from 'src/app/services/http-service';
import { MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as access from 'src/app/constants/countries.constant';
import { UploadFile } from 'src/app/services/uploadFile.service';

@Component({
    selector: 'add-course',
    templateUrl: './add-course.component.html',
    styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Home',
        link: ''
    }, {
        title: 'Configurations',
        link: '/search-course'
    }
    ];
    @ViewChild('createCourseForm') createCourseForm;
    @ViewChild('uploadEl') uploadElRef: ElementRef;
    courseFormGroup: FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public showCountryError: boolean = false;
    public statusValue: string = 'ONLINE';
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    public toggleVal: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    // public countryArr: any = [];
    public country_locale: any = [];
    public arr: any = [];
    public currencies: any = [];
    public alignCss = [];
    public courseNameList = [];
    public imagePath: string = '';
    public imageUploading: boolean = false;
    public showImageError: boolean = false;
    public filePathUrl = localStorage.getItem('imgBaseUrl');
    public countryJsonList = access.countries.country;
    public imageErrMsg;
    public showImage = false;
    public cities:any=[];
    public countries:any=[];
    public imageErrStatus :boolean;
    public keywords = [];
    keywordStatus: boolean = true;
    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, public snackBar: MatSnackBar, private uploadFile: UploadFile) {

        this.buildcreateCourseForm();

    }

    // storeFlag;
    // storeFlags = [
    //     { value: 'Yes', viewValue: 'Yes' },
    //     { value: 'No', viewValue: 'No' }
    // ];

    ngOnInit() {

        this.courseLocale();
        this.getAllCurrencies();
        this.getAllCountries();
        this.countryJsonList = access.countries.country;

        this.countryJsonList.forEach(country => {
            this.courseNameList.push(country);

        });

    }

    onSelectionChanged(event: MatAutocompleteSelectedEvent) {

        this.courseNameList = this.countryJsonList.filter(option => option.name.toLowerCase() === (event.option.value.toLowerCase()));

        const item = <FormArray>this.courseFormGroup.controls['courseLocale'];

        for (let i = 1; i < this.languageList.length; i++) {
            item.at(i).patchValue({
                courseName: this.courseNameList[0].name_ab
            })
        }
        this.courseFormGroup.patchValue({
            courseCode: this.courseNameList[0].code
        })
    }

    onChangeCourseName(search: string) {

        const item = <FormArray>this.courseFormGroup.controls['courseLocale'];

        for (let i = 1; i < this.languageList.length; i++) {
            item.at(i).patchValue({
                courseName: [""]
            })
        }
        this.courseFormGroup.patchValue({
            courseCode: [""]
        })

        this.courseNameList = this.countryJsonList.filter(option => option.name.toLowerCase().indexOf(search.toLowerCase()) === 0);

    }

    public buildcreateCourseForm() {
        let form = {

            courseLocale: this.fb.array([]),
            courseCode: ["", Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]{1,2}$')])],
            statusVal:["",Validators.required],
            merchant: ["", Validators.required],
            numberOfHoles:["", Validators.required],
            keywords: ["", Validators.compose([Validators.required])],
            country: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9 ]{1,20}$")])],
            city: ["", Validators.required],
            storeFlag: ["", Validators.required],
            latitude: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[0-9.-]*$')])],
            longitude: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[0-9.-]*$')])],
        }
        this.courseFormGroup = this.fb.group(form);
    }

    public courseLocale() {
        console.log("size = " + this.languageList.length);
        const control = <FormArray>this.courseFormGroup.controls['courseLocale'];
        for (let ln of this.languageList) {
            let arr = this.fb.group({
                courseName: ['', Validators.compose([Validators.required, Validators.minLength(2),
                Validators.pattern('[a-zA-Z\u0600-\u06FF \"\'&(),.:?_-]*')])]
            });
            control.push(arr);
            this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
        }
        // this.disableInputs();
    }

    disableInputs() {
        (<FormArray>this.courseFormGroup.get('courseLocale'))
            .controls
            .slice(1).forEach(control => {
                control.disable();
            })
    }

    createCourse(formData) {

        this.country_locale = [];
        if (this.courseFormGroup.invalid) {
            this.showError = true;
        }
        else {
            this.courseFormGroup.getRawValue().courseLocale.forEach((country, index) => {
                this.country_locale.push({
                    courseName: country.courseName,
                    languageId: this.languageList[index].languageId
                })
            })
            let createCountryReq = {
                courseLocale: this.country_locale,
                courseCode: formData.courseCode,
                merchantId: parseInt(formData.merchant),
                cityId:parseInt(formData.city),
                storeFlag: formData.storeFlag == 'Yes' ? true : false,
                latitude: formData.latitude,
                longitude: formData.longitude,
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
            }
            console.log("contryReq = " + JSON.stringify(createCountryReq));

            let CREATE_COUNTRY = environment.APIEndpoint + "api/rpa/master/country/v1/create";
            this.http.postJson(CREATE_COUNTRY, createCountryReq)
                .subscribe((response) => {
                    console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "Country master has been added successfully"
                        }
                    });
                    this.loading = false;
                    this.router.navigate(['/search-country']);
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
    public toggleStatus(event) {
        if (event.checked) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }
    }
    public getAllCurrencies() {
        let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
        this.http.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
            .subscribe((response) => {
                this.currencies = response;

            })

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

    getAllCities(countryId) {
        console.log("countryId..............."+countryId);
        let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
        this.http.getJson(GET_ALL_CITIES + "?countryIds="+countryId)
            .subscribe((response) => {
                console.log(response);
                this.cities = response;

            })
    }

    getAllCountries() {
        let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
        this.http.getJson(GET_ALL_COUNTRIES)
            .subscribe((response) => {
                console.log(response);
                this.countries = response;

            })
    }

    checkCountryId(){
        if(this.cities.length==0)
            this.showCountryError=true;
        else
            this.showCountryError=false;
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

    public showKeyword(keyword: HTMLInputElement) {
        if (this.keywords.length < 5) {
          this.keywordStatus = true;
          this.keywords.push(keyword.value);
        }
        else {
          this.keywordStatus = false;
        }
      }
    
      public deleteKeyword(index: any) {
        this.keywords.splice(index, 1);
      }
}
