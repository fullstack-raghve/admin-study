import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../services/http-service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { BehaviorSubject } from 'rxjs';
import { Sort } from '@angular/material/sort';

export interface UserData {
  
  rpOID: number;
  eventName: string;
  rewardType: string,
  userCount: string;
  storesCount: string;
  customersAccepted: string;
  customersReceivedGifts: string; 
  eventStartDate: string;
  eventEndDate:string;
  createdOn:string;
  lastModified:string;
  status:string;
}

export interface TableData {
  rpOID: number
  eventName: string;
  giftingType: string,

      storeCount:number,
        	startDate: string,
        	startTime: string,
        	endDate: string,
        	endTime: string,
        	creationDate: string,
        	modifiedDate: string,
        	status: string
}


@Component({
  selector: 'app-search-events',
  templateUrl: './search-events.component.html',
  styleUrls: ['./search-events.component.scss']
})
export class SearchEventsComponent implements OnInit {

  public searcheventGiftingForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Search Events',
    link: ''
  },
  ];
 //public displayedColumns: string[] = [ 'rpOID','eventName', 'giftingType', 'storeCount', 'startDate','startTime',  'endDate','endTime','creationDate','modifiedDate','status'];
 public displayedColumns: string[] = [ 'eventId','eventName','BRAND_NAME', 'rewardType','userCount', 'storesCount', 'locationCount', 'eventStartDate','eventEndDate','createdOn','lastModified','ApprovalStatus','status'];
 public  brandDropdown = [];

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
  startDate: string;
  endDate: string;
  aprovetatusDetails: any[];
  //resultsLength: any;
  selectedLocationOptions :any[]; 

  public sortColumn = "";
  public sortDirection = "desc";
  //public sortDirection = "";

  public resultsLength = 0;
  public paginationData;
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });


  allLocationList: any;
  // cardOid: number;
  constructor(private fb: FormBuilder, private https: HttpService,) { }

  ngOnInit() {

    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    

    this.buidEventGiftingForm();
  
  //  this.getAllCountries();
    this.getStatus();
    this.getApproveStatus();
    this.getReward();
    this.getVenue();
    this.selectedBrands();
    this. fetchAllLOcation();
    //this.getJsonTable();
    this.filterAndGetEvents();

  }

  openFilter() {
    this.status = !this.status;
  }

  buidEventGiftingForm() {
    this.searcheventGiftingForm = this.fb.group({
      searchcardOid: [""],
      startDate: [""],
      endDate: [""],
      //Country: [''],
      Brand:[''],
      //cityName:[''],
      location:[''],
      status:[''],
      approveStats:[''],
      rewardType:['']
    });
   
  }
  
  searchVal2() {
 
     let formData=this.searcheventGiftingForm.value;
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


@ViewChild('countryyInput') countryyInput: SelectAutocompleteComponent;
selectedCountryOptions :any[];
selectedVenueOptions:any[];
selectedstatusOptions:any[];
selectedrewardType:any[];

@ViewChild('brandType') brandType : SelectAutocompleteComponent;
@ViewChild('rewardType') rewardType : SelectAutocompleteComponent;
@ViewChild('statusType') statusType : SelectAutocompleteComponent;
@ViewChild('approveType') approveType : SelectAutocompleteComponent;
@ViewChild('locationField') locationField : SelectAutocompleteComponent;

resetForm() {
 // alert('gg')
  //this.noRecords = false;
 // this.rewardDetails=[];
 // this.countryyInput.selectAllChecked = false;

  this.brandType.selectAllChecked = false;
  this.rewardType.selectAllChecked = false;
  this.statusType.selectAllChecked = false;
  this.approveType.selectAllChecked = false;
   this.locationField.selectAllChecked = false;

   this.selectedLocationOptions = [];
  this.selectedCountryOptions=[];
   this.selectedCityOptions = [];
   this.selectedBrandOptions = [];
   this.selectedVenueOptions = [];
   this.selectedstatusOptions = [];
   this.selectedrewardType = [];
  this.searcheventGiftingForm.get('searchcardOid').reset();
  this.searcheventGiftingForm.get('startDate').reset();
  this.searcheventGiftingForm.get('endDate').reset();

/// this.searcheventGiftingForm.reset();
 this.filterAndGetEvents();

}

getUpdate(event) {

 // sessionStorage.setItem('paginationData',JSON.stringify(event));
  this.paginationDetail.next(event);
  this.paginationData = event;
  this.filterAndGetEvents();


}

sortData(sort: Sort) {

  if (!sort.active || sort.direction === '') {
    this.sortColumn = "";
    this.sortDirection = "";
   // this.sortDirection = "desc";

  } else {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction;
  }

  this.filterAndGetEvents();
}


filterAndGetEvents(){

  let formData = this.searcheventGiftingForm.value;
 // console.log('formData',formData);
  let searchInput = formData.searchcardOid ? formData.searchcardOid : "";
 
  if(formData.startDate){
   this.startDate = moment(formData.startDate).format('YYYY-MM-DD');
  }
  if(formData.endDate)
  {
   this.endDate = moment(formData.endDate).format('YYYY-MM-DD')
  }
  // let data = {
  //    "languageCode":"EN",
  //    "status": formData.status ? formData.status : [],
  //    "startDate": this.startDate ? this.startDate : "",
  //    "endDate": this.endDate ? this.endDate : "",
  //    "rewardType": formData.rewardType ? formData.rewardType : [],
  //    "brandOid": formData.Brand ? formData.Brand : [],
  //    "locationOID":  [],
  //    "eventName": formData.searchcardOid ?  formData.searchcardOid : ""
  //   }

  // "column": this.sortColumn,
  // "dir": this.sortDirection

    let newReqBody = {
       "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
       "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
       "order":{
        "column":this.sortColumn,
        "dir":this.sortDirection
         },
        "languageCode":"EN",
        "status": formData.status ? formData.status : [],
         "startDate":this.startDate ? this.startDate : "",
         "endDate":this.endDate ? this.endDate : "",
         "rewardType":formData.rewardType ? formData.rewardType : [],
         "brandOid": formData.Brand ? formData.Brand : [],
        "locationOID":formData.location ? formData.location : [],
         "eventName": searchInput.trim(),
         "approvalStatus":formData.approveStats ? formData.approveStats : [],

        }
        
     ///   console.log('req body',newReqBody);
     this.searchGiftVal = true;

    
  this.https.postGiftingJson(environment.GiftingAPIEndpoint + 'rest/api/v1/event_admin/search_event',newReqBody).subscribe(res => {
//console.log('get all events res',res)
let eventData = res['output']['searchOutput'];
this.searchGiftVal = false;

if(eventData.length>0){
  this.dataSource = new MatTableDataSource<any>(eventData);
  this.resultsLength = res['output']["totalCount"];
  // this.dataSource.paginator = this.paginator;
  // this.dataSource.sort = this.sort;
  
  this.noRecords = false;
}else{
  this.dataSource = new MatTableDataSource<any>(eventData);
  //this.dataSource.paginator = this.paginator;
 /// this.dataSource.sort = this.sort;

  this.noRecords = true;
}
  })


}

allBrands = []
selectedBrands(){
  this.https.getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands")
   .subscribe(response => {
 //  console.log('brandss>>>',response);
   if(response){
    
    let filteritem =  response.filter(item=>item.brandId != null);
    this.brandDropdown = filteritem;

    this.brandDropdown.forEach(res => {
      this.allBrands.push({
        "brandName": res. brandName,
        "value": res.brandId
      });
    });

   }

   });

 }

public allLocation = []
 fetchAllLOcation(){


 let data2 = {
  "universalId": "",
  "countryOid": "",
  "cityOid": [],
  "languageCode": "en" 
}
let data1 = {
    
  "universalId": '',
"countryOid": '',
"cityOid": [],
"languageCode": "en" ,
  "page":0,
  "pageSize":0,
 "order":{"column":"address","dir":"asc"}
 


}
 this.https.postGiftingJson(environment.GiftingAPIEndpoint + 'rest/api/v1/event_admin_location/search_location', data1).subscribe(res => {
if(res['statusCode']===200){
//  this.loading = false;
 // this.allLocationList = res['output'];
let locations = res['output']['searchOutput'];

  ///this.parentList = response;
  locations.forEach(res => {
    this.allLocation.push({
      "locationName": res.locationName,
      "value": res.locationOid
    });
  });
 
}

 },
 (error) => {


}
 )
}
  // country list
  getAllCountries() {
    const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
    this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
      console.log('GET_ALL_COUNTRIES',res);
      res.forEach(res => {
        this.countryList.push({
          'countryId': res.countryId,
          'countryCode': res.countryCode,
          'languageDirection': res.languageDirection,
          'countryName': res.countryName,
          'value': res.countryId,
          'currencyCode': res.currencyCode

        });
      });
      console.log(this.countryList);
    }, err => {
      console.log(err);
    });
  }

  getAllCities(countryId) {
    // console.log(countryId);
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
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

  getAllBrandsx(countryId) {
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
  getAllBrands(){
    this.https.getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands")
     .subscribe(response => {
     console.log('brandss>>>',response);
     if(response){
     //  this.brandDropdown = response;
     this.brandValueList = response;
     var uniqueArray = this.removeDuplicatesJSON(this.brandValueList, 'brandId');
     console.log(uniqueArray);
     this.brandValueList = uniqueArray;
     }
  
     });
 
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
  getVenue(){
    this.venueDetails2=['STORE','LOCATION','ONLINE']
    console.log(this.venueDetails);
    this.venueDetails=[]
    for(let i=0;i<this.venueDetails2.length;i++){
    this.venueDetails.push({
    
      vanueDETAIL: this.venueDetails2[i],
      value:this.venueDetails2[i]
    });
    console.log();
    
  }
  }
  getStatus(){
    //let statusData=['ONLINE','OFFLINE','NEW','AWAITS APPROVAL','APPROVAL'];
    let statusData=['ONLINE','OFFLINE']

    this.sstatusDetails=[];
    for(let i=0;i<statusData.length;i++){
      this.sstatusDetails.push({
      
        storeDETAIL: statusData[i],
        value:statusData[i],
      });
      console.log();
      
    }
  }
  getApproveStatus(){
    let statusData=['NEW','AWAITS APPROVAL','APPROVED'];

    this.aprovetatusDetails=[];
    for(let i=0;i<statusData.length;i++){
      this.aprovetatusDetails.push({
      
        storeDETAIL: statusData[i],
        value:statusData[i],
      });
      console.log();
      
    }
  }
  getReward(){
    let rewarData=['COUPON','PROGRAM','PRODUCT']
    this.rewardDetails=[]
    for(let i=0;i<rewarData.length;i++){
      this.rewardDetails.push({
      
        rewardDETAIL: rewarData[i],
        value:rewarData[i],
      });
      console.log();
      
    }
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
     if (this.dataSource.filteredData.length>0)  { 
        this.noRecords = false;
      } else{
        this.noRecords = true;
      } 
  }








}
