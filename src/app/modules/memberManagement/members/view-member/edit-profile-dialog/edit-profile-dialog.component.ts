import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA ,MatSnackBar,MatTableDataSource} from '@angular/material';
import {FormControl, Validators, FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

export interface Country {
  countryId: number;
  countryName: string;
}

export interface City {
  cityId: number;
  cityName: string;
}

export interface Nationality {
  countryId: number;
  countryName: string;
}

@Component({
  selector: 'edit-profile-dialog.component',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {
  public basicDetails;
  public memberId;
  public countries:any=[];
  public cities:any=[];
  public maxDOB:Date; 

  customerProfileFormGroup:FormGroup;

  public countryId;
  public countryList;
  Countries: Country[] = [];
  countryCtrl = new FormControl();
  filteredCountries: Observable<Country[]>;

  public cityId;
  public cityList;
  Cities: City[] = [];
  cityCtrl = new FormControl();
  filteredCities: Observable<City[]>;

  public nationalityId;
  public nationalityList;
  Nationalities: Nationality[] = [];
  nationalityCtrl = new FormControl();
  filteredNationaties: Observable<Nationality[]>;
  populateCityId: number;

  constructor(private dialogRef: MatDialogRef<MatDialog>,private https: HttpService, private activatedRoute: ActivatedRoute,private fb: FormBuilder,
    public snackBar: MatSnackBar) {

    dialogRef.disableClose = true;
    this.maxDOB = new Date();
    this.maxDOB.setFullYear(this.maxDOB.getFullYear()-15);
  }

  ngOnInit() {
      this.buildEditForm(this.basicDetails);
      console.log(this.basicDetails);
  }

    onCloseClick(): void {
      this.dialogRef.close();
    }

  
  public buildEditForm(editData){
    this.getAllNationalityA(editData.nationalityOid==null? '':editData.nationalityOid);
    this.getAllCountriesA(editData.countryOid==null? '':editData.countryOid);
    this.getAllCitiesA(editData.countryOid==null? '':editData.countryOid.toString(), editData.cityOid==null? '':editData.cityOid.toString());

    let form={
      firstName:[editData.firstName,Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \s]*')])],
      lastName:[editData.lastName,Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \s]*')])],
      gender:[editData.gender,Validators.required],
      address:[editData.address],
      countryOid:[editData.countryOid==null? '':editData.countryOid.toString(),Validators.required],
      nationalityOid:[editData.nationalityOid==null? '':editData.nationalityOid.toString(),Validators.required],
      cityOid:[editData.cityOid==null? '':editData.cityOid.toString(),Validators.required],
      dateOfBirth:[new Date(editData.dateOfBirth),Validators.required]
    }
   

    this.customerProfileFormGroup=this.fb.group(form);
  }

  public getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/onlineCountries";
    this.https.getJson(GET_ALL_COUNTRIES)
        .subscribe((response) => {
            this.countries = response;
        })
  }

  public getAllCities(countryId, populateCityId) {
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
    this.https.getJson(GET_ALL_CITIES + "?countryIds="+countryId)
    .subscribe((response) => {
        this.cities = response;

        if(populateCityId!=undefined && populateCityId!=''){
          this.customerProfileFormGroup.patchValue({
              cityOid:populateCityId
          });
          this.customerProfileFormGroup.get('cityOid').setValidators([Validators.required]);
          this.customerProfileFormGroup.get('cityOid').updateValueAndValidity();
      }else{
        this.customerProfileFormGroup.patchValue({cityOid:''});
        this.customerProfileFormGroup.get('cityOid').setValidators([Validators.required]);
        this.customerProfileFormGroup.get('cityOid').updateValueAndValidity();
      }

    })
  }

  getAllCountriesA(populateCountryId) {
    console.log(populateCountryId);
    this.cityId = '';
    this.cityCtrl.reset('');
    this.cityList = [];
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/onlineCountries";
    this.https.getJson(GET_ALL_COUNTRIES)
        .subscribe((response) => {
            // console.log(response);
            this.countryList = [];
            this.Countries = [];
            this.countryList = response;
            for (let i = 0; i <= this.countryList.length - 1; i++) {
                let objMallkey = {
                    countryId: this.countryList[i]['countryId'],
                    countryName: this.countryList[i]['countryName'],
                }
                // console.log(objMallkey);
                this.Countries.push(objMallkey);
            }
            this.filteredCountries = this.countryCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(country => country ? this._filterCountries(country) : this.Countries.slice())
                );
                for (let j = 0; j < this.Countries.length; j++) {
                  if (this.Countries[j].countryId == populateCountryId) {
                      this.countryCtrl.setValue(this.Countries[j].countryName);
                  }
                }
        },
            (error) => {
                console.log(error);
            });
}
private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.Countries.filter(country => country.countryName.toLowerCase().indexOf(filterValue) === 0);
}

getAllNationalityA(populateNationality) {
  let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
  this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
          // console.log(response);
          this.nationalityList = [];
          this.Nationalities = [];
          this.nationalityList = response;
          for (let i = 0; i <= this.nationalityList.length - 1; i++) {
              let objMallkey = {
                  countryId: this.nationalityList[i]['countryId'],
                  countryName: this.nationalityList[i]['countryName'],
              }
              // console.log(objMallkey);
              this.Nationalities.push(objMallkey);
          }
          this.filteredNationaties = this.nationalityCtrl.valueChanges
              .pipe(
                  startWith(''),
                  map(country => country ? this._filterNationalities(country) : this.Nationalities.slice())
              );
              
              for (let j = 0; j < this.Nationalities.length; j++) {
                if (this.Nationalities[j].countryId == populateNationality) {
                    this.nationalityCtrl.setValue(this.Nationalities[j].countryName);
                }
              }
      },
          (error) => {
              console.log(error);
          });
}
private _filterNationalities(value: string): Nationality[] {
  const filterValue = value.toLowerCase();
  return this.Nationalities.filter(country => country.countryName.toLowerCase().indexOf(filterValue) === 0);
}



  getAllCitiesA(countryId,populateCityId) {
    console.log(countryId);
    this.cityId = '';
    this.cityCtrl.reset('');
    this.cityList = [];
    if(countryId != undefined || countryId != ''){
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
    this.https.getJson(GET_ALL_CITIES + "?countryIds=" +  countryId)
        .subscribe((response) => {
            console.log(response);
            this.cityList = [];
            this.Cities = [];
            this.cityList = response;
            for (let i = 0; i <= this.cityList.length - 1; i++) {
                let objMallkey = {
                    cityId: this.cityList[i]['cityId'],
                    cityName: this.cityList[i]['cityName'],
                }
                // console.log(objMallkey);
                this.Cities.push(objMallkey);
            }
            this.filteredCities = this.cityCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(city => city ? this._filterCities(city) : this.Cities.slice())
                );

                for (let j = 0; j < this.Cities.length; j++) {
                  if (this.Cities[j].cityId == populateCityId) {
                      this.cityCtrl.setValue(this.Cities[j].cityName);
                  }
              }
        },
            (error) => {
                console.log(error);
            });
}
}
private _filterCities(value: string): City[] {
    const filterValue = value.toLowerCase();
    return this.Cities.filter(city => city.cityName.toLowerCase().indexOf(filterValue) === 0);
}

