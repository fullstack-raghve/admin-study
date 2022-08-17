import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { environment } from 'src/environments/environment';

export interface City {
  cityId: number;
  cityName: string;
}

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss']
})
export class EditLocationComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
    title: 'Home',
    link: ''
  },
  {
    title: 'Events',
    link: '/edit-location'
  }
  ];
  editLocationForm:FormGroup;
  //loading:boolean = true;

  public languageList = JSON.parse(localStorage.getItem("languageList"));
  alignCss = [];
  public countries:any=[];
  cityList: any[];
  Cities: any[];
  cityCtrl = new FormControl('',Validators.required);
  mylocationData: any;

  filteredCities: Observable<City[]>;
  public locationData:any = [];
  selectedCountryOptions: any[];
  mycountry: any[];

  public newlocationData:any = [];

  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  public isLatValid:boolean;
  public latMssg;
  public isLongValid:boolean;
  public longMssg;
  public loading:boolean;
  buildFlag: boolean;
  finalcountryOid: any;
  finalcountryOidnew: any;
  locationid: any;
  isInvalidLong2: boolean;
  isInvalidLat2: boolean;
  constructor(private fb:FormBuilder,private http:HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar
    ) { }

  ngOnInit() {
   // this.loadData();
  // let locationid = this.activatedRoute.snapshot.params.id;
this.locationid = this.activatedRoute.snapshot.params.id;
    this.viewLocation(this.locationid);

   
    //this.giftLanguageList();
  }


  // loadData(){
  //   this.locationData = {
  //      "locationName":"The Duabi Mall",
  //      "country":'India',
  //      "city":"Noida",
  //      "address":"The Duabi Mall",
  //      "lat":22.42,
  //      "long":52.25,
  //      "eventNamesTnc":[
  //       {
  //       "languageCode":"en",
  //       "languageName": "english",
  //       "termsandconditions": "sdfgh",
  //       "name":"test event",
       
  //     },
  //     {
  //       "languageCode":"ar",
  //       "languageName": "arabic",
  //       "name":"test event in arabic",
  //       "termsandconditions": "sdfgh",
       
  //     }
  //   ],
  //   }
  // }
  buildLocationForm(formdata){
    this.buildFlag = true;
    let form = {
    //  locName:[this.locationData['locationName'],Validators.required],
      giftLanguageList: this.fb.array([]),
      country:['',Validators.required],
      cityy:['',Validators.required],
      address:[formdata.address,Validators.required],
      lat:[formdata.latitude,Validators.required],
      long:[formdata.longitude,Validators.required],
    }
    this.editLocationForm = this.fb.group(form);
  //  this.editLocationForm.get('country').patchValue(this.locationData['country']);
  ///  this.selectedCountryOptions = this.locationData['country'];

  const control = <FormArray>this.editLocationForm.controls['giftLanguageList'];
  for (let i = 0; i < formdata['location'].length; i++) {
    let newForm = this.fb.group({
      locationName: [this.newlocationData['location'][i]['locationName'], Validators.required],
      languageCode: this.newlocationData['location'][i]['languageCode'],
    });
    control.push(newForm);
    //this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
  }

      }


      numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    
      }
      isNumberKey(event) {
        //debugger;
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode == 46 && event.srcElement.value.split('.').length>1) {
            return false;
        }
        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }


  getAllCountries(formdata) {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.http.getJson(GET_ALL_COUNTRIES)
        .subscribe((response) => {
           // console.log('countries>>',response);
            this.countries = response;


            let countryDefault = this.countries.find(c => c.countryId === formdata.countryOid);

///console.log('countryDefault',countryDefault);

this.editLocationForm.get('country').setValue(countryDefault.countryName);
this.getAllCities(formdata.countryOid,formdata.cityOid)
//cityOid
            let TempCountryArray1=[]
              let TempCountryArray2=[161,162];
  
            for(let i=0;i<=this.countries.length-1;i++){
              TempCountryArray1.push(this.countries[i]['countryId']);
            }
          //  this.editLocationForm.get('country').patchValue(TempCountryArray2);
         //   this.selectedCountryOptions = TempCountryArray2;
         //   console.log('temp array',TempCountryArray1)
            if(this.countries.length == TempCountryArray2.length){
                this.countryInput.selectAllChecked = true;
            }

        })
}

