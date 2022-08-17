import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Currency {
    currencyId: number;
    currencyCode: string;
}


export interface Country {
    countryName: string;
    languageId: number;
}

@Component({
    selector: 'edit-country',
    templateUrl: './edit-country.component.html',
    styleUrls: ['./edit-country.component.scss']
})
export class EditCountryComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Masters',
        link: '/search-country'
    }
    ];
    public prePopulatecurrencyOid;
    public currencyIdValue;
    currencies;
    Currencies: Currency[] = [];
    currencyCtrl = new FormControl();
    filteredCurrencies: Observable<Currency[]>;
    @ViewChild("editCountryForm") editCountryForm;
    countryFormGroup: FormGroup;
    public showCountryError: boolean = false;
    public loading: boolean = false;
    public showError: boolean = false;
    public countryId;
    public countryData: any = [];
    public statusValue: string;
    public countryArr: any = [];
    public country_locale: any = [];
    public arr: any = [];
    public buildFlag: boolean = false;
    public countryFlag: boolean = false;
    public toggleVal: boolean = false;
    // public currencies:any=[];
    public alignCss = [];
    public languageList = JSON.parse(localStorage.getItem("languageList"));

    constructor(private activatedRoute: ActivatedRoute,
        private http: HttpService, private fb: FormBuilder,
        private router: Router, public snackBar: MatSnackBar, private https: HttpService) {
        // this.activatedRoute.params.subscribe((params) => {
        //     this.countryId = params.id;

        // });

    }

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    countries: Country[] = [];


    ngOnInit() {
        // this.getAllCurrencies();
        let data=localStorage.getItem('CountryEditID');
        if(data){
            this.countryId=data;
            this.getCountryById();
            // this.getAllCurrencies();
          localStorage.removeItem('CountryEditID')
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-country'])
        }
    }
    public getCountryById() {
        let GET_COUNTRY_BY_ID = environment.APIEndpoint + "api/rpa/master/country/v1/view";
        let request = {
            countryId: this.countryId
        }
        this.http.postJson(GET_COUNTRY_BY_ID, request)
            .subscribe((response) => {
                console.log(response);
                this.countryData = response;
                this.toggleVal = (this.countryData.status == 'ONLINE' ? true : false);
                this.buildEditCountryForm(response);

            }
                , err => {
                    if (err.error == "invalid_token") {
                        alert("Invalid Token");
                    }
                    console.log("error Status = " + err.status);

                })

    }
    public countryLocale() {
        const control = <FormArray>this.countryFormGroup.controls['countryLocale'];
        for (let cn of this.countryData.countryLocales) {

            let arr = this.fb.group({
                countryName: [cn.countryName, Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(Globals.mulRegExpOnlyAlphaWithSplChar)])]
            });

            control.push(arr);
            this.alignCss.push(cn.languageDirection == 'RTL' ? 'text-right' : '');
        }
    }

    private buildEditCountryForm(editCountry) {
        if (editCountry.countryCode == undefined) {
            let countryFormData = {
                countryLocale: this.fb.array([]),
                countryCode: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z]$")])],
                currency: ["", Validators.required],
                storeFlag: ["", Validators.required],
                latitude: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[0-9.-]*$')])],
                longitude: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[0-9.-]*$')])],

            }
            this.countryFormGroup = this.fb.group(countryFormData);
        }
        else {

            this.buildFlag = true;

            this.statusValue = editCountry.status;

            this.countryFormGroup = this.fb.group({
                countryLocale: this.fb.array([]),
                countryCode: editCountry.countryCode,
                currency: editCountry.currencyMaster.currencyId,
                storeFlag: editCountry.storeFlag == true ? 'Yes' : 'No',
                latitude: [editCountry.latitude, Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[0-9.-]*$')])],
                longitude: [editCountry.longitude, Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[0-9.-]*$')])],

            })
            this.prePopulatecurrencyOid = editCountry.currencyMaster.currencyId;
            this.getAllCurrencies(this.prePopulatecurrencyOid);
            this.countryLocale();
            this.toggleVal = editCountry.status == 'ONLINE' ? true : false;

            this.countryFlag = true;
            this.countryFormGroup.updateValueAndValidity();
        }
    }

    public updateCountry(formData) {
        this.countries = [];
        if (this.countryFormGroup.invalid) {
            this.showError = true;
        }
        else {
            formData.countryLocale.forEach((country, index) => {
                this.countries.push({
                    countryName: country.countryName,
                    languageId: this.countryData.countryLocales[index].languageId
                })
            })
            this.loading = true;
            this.showError = false;
            let createCountryReq = {
                countryId: this.countryId,
                countryLocale: this.countries,
                countryCode: formData.countryCode,
                currencyId: this.prePopulatecurrencyOid != undefined ? this.prePopulatecurrencyOid : null,
                storeFlag: formData.storeFlag == 'Yes' ? true : false,
                latitude: formData.latitude,
                longitude: formData.longitude,
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
            }
            console.log("contryReq = " + createCountryReq);
            let UPDATE_COUNTRY = environment.APIEndpoint + "api/rpa/master/country/v1/update";
            this.http.postJson(UPDATE_COUNTRY, createCountryReq)
                .subscribe((response) => {
                    console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "Country master has been updated successfully"
                        }
                    });
                    this.loading = false; 
                    sessionStorage.clear();
                    this.router.navigate(['/search-country']);
                }
                    , err => {
                        this.loading = false;
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 10000,
                            data: {
                                status: "failure",
                                message: "Your request cannot be saved at this time. Please try again later"
                            }
                        });
                        console.log("error Status = " + err.status);
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

    storeFlag;
    storeFlags = [
        { value: 'Yes', viewValue: 'Yes' },
        { value: 'No', viewValue: 'No' }
    ];

    // public getAllCurrencies(){
    //     let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
    //     this.http.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
    //     .subscribe((response) => {
    //         this.currencies=response;

    //     })
    // }

    getAllCurrencies(prePopulatecurrencyOid) {
        console.log(prePopulatecurrencyOid);


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
                for (let j = 0; j < this.Currencies.length; j++) {
                    if (this.Currencies[j].currencyId == this.prePopulatecurrencyOid) {
                        this.currencyCtrl.setValue(this.Currencies[j].currencyCode);
                    }
                }

            },
                (error) => {
                    console.log(error);
                });
    }
    private _filterCurrencies(value: string): Currency[] {
        const filterValue = value.toLowerCase();
        return this.Currencies.filter(curreny => curreny.currencyCode.toLowerCase().indexOf(filterValue) === 0);
    }

    oncurrencyChange(ev) {
        console.log(ev);
        this.prePopulatecurrencyOid = ev;
    }


}
