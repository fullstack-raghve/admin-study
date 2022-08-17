import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder, FormArray} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';

@Component({
  selector: 'add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.scss']
})
export class AddCurrencyComponent implements OnInit {
    @ViewChild("createCurrencyForm")createCurrencyForm;
    currencyFormGroup:FormGroup;
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Currency',
          link: '/search-currency'
      }
    ];
    checked = true;
    disabled = false;
    public showError: boolean = false;
    public loading: boolean = false;
    public showCurrencyError:boolean = false;
    public statusValue:string = 'ONLINE';
    public countryArr:any=[];
    public currencyLocales:any=[];
    public arr:any=[];
    public toggleVal:boolean=true;
    public alignCss=[];
    public languageList =JSON.parse(localStorage.getItem("languageList"));


  constructor(private fb: FormBuilder,private http:HttpService,
  private router: Router, public snackBar: MatSnackBar,) {
          this.buildCreateCurrencyForm();
  }

  ngOnInit() {
      this.currencyLocale();
  }

  public buildCreateCurrencyForm(){
      let form = {

          currencyLocale:this.fb.array([]),
          currencyCode:["", Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern('[a-zA-Z ]{1,15}$')])],

      }
      this.currencyFormGroup = this.fb.group(form);
  }
  public currencyLocale(){
        const control = <FormArray>this.currencyFormGroup.controls['currencyLocale'];
        for (let ln of this.languageList) {
            let arr= this.fb.group({
                 currencyName: ['',Validators.compose([Validators.required, Validators.minLength(2),Validators.pattern(Globals.mulRegExpOnlyAlphaWithSplChar)])]
            });
            control.push(arr);
             this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
        }
  }

  public addCurrency(formData){
      this.currencyLocales=[];
      if (this.currencyFormGroup.invalid == true) {
            this.showError = true;
        }
        else {
            this.loading = true;
            this.showError = false;

            formData.currencyLocale.forEach((currency, index)=>{
                this.currencyLocales.push({
                    currencyName:currency.currencyName,
                     languageId:this.languageList[index].languageId
                })
            })


                let createCurrencyReq = {
                    currencyLocales:this.currencyLocales,
                    currencyCode: formData.currencyCode,
    	            status: this.toggleVal==true ? 'ONLINE' : 'OFFLINE'
                }
                let CREATE_CURRENCY=environment.APIEndpoint+"api/rpa/master/currency/v1/create";
                this.http.postJson(CREATE_CURRENCY,createCurrencyReq)
                .subscribe((response) => {
                        console.log(response);
                        this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 10000,
                                data: {
                                    status: "success",
                                    message: "Currency master has been added successfully"
                                }
                        });
                        this.loading = false;
                        sessionStorage.clear();
                        this.router.navigate(['/search-currency']);
                    }
                    ,err => {
                            this.loading = false;
                            console.log("error Status = "+err);
                            if(err.error.errorType=='VALIDATION'){
                                this.snackBar.openFromComponent(SnackBarComponent, {
                                        duration: 10000,
                                        data: {
                                            status: "failure",
                                            message: err.error.errorDetails[0].description
                                        }
                                    });
                            }else{
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
  public toggleStatus(event){
      if(event.checked==true){
          this.statusValue='ONLINE';
      }else{
           this.statusValue='OFFLINE';
      }

  }


}
