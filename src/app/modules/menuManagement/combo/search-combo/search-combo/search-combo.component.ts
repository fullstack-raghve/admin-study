import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
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
  selector: 'app-search-combo',
  templateUrl: './search-combo.component.html',
  styleUrls: ['./search-combo.component.scss']
})
export class SearchComboComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Combo',
    link: ''
  }
  ];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  @ViewChild("searchEnquiriesForm") searchEnquiriesForm;
  searchComboFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['sortOrder', 'comboImage', 'comboName', 'comboCategoryName','displayPriceType' ,'brandName', 'comboCountryName','modifiedTime','modifiedBy','status'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public filePathUrl = localStorage.getItem("imgBaseUrl");

  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('categoryInput') categoryInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
 
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
  selectedCountryOptions: any[];
  public selectedCategoryOptions: any[];
  public selectedBrandOptions: any[];

  public parentList = [];

  constructor(private fb: FormBuilder,
    private https: HttpService, private router: Router,
    private http: HttpService) {
      this.buildSearchDeliveryAreaForm();
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
  BrandList = [];
  statusList = ['ONLINE', 'OFFLINE']
  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getBrandList();
    
    if (sessionStorage.getItem('CheckType') == 'DeliveryArea') {
      if (sessionStorage.searchValue) {
        this.searchComboFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
    } else {
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType', 'DeliveryArea');
    }
  }
  getBrandList() {
    this.http
      .getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands")
      .subscribe(response => {
        this.brandList = response;
      });
  }

  brands: any[];
  countryId: any;
  countryList: any = [];

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

  getAllCountries(brandId) {
    this.countryList = [];
    if (brandId.length != 0) {
      console.log(brandId);
      let GET_ALL_COUNTRIES =
        environment.APIEndpoint + "api/rpa/master/brand/v1/get/regions";
      this.http
        .getJson(GET_ALL_COUNTRIES + "?brandOid=" + brandId)
        .subscribe(res => {
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
  getAllCountries1() {
    const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
    this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
      console.log(res);
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

  public searchcountryId;



 

  public searchBrandId;








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

      notificationCountry: [''],
      categoryIds: [''],
      notificationBrand: [''],
      displayPriceType:'',
      discountType:'',
      searchVal: [""],

    }
    this.searchComboFormGroup = this.fb.group(form);
  }


  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  searchKey() {
    
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }

  searchVal1() {
    this.searchStoreVal = true;
    if (this.searchComboFormGroup.invalid == false) {
      let formdata = this.searchComboFormGroup.value;
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
            "fieldName": "categoryOid",
            "fieldValue": formdata.categoryIds,
          },
          {
            "fieldName": "brandOid",
            "fieldValue": formdata.notificationBrand
          },

          {
            "fieldName": "countryOid",
            "fieldValue": formdata.notificationCountry,
          },


          {
            "fieldName": "comboOid",
            "fieldValue": ''
          },
          {
            "fieldName": "displayPriceType",
            "fieldValue": formdata.displayPriceType
        },
        {
            "fieldName": "discountType",
            "fieldValue": formdata.discountType
        }
        ]
      }

      let comboURL = "api/rpa/combo/v1/search"
      this.https.postJson(environment.APIEndpoint + comboURL, data).subscribe(res => {
        this.searchStoreVal = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        console.log("ressssssssssssssssss............" + this.dataSource);
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
  }
  searchVal() {
    this.searchStoreVal = true;
    if (this.searchComboFormGroup.invalid == false) {
      let formdata = this.searchComboFormGroup.value;
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
            "fieldName": "comboOid",
            "fieldValue": '',
          },
          {
            "fieldName": "brandOid",
            "fieldValue": formdata.notificationBrand.toString()
          },

          {
            "fieldName": "countryOid",
            "fieldValue": formdata.notificationCountry.toString()
          },
          {
            "fieldName": "categoryOid",
            "fieldValue": formdata.categoryIds.toString()
          },
          {
            "fieldName": "displayPriceType",
            "fieldValue": formdata.displayPriceType
        },
        {
            "fieldName": "discountType",
            "fieldValue": formdata.discountType
        }
 

        ]
      }

      let comboURL = "api/rpa/combo/v1/search"
      this.https.postJson(environment.APIEndpoint + comboURL, data).subscribe(res => {
        this.searchStoreVal = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        console.log("ressssssssssssssssss............" + this.dataSource);
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
  }
  categories1 = [];
  getParentList1() {
    let GET_ALL_PARENTS = environment.APIEndpoint + "api/rpa/productcategory/v1/get/list";
    this.https.getJson(GET_ALL_PARENTS)
      .subscribe((response) => {
        
        console.log('productList : ' + this.parentList);
        this.parentList.forEach(res => {
          this.categories1.push({
            "categoryId": res.categoryId,
            "categoryName": res.categoryName,
            "direction": res.direction,
            "parentProductCategoryId": res.parentProductCategoryId,
            "status": res.status,
            "value": res.categoryId
          });
        });
      })
  }
  getParentList(selectedBrandId) {
    this.selectedCategoryOptions = [];
    this.categoryInput.selectAllChecked = false;
    if (selectedBrandId != '' && selectedBrandId != null && selectedBrandId != undefined) {
      this.http
        .getJson(
          environment.APIEndpoint +
          "api/rpa/productcategory/v1/get/brandCategories?brandId=" + selectedBrandId)
        .subscribe(response => {
          console.log(response);
          this.parentList = response;
          this.categories1 = [];
          this.parentList.forEach(res => {
            this.categories1.push({
              "categoryId": res.categoryId,
              "categoryName": res.categoryName,
              "direction": res.direction,
              "parentProductCategoryId": res.parentProductCategoryId,
              "status": res.status,
              "value": res.categoryId
            });
            var uniqueArray = this.removeDuplicatesJSON(this.categories1, 'categoryId');
            console.log(uniqueArray);
            this.categories1 = uniqueArray;
          });
          console.log(this.categories1);
        }, err => {
          console.log(err);
        });
    }
    else {
      this.categories1 = [];
    }
  }
  resetForm() {
  
    this.countryInput.selectAllChecked = false;
    this.categoryInput.selectAllChecked = false;
    this.brandInput.selectAllChecked = false;
  
    this.selectedCountryOptions = [];
    this.selectedCategoryOptions = [];
    this.selectedBrandOptions = [];
   
    this.noRecords = false;
    this.buildSearchDeliveryAreaForm();
  
    this.searchVal();
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  MoveToView(ID) {
    localStorage.setItem('comboViewID', ID);
    this.router.navigate(['/view-combo'])
  }

  indexResetFormdataSearch(){

    let formData = this.searchComboFormGroup.value;
    if (formData.searchVal!= '' && formData.searchVal!= null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.store!='' && formData.categoryIds!=null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.notificationBrand!='' && formData.notificationBrand!=null){
      this.paginationData.pageIndex = 0;
    }
   
    if (formData.notificationCountry!='' && formData.notificationCountry!=null){
      this.paginationData.pageIndex = 0;
    }
  }
}
