import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Currency {
    currencyId: number;
    currencyCode: string;
}

@Component({
    selector: 'edit-currency-conversion',
    templateUrl: './edit-currency-conversion.component.html',
    styleUrls: ['./edit-currency-conversion.component.scss']
})
export class EditCurrencyConversionComponent implements OnInit {
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
    public prePopulatecurrencyOid;
    checked = true;
    disabled = false;
    public conversionFormGroup: FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public statusValue: string;
    public baseCurrencyData: any = [];
    // public currencies:any=[];
    public conversionId;
    public conversionData: any = [];
    public toggleVal: boolean = true;
    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, public snackBar: MatSnackBar, private https: HttpService,
        private activatedRoute: ActivatedRoute, ) {
        // this.activatedRoute.params.subscribe((params) => {
        //     this.conversionId = params.id;

        // });
        let editData = [];
        this.buildEditConversionForm(editData);
    }
    ngOnInit() {
        // this.getAllCurrencies();
        // this.getBaseCurrency();
        // this.getCurrencyConversion();
        let data = localStorage.getItem('CurrencyConversionEditID');
        if(data){
            this.conversionId=data;
            // this.getAllCurrencies();
            this.getBaseCurrency();
            this.getCurrencyConversion();
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-currency-conversion'])
        }
  
      }

    public buildEditConversionForm(editData) {
        if (editData.currencyConversionId == undefined) {
            let form = {
                currencyTo: [""],
                conversionValue: ["", Validators.compose([Validators.required, this.decimalNumberValidator])],

            }
            this.conversionFormGroup = this.fb.group(form);
        } else {
            this.conversionFormGroup.patchValue({
                currencyTo: editData.toCurrencyId,
                conversionValue: editData.conversionValue,

            })
        }
        this.prePopulatecurrencyOid = editData.toCurrencyId;
        this.statusValue = editData.status;
        this.toggleVal = this.conversionData.status == 'ONLINE' ? true : false;
        this.getAllCurrencies(this.prePopulatecurrencyOid);
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

    getCurrencyConversion() {
        let GET_CURRENCY_CONVERSION_BY_ID = "api/rpa/master/currencyconversion/v1/view";
        let request = {
            currencyConversionId: this.conversionId
        }
        this.http.postJson(environment.APIEndpoint + GET_CURRENCY_CONVERSION_BY_ID, request)
            .subscribe((response) => {
                console.log(response);
                this.conversionData = response;
                this.toggleVal = this.conversionData.status == 'ONLINE' ? true : false;
                this.buildEditConversionForm(response);
            })
    }
    updateCurrencyConversion(formData) {
        if (this.conversionFormGroup.invalid == true) {
            this.showError = true;
        } else {
            let createConversionReq = {
                currencyConversionId: this.conversionId,
                toCurrencyId: this.prePopulatecurrencyOid,
                conversionValue: formData.conversionValue,
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
            }
            console.log("contryReq = " + createConversionReq);
            let CREATE_CURRENCY_CONVERSION = environment.APIEndpoint + "api/rpa/master/currencyconversion/v1/update";
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
    getAllCurrencies(prePopulatecurrencyOid) {

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
