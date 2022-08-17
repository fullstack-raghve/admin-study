import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as access from 'src/app/constants/countries.constant';
import { Globals } from 'src/app/services/global';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Currency {
    currencyId: number;
    currencyCode: string;
}

@Component({
    selector: 'add-country',
    templateUrl: './addCountry.component.html',
    styleUrls: ['./addCountry.component.scss']
})
export class AddCountryComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Masters',
        link: '/search-country'
    }
    ];
    public currencyIdValue;
    currencies;
    Currencies: Currency[] = [];
    currencyCtrl = new FormControl();
    filteredCurrencies: Observable<Currency[]>;
    @ViewChild('createCountryForm') createCountryForm;
    countryFormGroup: FormGroup;
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
    public countryArr: any = [];
    public country_locale: any = [];
    public arr: any = [];
    public alignCss = [];
    public countryNameList = [];

    public countryJsonList = access.countries.country;

    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, public snackBar: MatSnackBar, private https: HttpService) {

        this.buildCreateCountryForm();

    }


    storeFlag;
    storeFlags = [
        { value: 'Yes', viewValue: 'Yes' },
        { value: 'No', viewValue: 'No' }
    ];

    ngOnInit() {

        this.countryLocale();
        this.getAllCurrencies();
        this.countryJsonList = access.countries.country;

        this.countryJsonList.forEach(country => {
            this.countryNameList.push(country);

        });

    }

    onSelectionChanged(event: MatAutocompleteSelectedEvent) {

        this.countryNameList = this.countryJsonList.filter(option => option.name.toLowerCase() === (event.option.value.toLowerCase()));

        const item = <FormArray>this.countryFormGroup.controls['countryLocale'];

        for (let i = 1; i < this.languageList.length; i++) {
            item.at(i).patchValue({
                countryName: this.countryNameList[0].name_ab
            })
        }
        this.countryFormGroup.patchValue({
            countryCode: this.countryNameList[0].code
        })
    }

    onChangeCountryName(search: string) {
        console.log(search);

        const item = <FormArray>this.countryFormGroup.controls['countryLocale'];

        for (let i = 1; i < this.languageList.length; i++) {
            item.at(i).patchValue({
                countryName: [""]
            })
        }
        this.countryFormGroup.patchValue({
            countryCode: [""]
        })

        this.countryNameList = this.countryJsonList.filter(option => option.name.toLowerCase().indexOf(search.toLowerCase()) === 0);

    }

    oncurrencyChange(ev) {
        console.log(ev);
        this.currencyIdValue = ev;
    }
    public buildCreateCountryForm() {
        let form = {

            countryLocale: this.fb.array([]),
            countryCode: ["", Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]{1,2}$')])],
            // currency: ["", Validators.required],
            storeFlag: ["", Validators.required],
            latitude: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[0-9.-]*$')])],
            longitude: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[0-9.-]*$')])],
        }
        this.countryFormGroup = this.fb.group(form);
    }

    public countryLocale() {
        console.log("size = " + this.languageList.length);
        const control = <FormArray>this.countryFormGroup.controls['countryLocale'];
        for (let ln of this.languageList) {
            let arr = this.fb.group({
                countryName: ['', Validators.compose([Validators.required, Validators.minLength(2),
                Validators.pattern(Globals.mulRegExpOnlyAlphaWithSplChar)])]
            });
            control.push(arr);
            this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
        }
        this.disableInputs();
    }

    disableInputs() {
        (<FormArray>this.countryFormGroup.get('countryLocale'))
            .controls
            .slice(1).forEach(control => {
                control.disable();
            })
    }
    getAllCurrencies() {

        let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
        this.https.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
            .subscribe((response) => {
                console.log(response);
                this.currencies = response;

                for (let i = 0; i <= this.currencies.length - 1; i++) {
                    let objMallkey = {
                        currencyId: this.currencies[i]['currencyId'],
                        currencyCode: this.currencies[i]['currencyCode'],
                    }
                    this.Currencies.push(objMallkey);
                }
                this.filteredCurrencies = this.currencyCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(curreny => curreny ? this._filterCurrencies(curreny) : this.Currencies.slice())
                    );

            },
                (error) => {
                    console.log(error);
                });
    }
    private _filterCurrencies(value: string): Currency[] {
        const filterValue = value.toLowerCase();
        return this.Currencies.filter(curreny => curreny.currencyCode.toLowerCase().indexOf(filterValue) === 0);
    }
    createCountry(formData) {

        this.country_locale = [];
        if (this.countryFormGroup.invalid) {
            this.showError = true;
        }
        else {
            this.countryFormGroup.getRawValue().countryLocale.forEach((country, index) => {
                this.country_locale.push({
                    countryName: country.countryName != '' ? country.countryName : '',
                    languageId: this.languageList[index].languageId
                })
            })
            let createCountryReq = {
                countryLocale: this.country_locale,
                countryCode: formData.countryCode,
                currencyId: this.currencyIdValue,
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
                    sessionStorage.clear();
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
    //   public getAllCurrencies(){
    //       let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
    //       this.http.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
    //       .subscribe((response) => {
    //           this.currencies=response;

    //       })
    //   }




}
