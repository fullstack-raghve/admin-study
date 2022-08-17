import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpService } from '../../../../../../services/http-service';
import { environment } from '../../../../../../../environments/environment';
import { SnackBarComponent } from '../../../../../../shared/components/snack-bar/snack-bar.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
@Component({
  selector: 'edit-cuisine',
  templateUrl: './edit-cuisine.component.html',
  styleUrls: ['./edit-cuisine.component.scss']
})
export class EditCuisineComponent implements OnInit {
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
@ViewChild("createCuisineForm") createCuisineForm;
cuisineFormGroup: FormGroup;
public showError: boolean = false;
public loading: boolean = false;
public showCityError: boolean = false;
public statusValue: string = 'ONLINE';
public matcher;
public toggleVal: boolean = true;
public languageList =JSON.parse(localStorage.getItem("languageList"));
public cityArr: any = [];
public cuisineLocales: any = [];
public arr: any = [];
public countries: any = [];
public alignCss=[];

constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, public snackBar: MatSnackBar, ) {
    this.buildCreateCityForm();
}


ngOnInit() {
    this.cuisineLocale();
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
        cuisineLocale: this.fb.array([]),
        cuisineCode: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9]{1,20}$")])],
        country: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9 ]{1,20}$")])],
    }
    this.cuisineFormGroup = this.fb.group(form);
}
public cuisineLocale() {
    console.log("size = " + this.languageList.length);
    const control = <FormArray>this.cuisineFormGroup.controls['cuisineLocale'];
    for (let ln of this.languageList) {
        let arr= this.fb.group({
             cuisineName: ['',Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z\u0600-\u06FF \"\'&(),.-:?_]*')])]
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

createCuisine(formData) {
    this.cuisineLocales=[];
    if (this.cuisineFormGroup.invalid == true) {
        this.showError = true;
    }
    else {
        this.loading = true;
        this.showError = false;

        formData.cuisineLocale.forEach((city, index)=>{
            this.cuisineLocales.push({
                cuisineName:city.cuisineName,
                 languageId:this.languageList[index].languageId
            })
        })


            let createCityReq = {
                cuisineLocales: this.cuisineLocales,
                cuisineCode: formData.cuisineCode,
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
}
