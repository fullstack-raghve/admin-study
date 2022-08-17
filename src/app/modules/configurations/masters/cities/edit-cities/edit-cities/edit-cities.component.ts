import {Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray,} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'edit-cities',
  templateUrl: './edit-cities.component.html',
  styleUrls: ['./edit-cities.component.scss']
})
export class EditCitiesComponent implements OnInit {
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
    @ViewChild("editCityForm")editCityForm;
    cityFormGroup:FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public showCityError:boolean = false;
    public statusValue:string;
    public cityId;
    public cityData:any=[];
    public countries:any=[];
    public buildFlag: boolean = false;
    public cityFlag: boolean = false;
    public toggleVal:boolean=false;
    public languageList: any = [];
    public cityLocales:any=[];
    public minLengthError=false;
    public alignCss=[];

    getLanguage() {
        this.languageList = [
            { code: 'EN', name: 'English' },
            { code: 'AR', name: 'Arabic' },
            { code: 'ITL', name: 'Italian' },
            { code: 'FR', name: 'French' }
        ]

    }
    constructor(private activatedRoute: ActivatedRoute,
        private http: HttpService, public snackBar: MatSnackBar,
        private fb: FormBuilder, private router: Router) {
        // this.activatedRoute.params.subscribe((params) => {
        //     this.cityId = params.id;

        // });

    }
    ngOnInit() {
        // this.getAllCountries();
        // this.getCityById();

        let data= localStorage.getItem('CitiesEditID');
        if(data){
            this.cityId = data;
            this.getAllCountries();
            this.getCityById();
            localStorage.removeItem('CitiesEditID')
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-cities'])
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

    getCityById() {
        let GET_CITY_BY_ID = environment.APIEndpoint + "api/rpa/master/city/v1/view";
        let request = {
            cityId: this.cityId
        }
        this.http.postJson(GET_CITY_BY_ID, request)
            .subscribe((response) => {
                console.log(response);
                this.cityData = response;
                this.buildEditCityForm(response);

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
  public toggleStatus(event){
      if(event.checked==true){
          this.statusValue='ONLINE';
      }else{
           this.statusValue='OFFLINE';
      }

  }
  public buildEditCityForm(editData){
      if (editData.cityCode == undefined) {
          let form = {
                cityLocale: this.fb.array([]),
                cityCode : ["",  Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9 ]{1,10}$")])],
                country: [""],

            }
            this.cityFormGroup=this.fb.group(form);
    }
    else{
        this.buildFlag = true;

        this.statusValue = editData.status;

        this.cityFormGroup = this.fb.group({
            cityLocale: this.fb.array([]),
            cityCode: editData.cityCode,
            country: editData.countryId,

        })
        this.cityLocale();
        this.toggleVal=editData.status == 'ONLINE' ? true : false;

        this.cityFlag = true;
        this.cityFormGroup.updateValueAndValidity();
    }
  }
  public cityLocale() {
      console.log("size = " + this.languageList.length);
       const control = <FormArray>this.cityFormGroup.controls['cityLocale'];
      for (let cn of this.cityData.cityLocales) {
          let arr= this.fb.group({
               cityName: [cn.cityName,Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(Globals.mulRegExpOnlyAlphaWithSplChar)])]
          });
          control.push(arr);
           this.alignCss.push(cn.languageDirection == 'RTL' ? 'text-right' : '');
      }

  }

  updateCity(formData){
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
                   languageId:this.cityData.cityLocales[index].languageId
              })
          })

              let updateCityReq = {
                  cityId:this.cityId,
                  cityLocales: this.cityLocales,
                  cityCode: formData.cityCode,
                  countryId: parseInt(formData.country),
                  status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
              }
              let UPDATE_CITY = environment.APIEndpoint + "api/rpa/master/city/v1/update";
              this.http.postJson(UPDATE_CITY, updateCityReq)
                  .subscribe((response) => {
                      console.log(response);
                      this.snackBar.openFromComponent(SnackBarComponent, {
                          duration: 10000,
                          data: {
                              status: "success",
                              message: "City master has been updated successfully"
                          }
                      });
                      this.loading = false;
                      sessionStorage.clear();
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
