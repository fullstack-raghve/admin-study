import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder, FormArray} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';

export interface Currency {
    currencyName: string;
    languageId: number;
}

@Component({
  selector: 'edit-currency',
  templateUrl: './edit-currency.component.html',
  styleUrls: ['./edit-currency.component.scss']
})
export class EditCurrencyComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Currency',
          link: '/search-currency'
      }
    ];
    @ViewChild("editCurrencyForm") editCurrencyForm;
    currencyFormGroup: FormGroup;
    public showCurrencyError: boolean = false;
    public loading: boolean = false;
    public showError: boolean = false;
    public currencyId;
    public currencyData: any = [];
    public statusValue: string;
    selectedLanguage = 'option';
    currencyName = new FormControl();
    public languageList: any = [];
    public currencyArr: any = [];
    public arr: any = [];
    public buildFlag: boolean = false;
    public currencyFlag: boolean = false;
    public toggleVal:boolean ;
    currencyLocales: Currency[] = [];
    public alignCss=[];

    constructor(private activatedRoute: ActivatedRoute,
        private http: HttpService, private fb: FormBuilder,
        private router: Router, public snackBar: MatSnackBar) {
        // this.activatedRoute.params.subscribe((params) => {
        //     this.currencyId = params.id;

        // });

    }

    ngOnInit() {
        // this.getCurrencyById();
        let data=localStorage.getItem('CurrencyEditID');
        if(data){
            this.currencyId=data;
            this.getCurrencyById();
          localStorage.removeItem('CurrencyEditID')
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-currency'])
        }
    }
    public getCurrencyById(){
        let GET_CURRENCY_BY_ID = environment.APIEndpoint+"api/rpa/master/currency/v1/view";
        let request = {
            currencyId:this.currencyId
        }
        this.http.postJson(GET_CURRENCY_BY_ID,request)
        .subscribe((response) => {
                console.log(response);
                this.currencyData= response;
                this.buildEditCurrencyForm(response);
                this.toggleVal = (this.currencyData.status=='ONLINE'?true:false);

            }
            ,err => {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: "Your request cannot be saved at this time. Please try again later"
                    }
                });
                console.log("error Status = "+err.status);

            })
    }
    public currencyLocale() {

        const control = <FormArray>this.currencyFormGroup.controls['currencyLocale'];
        for (let cn of this.currencyData.currencyLocales) {
            let arr= this.fb.group({
                 currencyName: [cn.currencyName,Validators.compose([Validators.required, Validators.minLength(2),Validators.pattern(Globals.mulRegExpOnlyAlphaWithSplChar)])]
            });
            control.push(arr);
             this.alignCss.push(cn.languageDirection == 'RTL' ? 'text-right' : '');
        }
    }

    private buildEditCurrencyForm(editCurrency) {
        if (editCurrency.currencyCode == undefined) {
            let countryFormData = {
                currencyLocale: this.fb.array([]),
                currencyCode: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]{1,15}$')])],

            }
            this.currencyFormGroup = this.fb.group(countryFormData);
        }
        else {

            this.buildFlag = true;

            this.statusValue = editCurrency.status ;

            this.currencyFormGroup = this.fb.group({
                currencyLocale: this.fb.array([]),
                currencyCode: [editCurrency.currencyCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]{1,15}$')])],

            })
            this.currencyLocale();
            this.toggleVal=editCurrency.status == 'ONLINE' ? true : false;

            this.currencyFlag = true;
            this.currencyFormGroup.updateValueAndValidity();
        }
    }

    updateCurrency(formData)
    {

    if (this.currencyFormGroup.invalid == true) {
        this.showError = true;
    }
    else {
        this.loading = true;
        this.showError = false;
        formData.currencyLocale.forEach((currency, index)=>{
            this.currencyLocales.push({
                currencyName:currency.currencyName,
                 languageId:this.currencyData.currencyLocales[index].languageId
            })
        })
        let createCurrencyReq = {
            currencyId: this.currencyId,
            currencyLocales: this.currencyLocales,
            currencyCode: formData.currencyCode,
            status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
        }
        console.log("contryReq = " + createCurrencyReq);
        let UPDATE_CURRENCY = environment.APIEndpoint + "api/rpa/master/currency/v1/update";
        this.http.postJson(UPDATE_CURRENCY, createCurrencyReq)
            .subscribe((response) => {
                console.log(response);
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "success",
                        message: "Currency master has been updated successfully"
                    }
                });
                this.loading = false;
                sessionStorage.clear();
                this.router.navigate(['/search-currency']);
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
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }

    }


}
