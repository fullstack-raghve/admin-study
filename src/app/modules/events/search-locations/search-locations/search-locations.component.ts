import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, MatSelect, MatSort, MatTableDataSource, Sort } from '@angular/material';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';

export interface UserData {
  
  id: number;
  locationName: string;
  country: string,
  city: string;
}


@Component({
  selector: 'app-search-locations',
  templateUrl: './search-locations.component.html',
  styleUrls: ['./search-locations.component.scss']
})
export class SearchLocationsComponent implements OnInit {
  public searcheventLocationForm: FormGroup;

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Events',
    link: ''
  },
  ];
  loading:boolean = true;
  ///////
  
  public displayedColumns: string[] = ['locationName','address','countryName','cityName'];
  cityy = new FormControl();
  selectedmulticity;
  public status = true;
  public dataSource;
  public searchGiftVal: boolean = true;
  public noRecords: boolean = false;
  rewardDetails=[]
  storeIdDetails=[]
  corporateDetails=[]
 countryList: any = [];
 selectedCityOptions: any[];
 selectedBrandOptions: any[];
 selectedMallOptions: any[];
 selectedStoreOptions: any[];
 cities: any[];
 cityList: any = [];
 public brandValueList;
 mallListall: any[];
 mallList: any = [];
 brands: any[];
  public storeList;
  public countryIdval;
  @ViewChild(MatSelect) select: MatSelect;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  notification_data: UserData[] = []
  cardName: any;
  venueDetails: any=[];
  statusDetails: any=[];
  venueDetails1: any=[];
  selectedvvvvOptions: any[];
  venueDetails2: any[];
  sstatusDetails: any[];
  Dataresult: any;
  eventData: any[];
  countries: any[];
  selcountryId: any;
///////////////////

public resultsLength = 0;
public paginationData;
paginationDetail = new BehaviorSubject(
  {
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });


  constructor(private fb: FormBuilder, private https: HttpService) { 


  }


  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };

this.buidEventLocationForm();
this.fetchAllLOcation();
   // this.searchVal();
   this.getAllCountries();
  // this.getStatus();
  /// this.getReward();
  /// this.getVenue();
 //  this.getJsonTable();
   
}
 

   openFilter() {
    this.status = !this.status;
  }

 

  buidEventLocationForm() {
    this.searcheventLocationForm = this.fb.group({
      searchcardOid: [""],
     // startDate: [""],
    //  endDate: [""],
    country: [''],
   //   Brand:[''],
      cityName:[''],
   //   venue:[''],
   //   status:[''],
   //   rewardType:[''],
    });
   
  }
////////////////////////
searchVal() {
 
  let formData=this.searcheventLocationForm.value;
 console.log(formData);
 let start = formData.startDate;
 let end = formData.endDate;
 if(formData.startDate != ''){
   start = moment(formData.startDate).format('YYYY-MM-DD');
 }
 if(formData.endDate != '')
 {
   end = moment(formData.endDate).format('YYYY-MM-DD')
 }
let data={
 "brandId": formData.Brand,
 "countryId":formData.Country,  
 "status":formData.status,
 "city":formData.cityName,
 "startDate":start,
 "endDate":end,
 "rewardType":formData.rewardType,
 "venue": formData.venue,
 "languageCode":"en"
}
console.log(JSON.stringify(data));

this.https.postCustomizeJson('https://uoieiz443h.execute-api.ap-south-1.amazonaws.com/eventgifting_sit/rest/api/v1/event_admin/search_event', data).subscribe(res => {
 console.log(res['output']);
 console.log(JSON.stringify(res['output']));

 this.Dataresult=res['output']
 this.notification_data=res['output']
 this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
 this.dataSource.paginator = this.paginator;
 this.dataSource.sort = this.sort;
 this.searchGiftVal = false;
 
 if (this.Dataresult == "No data found") {
   this.noRecords = true;
 } else {
   this.noRecords = false;
 }
})

}

getUpdate(event) {

 // sessionStorage.setItem('paginationData',JSON.stringify(event));
  this.paginationDetail.next(event);
  this.paginationData = event;
  this.fetchAllLOcation();


}

// country list
// getAllCountries() {
//  const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
//  this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
//    console.log('GET_ALL_COUNTRIES',res);
//    res.forEach(res => {
//      this.countryList.push({
//        'countryId': res.countryId,
//        'countryCode': res.countryCode,
//        'languageDirection': res.languageDirection,
//        'countryName': res.countryName,
//        'value': res.countryId,
//        'currencyCode': res.currencyCode