getAllCities(countryOid,cityOid) {
  console.log('cityOid',cityOid);
  console.log('countryOid',countryOid);

if(typeof(countryOid) === 'string'){
console.log('string is');
let onchangeCountryy = this.countries.find(c => c.countryName === countryOid);
console.log('onchangeCountryy',onchangeCountryy);
this.finalcountryOidnew = onchangeCountryy.countryId;

let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
this.http.getJson(GET_ALL_CITIES + "?countryIds="+this.finalcountryOidnew)
.subscribe((response) => {
   console.log('GET_ALL_CITIES',response);
   this.cityList = [];
   this.Cities = [];
   this.cityList = response;
//   8357
this.editLocationForm.get('cityy').reset();

//let cityDefault = this.cityList.find(c => c.cityId === cityOid);

//console.log('cityDefault',cityDefault);

//this.editLocationForm.get('cityy').setValue(cityDefault.cityName);


///////////
  for (let i = 0; i <= this.cityList.length - 1; i++) {
    let cityObj = {
      cityId: this.cityList[i]['cityId'],
      cityName: this.cityList[i]['cityName'],
    }
    this.Cities.push(cityObj);
  }
  this.filteredCities = this.cityCtrl.valueChanges
      .pipe(
        startWith(''),
        map(city => city ? this._filterCities(city) : this.Cities.slice())
      );
////////////


},
  (error) => {
    console.log(error);
  });

}else{
  console.log('not string');

  this.finalcountryOid = countryOid;

  let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
  this.http.getJson(GET_ALL_CITIES + "?countryIds="+this.finalcountryOid)
  .subscribe((response) => {
     console.log('GET_ALL_CITIES',response);
     this.cityList = [];
     this.Cities = [];
     this.cityList = response;
  //   8357

  let cityDefault = this.cityList.find(c => c.cityId === cityOid);

  console.log('cityDefault',cityDefault);
  
  this.editLocationForm.get('cityy').setValue(cityDefault.cityName);


/////////
    for (let i = 0; i <= this.cityList.length - 1; i++) {
      let cityObj = {
        cityId: this.cityList[i]['cityId'],
        cityName: this.cityList[i]['cityName'],
      }
      this.Cities.push(cityObj);
    }
    this.filteredCities = this.cityCtrl.valueChanges
        .pipe(
          startWith(''),
          map(city => city ? this._filterCities(city) : this.Cities.slice())
        );

/////////

  },
    (error) => {
      console.log(error);
    });


}



//   let countryDefault = this.countries.find(c => c.countryId === data);
// let ciid = countryDefault.countryId
  

}




private _filterCities(value: string): City[] {
  const filterValue = value.toLowerCase();
  return this.Cities.filter(city => city.cityName.toLowerCase().indexOf(filterValue) === 0);
}

public cityId;

