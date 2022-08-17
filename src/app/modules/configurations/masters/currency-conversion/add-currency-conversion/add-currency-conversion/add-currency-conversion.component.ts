import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Currency {
    currencyId: number;
    currencyCode: string;
}

@Component({
    selector: 'add-currency-conversion',
    templateUrl: './add-currency-conversion.component.html',
    styleUrls: ['./add-currency-conversion.component.scss']
})
export class AddCurrencyConversionComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Currency Conversion',
        link: '/search-currency-conversion'
    }
    ];
    public currencyIdValue;
    currencies;
    Currencies: Currency[] = [];
    currencyCtrl = new FormControl();
    filteredCurrencies: Observable<Currency[]>;
    checked = true;
    disabled = false;
    public conversionFormGroup: FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public statusValue: string = 'ONLINE';
    public baseCurrencyData: any = [];
    // public currencies:any=[];
    public toggleVal: boolean = true;
    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, public snackBar: MatSnackBar, private https: HttpService) {
        this.buildCreateConversionForm();
        this.getAllCurrencies();
        this.getBaseCurrency();
    }
    //currConversion = new FormControl('', [Validators.required, AddCurrencyConversionComponent.decimalNumberValidator]);


    public buildCreateConversionForm() {
        let form = {

            currency2: [""],
            conversionValue: ["", Validators.compose([Validators.required, this.decimalNumberValidator])],


        }
        this.conversionFormGroup = this.fb.group(form);
    }
    decimalNumberValidator(c: AbstractControl): { [key: string]: boolean } {
        console.log(c);

        let regex = /^([0-9]{0,8}(\.[0-9]{1,4})?)$/
        let number = regex.test(c.value) ? +c.value : NaN;
        if (number !== number) {
            return { 'value': true };
        }
        return null;

    }

    ngOnInit() {

    }
    addCurrencyConversion(formData) {
        if (this.conversionFormGroup.invalid == true) {
            this.showError = true;
        } else {
            let createConversionReq = {
                toCurrencyId: this.currencyIdValue,
                conversionValue: formData.conversionValue,
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
            }
            console.log("contryReq = " + createConversionReq);
            let CREATE_CURRENCY_CONVERSION = environment.APIEndpoint + "api/rpa/master/currencyconversion/v1/create";
            this.http.postJson(CREATE_CURRENCY_CONVERSION, createConversionReq)
                .subscribe((response) => {
                    console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "Currency conversion has been added successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-currency-conversion']);
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
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }

    }
    public getBaseCurrency() {
        let GET_BASE_CURRENCY = "api/rpa/master/currency/v1/getbasecurrency";
        this.http.getJson(environment.APIEndpoint + GET_BASE_CURRENCY)
            .subscribe((response) => {
                this.baseCurrencyData = response;

            })

    }
    //   public getAllCurrencies(){
    //       let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
    //       this.http.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
    //       .subscribe((response) => {
    //           this.currencies=response;

    //       })

    //   }

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
    oncurrencyChange(ev) {
        console.log(ev);
        this.currencyIdValue = ev;
    }
}