//      });
//    });
//    console.log(this.countryList);
//  }, err => {
//    console.log(err);
//  });
// }


getAllCountries() {
  let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
  this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
          this.countries = response;
      })
  
}

filterCity(countryId){
console.log('countryId',countryId);
this.selcountryId = countryId;
this.selectedCityOptions = [];
this.selectedmulticity  = [];
 if (countryId != '' && countryId != null && countryId != undefined) {
   // this.disabledCity = false;
   let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
   this.https.getJson(GET_ALL_CITIES + '?countryIds=' + countryId)
     .subscribe((response) => {
       console.log('cityyy',response);
       this.cities = response;
      
     })
 } else {
   this.cityList = [];
   this.selectedmulticity  = [];

  
 }
}
getAllCities(countryId) {
 // console.log(countryId);
 this.selectedCityOptions = [];
 this.selectedBrandOptions = [];
 this.selectedMallOptions = [];
 this.selectedStoreOptions = [];
 if (countryId != '' && countryId != null && countryId != undefined) {
   // this.disabledCity = false;
   let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
   this.https.getJson(GET_ALL_CITIES + '?countryIds=' + countryId)
     .subscribe((response) => {
       console.log(response);
       this.cities = response;
       response.forEach(response => {
         this.cityList.push({
           cityId: response.cityId,
           cityCode: response.cityCode,
           languageDirection: response.languageDirection,
           cityName: response.cityName,
           status: response.status,
           value: response.cityId,
         });
        /// this.getAllMallsCity(countryId, response.cityId);
         console.log(this.cityList);
         this.cityList = this.cities;
         var uniqueArray = this.removeDuplicatesJSON(this.cityList, 'cityId');
         console.log(uniqueArray);
         this.cityList = uniqueArray;
       }
       )
     })
 } else {
   this.cityList = [];
   this.brandValueList = [];
   this.mallList = [];
   this.storeList = [];
 }
}

getAllBrands(countryId) {
 // console.log(countryId);
 this.countryIdval = countryId;
 if (countryId != '' && countryId != null && countryId != undefined) {
   // this.disabledCity = false;
   let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandByRegionByCountryId" + '?countryOid=' + countryId;
   this.https.getJson(GET_ALL_ONLINE_BRANDS)
     .subscribe((response) => {
       // if (countryId.length != 0) {
         console.log(response);
         this.brands = response;
         response.forEach(response => {
           this.brandValueList.push({
             brandId: response.brandId,
             brandCode: response.brandCode,
             languageDirection: response.languageDirection,
             brandName: response.brandName,
             status: response.status,
             brandType: response.brandType,
             value: response.brandId,
           });
           this.brandValueList = this.brands;
           var uniqueArray = this.removeDuplicatesJSON(this.brandValueList, 'brandId');
           console.log(uniqueArray);
           this.brandValueList = uniqueArray;
         });
         console.log(this.brandValueList);
       // }
       // else {
       //   this.brandValueList = [];
       // }
     },
       (error) => {
         console.log(error);
       });
 } else {
   // this.disabledCity = true;
   // this.cityList = [];
   this.brandValueList = [];
 }
}
getAllMallsCity(ev, cityId) {
 // console.log(ev);
 // console.log(cityId);
}
removeDuplicatesJSON(originalArray, prop) {
 var newArray = [];
 var lookupObject = {};
 for (var i in originalArray) {
   lookupObject[originalArray[i][prop]] = originalArray[i];
 }
 for (i in lookupObject) {
   newArray.push(lookupObject[i]);
 }
 return newArray;
}


resetForm() {
  this.noRecords = false;
  this.selectedmulticity = [];
  this.selcountryId = ''
  this.searcheventLocationForm.get('searchcardOid').reset();
    // this.categoryInput.selectAllChecked = false;
    // this.addonInput.selectAllChecked = false;
    // this.selectedCategoryOptions=[];
    // this.selectedAddonOptions=[];

  ///this.select.empty = true;
 this.searcheventLocationForm.reset();
 this.fetchAllLOcation();
// this.searchVal();
}
applyFilter(filterValue: string) {
 this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.filteredData.length>0)  { 
     this.noRecords = false;
   } else{
     this.noRecords = true;
   } 
}
applyFilternew(filterValue: string){
console.log('filterValue',filterValue);

let formData=this.searcheventLocationForm.value;
 console.log(formData);
}

