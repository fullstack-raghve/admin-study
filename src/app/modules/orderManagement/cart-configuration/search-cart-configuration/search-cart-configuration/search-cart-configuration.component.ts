import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

export interface UserData {
  cartConfigOid: number;
  cartConfigTitle: string;
  brandName: string;
  status: string;
}

@Component({
  selector: 'app-search-cart-configuration',
  templateUrl: './search-cart-configuration.component.html',
  styleUrls: ['./search-cart-configuration.component.scss']
})
export class SearchCartConfigurationComponent implements OnInit {

  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: '' },
    { title: 'Order Management', link: '' },
  ];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
 
  @ViewChild("searchEnquiriesForm") searchEnquiriesForm;
  searchCartFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['cartConfigOid', 'cartConfigTitle', 'brandName','countryNameList','storeCount', 'status'];
  dataSource: MatTableDataSource<UserData>;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchAmenityFormGroup: FormGroup;
  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
  @ViewChild('mallInput') mallInput: SelectAutocompleteComponent;
  @ViewChild('storeInput') storeInput: SelectAutocompleteComponent;
  public paginationData;
  public resultsLength = 0;
  countryList: any = [];
  
  brands: any[];
  cities: any[];
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
  public selectedBrandOptions: any[];
 
  countryId: any;

  public countryIdval;
  public brandValueList=[];

 
  statusList=['ONLINE','OFFLINE']

  constructor(private fb: FormBuilder, private https: HttpService,private router: Router) {
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

  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.buildSearchCartForm();
     this.getBrand();
    // this.getAllBrands('');
    // this.getAllCountries();

    // this.searchVal();
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  
    if(sessionStorage.getItem('CheckType')=='Cart')
    {
          if (sessionStorage.searchValue) {
      this.searchCartFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType','Cart');
    }
     
    // this.dataSource.sort = this.sort;
  }
 

    

  public buildSearchCartForm() {
    let form = {
      areaName: ["",],
      notificationCountry: [''],
      brandOid: [''],
      notificationmall: [''],
      status:[""],
      searchVal: [""],
      store:['']
    }
    this.searchCartFormGroup = this.fb.group(form);
  }
  getBrand() {
    const SEARCH_BRANDS = "api/rpa/master/brand/v1/getAllBrand";
    this.https.getJson(environment.APIEndpoint + SEARCH_BRANDS).subscribe(
      res => {
         this.brandList = res;
 this.countryList=[];
        console.log(this.brandList);
      },
      err => {
        console.log(err);
      }
    );
  }
  getAllCountries(brandId) {
    if (brandId.length != 0) {
      console.log(brandId);
      let GET_ALL_COUNTRIES =
        environment.APIEndpoint + "api/rpa/master/brand/v1/get/regions";
      this.https
        .getJson(GET_ALL_COUNTRIES + "?brandOid=" + brandId)
        .subscribe(response => {
          console.log(response);
          // this.countries = response;
          response.forEach(res => {
            this.countryList.push({
              countryCode: res.countryCode,
              countryId: res.countryId,
              countryName: res.countryName,
              currencyCode: res.currencyCode,
              languageDirection: res.languageDirection,
              value: res.countryId
            });
          });
          // this.countryList = this.countries;
          var uniqueArray = this.removeDuplicatesJSON(
            this.countryList,
            "countryId"
          );
          this.countryList = uniqueArray;
          console.log("push all data", this.countryList);
        });
    } else {
      this.countryList = [];
    }
  }
  // getAllCountries1() {
  //   const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
  //   this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
  //     console.log(res);
  //     res.forEach(res => {
  //       this.countryList.push({
  //         'countryId': res.countryId,
  //         'countryCode': res.countryCode,
  //         'languageDirection': res.languageDirection,
  //         'countryName': res.countryName,
  //         'value': res.countryId,
  //         'currencyCode': res.currencyCode

  //       });
  //     });
  //     console.log(this.countryList);
  //   }, err => {
  //     console.log(err);
  //   });
  // }

  public searchcountryId;

 

  getAllBrands(countryId) {
    this.selectedBrandOptions = [];
    this.brandInput.selectAllChecked = false;
    // this.mallInput.selectAllChecked = false;
    // this.storeInput.selectAllChecked = false;
    console.log(countryId);
    this.countryIdval = countryId;
    if (countryId != '' && countryId != null && countryId != undefined) {
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
   
      this.brandValueList = [];
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
  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  searchKey(){
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchVal() {
    this.searchStoreVal = true;
    let formdata = this.searchCartFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    let data =
    {
      "page":  this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": sessionStorage.getItem('searchValue'),
      "fieldSearch": [
          {
              "fieldName": "oid",
              "fieldValue": ""
          },
          {
              "fieldName": "brand.oid",
              "fieldValue": formdata.brandOid
          },
         
          {
              "fieldName": "status",
              "fieldValue": formdata.status
          },
          {
              "fieldName": "countryIds",
              "fieldValue": formdata.notificationCountry.toString()
          }
      ]
  }

    let SEARCH_CART = "api/rpa/cartConfig/v1/search"
    this.https.postJson(environment.APIEndpoint + SEARCH_CART, data).subscribe(res => {
      this.searchStoreVal = false;
      console.log(res);
      this.dataSource = new MatTableDataSource(res["items"]);
      this.dataSource.sort = this.sort;
      console.log('data : ' + res);
      this.resultsLength = res["totalCount"];
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
    }, err => {
      console.log(err);
      this.searchStoreVal = true;
    })
  }

  resetForm() {
    this.noRecords = false;
    this.getBrand();
    
    this.buildSearchCartForm();
    this.searchVal();
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  ViewCart(ID){
    localStorage.setItem('cartViewID',ID);
    this.router.navigate(['/view-cart-configuration'])
  }
}