getAllcountry(countryId) {
  this.countryId = countryId;
  console.log(this.countryId);
}

getAllNationality(countryId){
  this.nationalityId = countryId;
  console.log(this.nationalityId);
}

getAllcity(cityId){
    this.cityId = cityId;
    console.log(this.cityId);
}

  public updateCustomerProfile(fromData){
    console.log(fromData);
    console.log(this.cityId);
    console.log(this.countryId)
      let body={
        customerOid:this.basicDetails.customerOid,
        firstName:fromData.firstName,
        lastName:fromData.lastName,
        address:fromData.address,
        gender:fromData.gender,
        cityOid:parseInt(this.cityId == undefined || this.cityId == ''? fromData.cityOid : this.cityId),
        countryOid:parseInt(this.countryId == undefined || this.countryId == ''? fromData.countryOid : this.countryId),
        nationalityOid:parseInt(this.nationalityId == undefined || this.nationalityId == ''? fromData.nationalityOid : this.nationalityId),
        dateOfBirth:moment(fromData.dateOfBirth).format("YYYY-MM-DD")
    }

    let UPDATE_BASIC_DETAILS = environment.APIEndpoint+"api/rpa/memberMgmt/v1/update";
    this.https.postJson(UPDATE_BASIC_DETAILS,body)
              .subscribe((response) => {
                  this.snackBar.openFromComponent(SnackBarComponent, {
                          duration: 10000,
                          data: {
                              status: "success",
                              message: "Customer Profile have been updated successfully"
                          }
                  });
                  this.dialogRef.close();
              }
              ,err => {
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
                      this.dialogRef.close();
              });
    }

     public getFormValidationErrors(form: FormGroup) {
      console.log(form);
    }
}