fetchAllLOcation(){
  let formData= this.searcheventLocationForm.value;


 let data2 = {
  "universalId": formData.searchcardOid ? formData.searchcardOid : "",
  "countryOid": this.selcountryId ? this.selcountryId : '',
  "cityOid": this.selectedmulticity ? this.selectedmulticity : [],
  "languageCode": "en" 
}
//console.log('req body',data2)

let data1 = {
    
  "universalId": formData.searchcardOid ? formData.searchcardOid : "",
"countryOid": this.selcountryId ? this.selcountryId : '',
"cityOid": this.selectedmulticity ? this.selectedmulticity : [],
"languageCode": "en" ,
 // "page":0,
 // "pageSize":0,
 //"order":{"column":"address","dir":"asc"}
 
 "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
 "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
 "order":{
  "column":this.sortColumn,
  "dir":this.sortDirection
   }

}
this.searchGiftVal = true;

// let url = 'https://uoieiz443h.execute-api.ap-south-1.amazonaws.com/eventgifting_sit/rest/api/v1/event_admin/view_events'
 this.https.postGiftingJson(environment.GiftingAPIEndpoint + 'rest/api/v1/event_admin_location/search_location', data1).subscribe(res => {
if(res['statusCode']===200){
  this.loading = false;
  let allLocation = res['output']['searchOutput'];
  this.dataSource = new MatTableDataSource<any>(allLocation);

  //this.dataSource = new MatTableDataSource<any>(eventData);
  this.resultsLength = res['output']["totalCount"];
// this.dataSource.paginator = this.paginator;
// this.dataSource.sort = this.sort;
this.searchGiftVal = false;
 // console.log('get all locations',res)
this.noRecords = false;
}
if(res['errorMessage']==='No data found'){
  let allLocation = []
  this.dataSource = new MatTableDataSource<any>(allLocation);

//alert('no data found');
this.noRecords = true;
this.loading = false;
this.searchGiftVal = false;

}
 },
 (error) => {
  this.noRecords = true;
  this.loading = false;
  this.searchGiftVal = false;
  let allLocation = []
  this.dataSource = new MatTableDataSource<any>(allLocation);

}
 )
}
public sortColumn = "";
public sortDirection = "desc";
//public sortDirection = "";
sortData(sort: Sort) {
console.log('sor>>>',sort)
  if (!sort.active || sort.direction == '') {
    this.sortColumn = "";
   // this.sortDirection = "";
    this.sortDirection = "desc";
    console.log('if>>>')

  } else {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction;
    console.log('else>>>')

  }

  this.fetchAllLOcation()
}

//  searchVal2() {

//    let formData=this.searcheventLocationForm.value;
//   console.log(formData);

//  let data={
//   "universalId": formData.searchcardOid,
//   "countryOid": "",
//   "cityOid": this.selectedmulticity ? this.selectedmulticity : [],
//   "languageCode": "en" 
//  }
//  console.log(JSON.stringify(data));
 
//  this.https.postCustomizeJson('https://uoieiz443h.execute-api.ap-south-1.amazonaws.com/eventgifting_sit/rest/api/v1/event_admin/search_event', data).subscribe(res => {
//   console.log(res['output']);
//   console.log(JSON.stringify(res['output']));
//   this.Dataresult=res['output']
//   this.notification_data=res['output']
//   this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
//   this.dataSource.paginator = this.paginator;
//   this.dataSource.sort = this.sort;
//   this.searchGiftVal = false;
//   if (this.Dataresult == "No data found") {
//     this.noRecords = true;
//   } 
 
// })
// }

// searchLocations(){
//   let formData=this.searcheventLocationForm.value;
//   console.log(formData);

//  let data={
//   "universalId":"",
//  "countryOid": null,
//  "cityOid": [],
//  "languageCode": "en" 
 
 
//  }
//   this.https.postGiftingJson(environment.GiftingAPIEndpoint + 'rest/api/v1/event_admin_location/search_location', data).subscribe(res => {
//     if(res){
//       this.loading = false;
//       let allLocation = res['output'];
//       this.dataSource = new MatTableDataSource<any>(allLocation);
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
   
//       console.log('filter loation res',res)
    
//     }
//      })
// }


}
