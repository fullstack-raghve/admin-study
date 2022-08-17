import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { Router } from '@angular/router';
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
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
    title: 'Events',
    link: ''
  },
  {
    title: 'Add Location',
    link: '/add-location'
  }
  ];
  public languageList = JSON.parse(localStorage.getItem("languageList"));

  addLocationForm:FormGroup;
  //public languageList = JSON.parse(localStorage.getItem("languageList"));
  alignCss = [];
  public countries:any=[];
  cityList: any[];
  Cities: any[];
  cityCtrl = new FormControl('',Validators.required);
  filteredCities: Observable<City[]>;
  public isLatValid:boolean;
  public latMssg;
  public isLongValid:boolean;
  public longMssg;
  public loading:boolean;
  cityitems: any[];
  constructor(private fb:FormBuilder,private http:HttpService,private router: Router,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
this.buildLocationForm();
this.giftLanguageList();
this.getAllCountries();

  }

  buildLocationForm(){
let form = {
  //locName:['',Validators.required],
  giftLanguageList: this.fb.array([]),

  country:['',Validators.required],
  city:['',Validators.required],
  address:['',[Validators.required,Validators.maxLength(100)]],
  lat:['',Validators.required],
  long:['',Validators.required],

}
this.addLocationForm = this.fb.group(form);

  }
   public giftLanguageList() {
    const control = <FormArray>this.addLocationForm.controls['giftLanguageList'];
    for (let i = 0; i < this.languageList.length; i++) {
      let newForm = this.fb.group({
        locationName: ['', Validators.required],
        languageCode: this.languageList[i]['languageCode']
        
      });
      control.push(newForm);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }


  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.http.getJson(GET_ALL_COUNTRIES)
        .subscribe((response) => {
            console.log('countries>>',response);
            this.countries = response;

        })
}

getallcity(countryId){
  let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
  this.http.getJson(GET_ALL_CITIES + "?countryIds="+countryId)
  .subscribe((response) => {
     console.log('cityitems >>>',response);
     this.cityitems = response;
  })
}

getAllCities(countryId) {
  console.log(countryId);

  this.filteredCities = null;

let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
  this.http.getJson(GET_ALL_CITIES + "?countryIds="+countryId)
  .subscribe((response) => {
     console.log('GET_ALL_CITIES',response);
    this.cityList = [];
    this.Cities = [];
    this.cityList = response;

    for (let i = 0; i <= this.cityList.length - 1; i++) {
      let cityObj = {
        cityId: this.cityList[i]['cityId'],
        cityName: this.cityList[i]['cityName'],
      }
    //  console.log(cityObj);
      this.Cities.push(cityObj);
    }
    this.filteredCities = this.cityCtrl.valueChanges
        .pipe(
          startWith(''),
          map(city => city ? this._filterCities(city) : this.Cities.slice())
        );
  },
    (error) => {
      console.log(error);
    });
}

private _filterCities(value: string): City[] {
  const filterValue = value.toLowerCase();
  return this.Cities.filter(city => city.cityName.toLowerCase().indexOf(filterValue) === 0);
}

public cityId;

getAllcity(cityId){
    this.cityId = cityId;
    console.log('cityId',this.cityId);
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


  addLocation(formdata){
 //  console.log('formdata>>>',formdata)

       if(!this.addLocationForm.valid){
//alert('invalid form')
       }else{
         this.loading = true;

let multiLingulal = this.addLocationForm.controls['giftLanguageList'].value;


let data2 = {
  "location":multiLingulal,
  "countryOid" :+formdata.country,
  "cityOid" :+formdata.city,
  "address" :formdata.address,
   "latitude": +formdata.lat,
   "longitude": +formdata.long
   
   
  }
  
this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin_location/add_location',data2).subscribe(res => {
  console.log('res of add location',res);
    this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 5000,
    data: {
      status: "success",
      message: "Location  added successfully"
    }
  });
  this.loading = false;
  this.router.navigate(['/search-locations']);
}
  , err => {
    this.loading = false;
    console.log("error Status = ", err);
 
    err.error.errorMessage === 'Duplicate name not allowed' ? err.error.errorMessage = 'Please enter unique event name' : err.error.errorMessage;

    if (err.error.errorType == 'VALIDATION') {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 3000,
        data: {
          status: "failure",
          message:  err.error.errorMessage
        }
      });
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 3000,
        data: {
          status: "failure",
          message:  err.error.errorMessage
        }
      });
    }
  })
  


// let url = "https://uoieiz443h.execute-api.ap-south-1.amazonaws.com/eventgifting_sit/rest/api/v1/event_admin/add_location"
// this.http.postJson(environment.APIEndpoint + url, data).subscribe((response) => {
//   this.snackBar.openFromComponent(SnackBarComponent, {
//     duration: 10000,
//     data: {
//       status: "success",
//       message: "Location  added successfully"
//     }
//   });
//   this.loading = false;
//   this.router.navigate(['/search-locations']);
// }
//   , err => {
//     this.loading = false;
//     console.log("error Status = ", err);
//     if (err.error.errorType == 'VALIDATION') {
//       this.snackBar.openFromComponent(SnackBarComponent, {
//         duration: 10000,
//         data: {
//           status: "failure",
//           message: err.error.errorDetails[0].description
//         }
//       });
//     } else {
//       this.snackBar.openFromComponent(SnackBarComponent, {
//         duration: 10000,
//         data: {
//           status: "failure",
//           message: "Your request cannot be saved at this time. Please try again later"
//         }
//       });
//     }
//   })

}  
}

isInvalidLat2:boolean;
      latValidate(latitude){
if (latitude < -90 || latitude > 90) {
  this.isLatValid = true;
  this.latMssg  = 'Latitude must be between -90 and 90 degrees inclusive.'
  this.addLocationForm.controls['lat'].setErrors({ 'incorrect': true});
  this.addLocationForm.controls['lat'].markAsTouched();


}else{

  this.latValidateKey(latitude);
  this.isLatValid = false;

}
      }

 latValidateKey(value) {
      
     
           /// console.log(value);
            let r = new RegExp(/^-?[0-9]\d*(\.\d+)?$/);
     
         if(r.test(value)){
          this.isInvalidLat2 = false;

       //  console.log("true ",value);
         }else{
        ///console.log("false",value);
         this.isInvalidLat2 = true;
         this.addLocationForm.controls['lat'].setErrors({ 'incorrect': true});
         this.addLocationForm.controls['lat'].markAsTouched();
         }
         }

      

         isInvalidLong2:boolean;

      longValidate(lng){
        if (lng < -180 || lng > 180) {
           this.isLongValid = true;
           this.longMssg  = 'Longitude must be between -180 and 180 degrees inclusive.'
           this.addLocationForm.controls['long'].setErrors({ 'incorrect': true});
           this.addLocationForm.controls['long'].markAsTouched();
         }else{
           this.longValidateKey(lng)
           this.isLongValid = false;
         }
      
      }


      longValidateKey(value) {
      
        let r = new RegExp(/^-?[0-9]\d*(\.\d+)?$/);
 
     if(r.test(value)){
      this.isInvalidLong2 = false;

     }else{
     this.isInvalidLong2 = true;
     this.addLocationForm.controls['long'].setErrors({ 'incorrect': true});
     this.addLocationForm.controls['long'].markAsTouched();
     }
     }
}
