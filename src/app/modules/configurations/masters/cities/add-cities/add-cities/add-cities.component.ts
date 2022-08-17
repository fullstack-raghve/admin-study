import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'add-cities',
    templateUrl: './add-cities.component.html',
    styleUrls: ['./add-cities.component.scss']
})
export class AddCitiesComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'City',
        link: '/search-cities'
    }
    ];
    checked = true;
    disabled = false;
    @ViewChild("createCityForm") createCityForm;
    cityFormGroup: FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public showCityError: boolean = false;
    public statusValue: string = 'ONLINE';
    public matcher;
    public toggleVal: boolean = true;
    public languageList =JSON.parse(localStorage.getItem("languageList"));
    public cityArr: any = [];
    public cityLocales: any = [];
    public arr: any = [];
    public countries: any = [];
    public alignCss=[];

    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, public snackBar: MatSnackBar, ) {
        this.buildCreateCityForm();
    }


    ngOnInit() {
        this.cityLocale();
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
            cityLocale: this.fb.array([]),
            cityCode: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9]{1,20}$")])],
            country: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9 ]{1,20}$")])],
        }
        this.cityFormGroup = this.fb.group(form);
    }
    public cityLocale() {
        console.log("size = " + this.languageList.length);
        const control = <FormArray>this.cityFormGroup.controls['cityLocale'];
        for (let ln of this.languageList) {
            let arr= this.fb.group({
                 cityName: ['',Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(Globals.mulRegExpOnlyAlphaWithSplChar)])]
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

    createCity(formData) {
        this.cityLocales=[];
        if (this.cityFormGroup.invalid == true) {
            this.showError = true;
        }
        else {
            this.loading = true;
            this.showError = false;

            formData.cityLocale.forEach((city, index)=>{
                this.cityLocales.push({
                    cityName:city.cityName,
                     languageId:this.languageList[index].languageId
                })
            })


                let createCityReq = {
                    cityLocales: this.cityLocales,
                    cityCode: formData.cityCode,
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
                        sessionStorage.clear()
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

}