getAllcity(cityname){
   // this.cityId = cityId;
    console.log('cityname',cityname);

    this.cityList

    let newCityID =  this.cityList.find(c => c.cityName === cityname);
    this.cityId = newCityID.cityId;

}


         
        viewLocation(locationid){
          let data = {
             "locationOid": +locationid,
            "languageCode": "en"
           }
           this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin_location/view_location',data).subscribe(res => {
             console.log('view location res',res);
             let data = res['output'];
             if(data){
               this.mylocationData = data;
               this.newlocationData = data[0];
               console.log('new data mylocationData',this.mylocationData);
              // console.log('lengthhhhh',this.mylocationData['location'].length);
               console.log('lengthhhhh1',this.newlocationData['location'].length);

               console.log('new data',this.newlocationData);

               this.buildLocationForm(this.newlocationData);
               this.getAllCountries(this.newlocationData);

             }
           })
         
         }
         public giftLanguageList() {
          const control = <FormArray>this.editLocationForm.controls['giftLanguageList'];
          for (let i = 0; i < this.newlocationData['location'].length; i++) {
            let newForm = this.fb.group({
              locationName: [this.newlocationData['location'][i]['locationName'], Validators.required],
              languageCode: this.newlocationData['location'][i]['languageCode'],
            });
            control.push(newForm);
            //this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
          }
        }
        editLocation(formdata){
   

          if(!this.editLocationForm.valid){
   //alert('invalid form')
          }else{
            this.loading = true;
   
   let multiLingulal = this.editLocationForm.controls['giftLanguageList'].value;
   
   

   let newCityID =  this.cityList.find(c => c.cityName === formdata.cityy);
   this.cityId = newCityID.cityId;


   let onchangeCountryy = this.countries.find(c => c.countryName === formdata.country);
let contryid = onchangeCountryy.countryId;
   

     let reqbody = {
      
        "locationOid": +this.locationid,
          "location":multiLingulal,
          "countryOid": +contryid,
          "cityOid" : +this.cityId,
          "address" :formdata.address,
          "latitude":+formdata.lat,
          "longitude":+formdata.long 
        
     }
     console.log('req body',reqbody);
  

   this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin_location/edit_location',reqbody).subscribe(res => {
     console.log('res of edit location',res);
     this.loading = false;
       this.snackBar.openFromComponent(SnackBarComponent, {
       duration: 5000,
       data: {
         status: "success",
         message: "Location  Updated successfully"
       }
     });
    // this.loading = false;
     this.router.navigate(['/search-locations']);
   }
     , err => {
       this.loading = false;
       console.log("error Status = ", err);
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


        editLocation1(formdata){
          console.log('submitted from val',formdata);
          console.log('cityId',this.cityId);
   
          if(!this.editLocationForm.valid){
   //alert('invalid form')
          }else{
            this.loading = true;
   let data = {
     "location":formdata.locName,
     "contry":+formdata.country,
     "city":this.cityId,
     "address":formdata.address,
     "latitude":formdata.lat,
     "longitude":formdata.long
   }
   
   console.log('add address',data);
   //[routerLink]="['/search-locations']"
   this.router.navigate(['/search-locations']);
   
   this.http.postJson(environment.APIEndpoint + "", data)
   // this.http.postJson(environment.APIEndpoint + "api/rpa/productcategory/v1/create", data)
   
   .subscribe((response) => {
     this.snackBar.openFromComponent(SnackBarComponent, {
       duration: 10000,
       data: {
         status: "success",
         message: "Location  Updated successfully"
       }
     });
     this.loading = false;
     this.router.navigate(['/search-locations']);
   }
     , err => {
       this.loading = false;
       console.log("error Status = ", err);
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

   latValidate(latitude){
    if (latitude < -90 || latitude > 90) {
      this.isLatValid = true;
      this.latMssg  = 'Latitude must be between -90 and 90 degrees inclusive.'
      this.editLocationForm.controls['lat'].setErrors({ 'incorrect': true});
      this.editLocationForm.controls['lat'].markAsTouched();
    }else{
      this.isLatValid = false;
      this.latValidateKey(latitude)
    }
          }

          latValidateKey(value) {
      
     
          
             let r = new RegExp(/^-?[0-9]\d*(\.\d+)?$/);
      
          if(r.test(value)){
           this.isInvalidLat2 = false;
 
      
          }else{
          this.isInvalidLat2 = true;
          this.editLocationForm.controls['lat'].setErrors({ 'incorrect': true});
          this.editLocationForm.controls['lat'].markAsTouched();
          }
          }
    
          longValidate(lng){
            if (lng < -180 || lng > 180) {
               this.isLongValid = true;
               this.longMssg  = 'Longitude must be between -180 and 180 degrees inclusive.'
               this.editLocationForm.controls['long'].setErrors({ 'incorrect': true});
               this.editLocationForm.controls['long'].markAsTouched();
             }else{
               this. longValidateKey(lng)
               this.isLongValid = false;
             }
          
          }

          longValidateKey(value) {
      
            let r = new RegExp(/^-?[0-9]\d*(\.\d+)?$/);
     
         if(r.test(value)){
          this.isInvalidLong2 = false;
    
         }else{
         this.isInvalidLong2 = true;
         this.editLocationForm.controls['long'].setErrors({ 'incorrect': true});
         this.editLocationForm.controls['long'].markAsTouched();
         }
         }
}
