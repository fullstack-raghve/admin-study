import { OnInit, ViewChild, Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

export interface UserData {
  areaId: number;
  areaName: string;
  countryName: string;
  cityName: string;
  lastModifiedOn: string;
  status: string;
}

@Component({
  selector: 'search-delivery-area',
  templateUrl: './search-delivery-area.component.html',
  styleUrls: ['./search-delivery-area.component.scss']
})

export class SearchDeliveryAreaComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management',
    link: ''
  }
  ];

  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  public loadingResponse: boolean = false;
  @ViewChild("searchEnquiriesForm") searchEnquiriesForm;
  searchDeliveryAreaFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['deliveryAreaOid', 'areaName', 'countryName', 'cityName', 'modifiedTime', 'status'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
  @ViewChild('mallInput') mallInput: SelectAutocompleteComponent;
  @ViewChild('storeInput') storeInput: SelectAutocompleteComponent;
  public countries: any = [];
  public cities: any = [];
  public showCountryError: boolean = false;
  public paginationData;
  public resultsLength = 0;
  public stores = [];
  public brandList = [];
  public storesArr = [];
  public tagList = [];
  public flows;
  public storeCount = 10;
  public flowCount = 10;
  mallListall: any;
  selectedmallIdValue: any;
  selectedCountryOptions:any[]; 
  public selectedCityOptions: any[];
  public selectedBrandOptions: any[];
  public selectedMallOptions: any[];
  public selectedStoreOptions: any[];
  public selectedFlowOptions: any[];
  public selectedTagOptions :any[];

  constructor(private fb: FormBuilder,
    private https: HttpService,
    private router:Router,
    private http: HttpService) {
    this.dataSource = new MatTableDataSource();
  }

  status = true;
  openFilter() {
    this.status = !this.status;
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
    BrandList=[];
    storeList=['S1','S2','S3'];
    statusList=['ONLINE','OFFLINE']

  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getAllCountries();
    this.getBrandList();
    this.buildSearchDeliveryAreaForm();
    this.dataSource = new MatTableDataSource();
    if(sessionStorage.getItem('CheckType') == 'DeliveryArea'){
    if (sessionStorage.searchValue) {
      this.searchDeliveryAreaFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
    }
    if (sessionStorage.paginationData) {
      let obj = JSON.parse(sessionStorage.paginationData);
      this.paginationDetail = new BehaviorSubject({
        length: obj.length,
        pageIndex: obj.pageIndex,
        pageSize: obj.pageSize
      });
      this.paginationDetail.next(obj);
      this.paginationData = obj;
      this.searchVal();
      this.paginator.pageIndex = obj.pageIndex;
    } else {
      this.searchVal();
    }
  }else{
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType','DeliveryArea');
    }
  }
  

  brands: any[];
  countryId: any;
  countryList: any = [];
  cityList: any = [];
  public selectedCityIdValue;
  allBrandCountryCityList = [];
  allBrandCountryBrandList = [];
  public countryIdval;
  public brandValueList;
  mallList: any = [];
  disabledCity: boolean = false;
  countrylistMall = [];
  brandMallList = [];
  cityMallList = [];
  allBrandCountryCityMallList = [];

  getAllCountries() {
    const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
    this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
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
    }, err => {
    });
  }

  public searchcountryId;

  getAllCities(countryId) {
    this.cityInput.selectAllChecked = false;
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;
   
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.searchcountryId = countryId.toString();
    if (countryId != '' && countryId != null && countryId != undefined) {
      let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/storeCities";
      this.https.getJson(GET_ALL_CITIES + '?countryIds=' + countryId)
        .subscribe((response) => {
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
            this.getAllMallsCity(countryId, response.cityId);
            this.cityList = this.cities;
            var uniqueArray = this.removeDuplicatesJSON(this.cityList, 'cityId');
            this.cityList = uniqueArray;
          });
        });
    } 
    else {
      this.cityList = [];
    }
  }

  getAllBrands(countryId) {
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;
    this.countryIdval = countryId;
    if (countryId != '' && countryId != null && countryId != undefined) {
      let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandByRegionByCountryId" + '?countryOid=' + countryId;
      this.https.getJson(GET_ALL_ONLINE_BRANDS)
        .subscribe((response) => {
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
            this.brandValueList = uniqueArray;
          });
        },
          (error) => {
          });
    } else {
      this.brandValueList = [];
    }
  }

  public searchMallId;
  getAllMallId(ev) {
    this.searchMallId = ev.toString();
  }

  public searchBrandId;
  getAllMalls(event, countryId, brandId, cityId) {
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;
    this.searchBrandId = event.toString();
    
    if (countryId != '' && countryId != null && countryId != undefined && brandId != '' && brandId != null && brandId != undefined && cityId != '' && cityId != null && cityId != undefined) {
      this.disabledCity = false;
    } else {
      this.disabledCity = true;
    }

    this.countrylistMall = this.searchDeliveryAreaFormGroup.controls['notificationCountry'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchDeliveryAreaFormGroup.controls['notificationBrand'].value;
    this.cityMallList = this.searchDeliveryAreaFormGroup.controls['notificationcity'].value;
    cityId = [];
    cityId.push(this.cityMallList);
    if (brandId != '' && countryId != '' && cityId != ''){
      let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
      this.https
        .getJson(GET_ALL_MALLS + "?brandOids=" + this.searchBrandId + '&countryOids=' + countryId + "&cityOids=" + cityId)
        .subscribe(response => {
          this.mallListall = response;
          response.forEach(res => {
            this.mallList.push({
              "mallCode": res.mallCode,
              "mallId": res.mallId,
              "mallName": res.mallName,
              "languageDirection": res.languageDirection,
              "value": res.mallId
            });
          });

          this.mallList = this.mallListall;
          var uniqueArray = this.removeDuplicatesJSON(this.mallList, 'mallId');
          this.mallList = uniqueArray;
        });
    }
    else {
      this.mallList = [];
    }
  }

  public searchcityId;
  getAllMallsCity(ev, cityId) {
    this.searchcityId = ev.toString();
  }

  getAllStores(event, countryId, brandId, cityId) {
    this.selectedStoreOptions = [];
    this.storeInput.selectAllChecked = false;
    this.selectedmallIdValue = event;
    if (countryId != '' && countryId != null && countryId != undefined && brandId != '' && brandId != null && brandId != undefined && cityId != '' && cityId != null && cityId != undefined) {
      this.disabledCity = false;
    } 
    else {
      this.disabledCity = true;
    }

    this.countrylistMall = this.searchDeliveryAreaFormGroup.controls['notificationCountry'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchDeliveryAreaFormGroup.controls['notificationBrand'].value;

    brandId = [];
    brandId.push(this.brandMallList);

    this.cityMallList = this.searchDeliveryAreaFormGroup.controls['notificationcity'].value;
    cityId = [];
    cityId.push(this.cityMallList);

    if (brandId != '' && countryId != '' && cityId != '' && this.selectedmallIdValue != '') {
      let GET_ALL_STORES = environment.APIEndpoint + "api/rpa/store/v2/getStoresByMallId";

      this.https.getJson(GET_ALL_STORES + "?brandOids=" + brandId + '&countryOids=' + countryId + '&cityOids=' + cityId + '&mallOids=' + this.selectedmallIdValue)
        .subscribe(res => {
          this.storesArr = res;
          this.allBrandCountryCityMallList = this.storesArr;
        });
    }
    else {
      this.allBrandCountryCityMallList = [];
    }
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

  public buildSearchDeliveryAreaForm() {
    let form = {
      areaName: ["",],
      notificationCountry: [''],
      notificationcity: [''],
      notificationBrand: [''],
      notificationmall: [''],
      status:[""],
      searchVal: [""],
      store:['']
    }
    this.searchDeliveryAreaFormGroup = this.fb.group(form);
  }


  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  searchKey(){
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }

  searchVal1() {
    this.searchStoreVal = true;
    if (this.searchDeliveryAreaFormGroup.invalid == false) {
      let formdata = this.searchDeliveryAreaFormGroup.value;
      sessionStorage.setItem('searchValue', formdata.searchVal);
      let data =
      {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": "modifiedTime",
          "dir": "desc"
        },
        "keySearch": sessionStorage.getItem('searchValue'),
  
        "fieldSearch": [
          {
            "fieldName": "storeOid",
            "fieldValue": formdata.store,
          },
          {
            "fieldName": "brandOid",
            "fieldValue": formdata.notificationBrand
          },
          {
            "fieldName": "areaName",
            "fieldValue": formdata.areaName,
          },
          {
            "fieldName": "country.oid",
            "fieldValue": formdata.notificationCountry,
          },
          {
            "fieldName": "city.oid",
            "fieldValue": formdata.notificationcity
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          },
          {
            "fieldName": "mallOid",
            "fieldValue":formdata.notificationmall
          }
        ]
      }
      let SEARCH_DELIVERY_AREA = "api/rpa/store/deliveryArea/v1/search"
      this.https.postJson(environment.APIEndpoint + SEARCH_DELIVERY_AREA, data).subscribe(res => {
        this.searchStoreVal = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
      }, err => {
        this.searchStoreVal = true;
      });
    }
  }


  indexResetFormdataSearch(){
    let formData = this.searchDeliveryAreaFormGroup.value;
    if (formData.searchVal!= '' && formData.searchVal!= null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.store!='' && formData.store!=null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.notificationBrand!='' && formData.notificationBrand!=null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.areaName!='' && formData.areaName!=null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.notificationCountry!='' && formData.notificationCountry!=null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.notificationcity!='' && formData.notificationcity!=null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.notificationmall!='' && formData.notificationmall!=null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.status!='' && formData.status!=null){
      this.paginationData.pageIndex = 0;
    }
  }

  searchVal() {
    this.searchStoreVal = true;
    this.loadingResponse = true;
    if (this.searchDeliveryAreaFormGroup.invalid == false) {
      let formdata = this.searchDeliveryAreaFormGroup.value;
      sessionStorage.setItem('searchValue', formdata.searchVal);
      let data =
      {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": "modifiedTime",
          "dir": "desc"
        },
        "keySearch": sessionStorage.getItem('searchValue'),
  
        "fieldSearch": [
          {
            "fieldName": "storeOid",
            "fieldValue": formdata.store.toString(),
          },
          {
            "fieldName": "brandOid",
            "fieldValue": formdata.notificationBrand.toString()
          },
          {
            "fieldName": "areaName",
            "fieldValue": formdata.areaName,
          },
          {
            "fieldName": "country.oid",
            "fieldValue": formdata.notificationCountry.toString()
          },
          {
            "fieldName": "city.oid",
            "fieldValue": formdata.notificationcity.toString()
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          },
          {
            "fieldName": "mallOid",
            "fieldValue":formdata.notificationmall.toString()
          }
        ]
      }
      let SEARCH_DELIVERY_AREA = "api/rpa/store/deliveryArea/v1/search"
      this.https.postJson(environment.APIEndpoint + SEARCH_DELIVERY_AREA, data).subscribe(res => {
        this.searchStoreVal = false;
        this.loadingResponse = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
      }, err => {
        this.searchStoreVal = false;
        this.loadingResponse = false;
      });
    }
  }

  resetForm() {

    this.countryInput.selectAllChecked = false;
    this.cityInput.selectAllChecked = false;
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;
    this.selectedCountryOptions = [];
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    
    this.cityList = [];
    this.brandValueList = [];
    this.mallList = [];
    this.storeList = [];
    this.noRecords = false;
    this.buildSearchDeliveryAreaForm();
    this.searchVal();
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }

  MoveToView(ID){
    localStorage.setItem('DeliveryAreaViewID',ID);
    this.router.navigate(['/view-delivery-area'])
  }

  getBrandList(){
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/store/v1/get/storeBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        let brandList = response;
  
        for (let i = 0; i <= brandList.length - 1; i++) {
          let obj = {
            brandId: brandList[i]['brandId'],
            brandName: brandList[i]['brandName'],
          }
          this.BrandList.push(obj);
        }
      },
        (error) => {
        });
  }
}