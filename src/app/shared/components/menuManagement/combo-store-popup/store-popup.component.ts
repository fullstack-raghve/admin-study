import { OnInit, ViewChild, Input, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { CommonFunctions } from 'src/app/services/common-functions';

@Component({
  selector: 'store-popup',
  templateUrl: './store-popup.component.html',
  styleUrls: ['./store-popup.component.scss']
})

export class ComboStorePopupComponent implements OnInit {
  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
  @ViewChild('mallInput') mallInput: SelectAutocompleteComponent;
  public cityIdValue;
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'storeId', 'brandName', 'storeName', 'address', 'mallName', 'city', 'country'];
  @Input('storeList') storeList = [];
  @Input('totalCount') totalCount;
  @Input('brandOid') brandOid;
  @Input('isDisabled') isDisabled: boolean = false;
  @Input('programBrand') programBrand;
  disabledCountry: boolean = true;
  disabledCity: boolean = true;
  disabledMall: boolean = true;
  loadingResponse: boolean = true;
  disabledTable: boolean = true;
  totalFilterRecordVal: boolean = true;
  // public selectAll: boolean = false;

  public searchStoreForm: FormGroup;
  public paginationData;
  public resultsLength = 0;
  public noRecords: boolean = false;
  public arrlength = [10, 20, 50, 100]; 
  public total: number;
  public updatedTotal;
  dataSource : MatTableDataSource<object>;
  status = true;

  public selectedOptions;

  public storeOidValue;
  public selectedmallIdValue;
  selectedBrandIdValue: any;
  mallList: any = [];
  displayPriceCurrency;

  allBrandCountryCityMallList = [];
  countrylistMall = [];
  brandMallList = [];
  cityMallList = [];
  selectedCityOptions: any[];
  selectedBrandOptions: any[];
  selectedCountryOptions : any[];
  selectedMallOptions: any[];
  brandIds: any;
  totalRecordVal: boolean;
  countries: any[];
  cities: any[];
  cityList: any;
  brandList: any[];
  mallListall: any[];
  countrylistCity: any;
  brandId: any;
  cityId: any;
  countryIds: any;
  countryList: any = [];
  countryList1: any = [];

  displayPrice;
  public countryIdval;
  public brandValueList = [];
  activeGroupId;
  public selection = new SelectionModel(true, []);
  public selectedCityIdValue;
  allBrandCountryCityList = [];
  allBrandCountryBrandList = [];
  allSelectedCountries = [];
  public mallIdValue;

  paginationDetail = new BehaviorSubject({
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });

  originalSelection;
  stores = [];
  allBrands = [];
  isFilterOn = false;
  dataInView = [];
  checkboxClicked = false;
  public programType;
  public Disable:boolean=true;
  discountType: any;
  isDiscount: any;
  discountPrice: any;
  valueType:any;
  displayPriceCurrencyError:boolean= false;
  displayPriceError:boolean= false
  activeGroupStores: any;
  public filteredResultsLength = 0;

  constructor(private fb: FormBuilder,
    private commonFunctions: CommonFunctions,
    private https: HttpService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>) {
      dialogRef.disableClose = true;
      this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    if (this.programType == 'BASE'){
      this.brandOid = -1;
    }
    else{
      this.brandOid = 0;
    }
    if(this.valueType == 'AUTO_CALCULATE'){
      this.displayPrice= 'AUTO CALCULATE'
    }else{
      if(this.displayPrice == 'AUTO CALCULATE'){
        this.displayPrice = 0;
      }
    }
    this.buildForm();
    this.getAllBrands();
    this.getAllCountries(this.brandId);
    this.getAllcurrency();
  }
  getAllcurrency() {
    if (this.brandId != '' && this.brandId != null && this.brandId != undefined) {
    const GET_ALL_COUNTRIES = environment.APIEndpoint + 'api/rpa/master/brand/v1/get/regions';
    this.https.getJson(GET_ALL_COUNTRIES + '?brandOid=' + this.brandId).subscribe(res => {
      res.forEach(res => {
        this.countryList1.push({
          'countryId': res.countryId,
          'countryCode': res.countryCode,
          'languageDirection': res.languageDirection,
          'countryName': res.countryName,
          'value': res.countryId,
          'currencyCode': res.currencyCode
        });
      });
      
       this.countryList1 = this.removeDuplicatesJSON(this.countryList1, 'countryId');
    }, error => {
      this.commonFunctions.displayErrorMessage(error);
      this.loadingResponse = true;
    });
  }
 
  }
  buildForm() {
    this.searchStoreForm = this.fb.group({
      searchtxt: [""],
      fullName: [""],
      emailId: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(6), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      phoneNumber: ["", [Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]+$")]],
      cityName: [""],
      countryName: [""],
      brand: [""],
      mall: [""],
      status: [""],
    });
    this.searchStoreForm.get('brand').patchValue(this.brandId);


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

  getAllBrands() {
    this.brandValueList = [];
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS).subscribe((response) => {
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
      });

      this.brandValueList = this.removeDuplicatesJSON(this.brandValueList, 'brandId');
      this.allBrands = JSON.parse(JSON.stringify(this.brandValueList));

      if (localStorage.getItem('stores') !== null) {
        this.stores = JSON.parse(localStorage.getItem('stores'));
        this.total = this.stores.length;
        this.paginationData = {
          pageIndex: 0,
          pageSize: 10,
          length: this.total,
          previousPageIndex: 0
        };
        this.getStoresForEdit();
        this.getUpdate(this.paginationData);
        this.paginator.pageIndex = this.paginationData.pageIndex;
        if(this.brandId){
          this.getStoreList(this.searchStoreForm.value);
        }
      } else {
        this.getStoreList(this.searchStoreForm.value);
      }
    
    },
    (error) => {
      this.commonFunctions.displayErrorMessage(error);
      this.loadingResponse = true;
    });
  }

  getAllCountries(selectedBrandIds) {
    this.selectedCityOptions = [];
    this.selectedCountryOptions = [];
    this.selectedMallOptions = [];

    if (selectedBrandIds != '' && selectedBrandIds != null && selectedBrandIds != undefined) {
      this.disabledCountry = false;
    const GET_ALL_COUNTRIES = environment.APIEndpoint + 'api/rpa/master/brand/v1/get/regions';
    this.https.getJson(GET_ALL_COUNTRIES + '?brandOid=' + selectedBrandIds).subscribe(res => {
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
      this.countryList = this.removeDuplicatesJSON(this.countryList, 'countryId');
    }, error => {
      this.commonFunctions.displayErrorMessage(error);
      this.loadingResponse = true;
    });
  }
  else{
    this.cityList = [];
    this.countryList = [];
    this.mallList = [];
  }
  }

  getAllCities(event,brandId) {
    this.countryIds = event;
    this.selectedCityOptions = [];
    this.selectedMallOptions = [];
    this.cityInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    if (this.countryIds != '' && this.countryIds != null && this.countryIds != undefined) {
      this.disabledCity = false;
      this.countrylistCity = this.searchStoreForm.controls['brand'].value;
      brandId = [];
      brandId.push(this.countrylistCity);
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/store/v1/get/cityList";
   this.https.getJson(GET_ALL_CITIES + "?brandOids=" + brandId + '&countryOids=' + this.countryIds)
        .subscribe((response) => {
          this.cityList = [];
          response.forEach(response => {
            this.cityList.push({
              cityId: response.cityId,
              cityCode: response.cityCode,
              languageDirection: response.languageDirection,
              cityName: response.cityName,
              status: response.status,
              value: response.cityId,
            });
          }, error => {
            this.commonFunctions.displayErrorMessage(error);
            this.loadingResponse = true;
          });
          this.cityList = this.removeDuplicatesJSON(this.cityList, 'cityId');
        });
    } else {
      this.cityList = [];
      this.mallList = [];
    }
  }

  getAllMalls(event, brandId, countryId) {
    this.cityId = event;
    this.selectedMallOptions = [];
    this.mallInput.selectAllChecked = false;
    if (countryId != '' && countryId != null && countryId != undefined && brandId != '' && brandId != null && brandId != undefined && this.cityId != '' && this.cityId != null && this.cityId != undefined) {
      this.disabledCity = false;
      this.countrylistMall = this.searchStoreForm.controls['countryName'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchStoreForm.controls['brand'].value;

    brandId = [];
    brandId.push(this.brandMallList);
      let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
      this.https
        .getJson(GET_ALL_MALLS + "?brandOids=" + brandId + '&countryOids=' + countryId + "&cityOids=" + this.cityId)
        .subscribe(response => {
          this.mallList = [];
          response.forEach(res => {
            this.mallList.push({
              "mallCode": res.mallCode,
              "mallId": res.mallId,
              "mallName": res.mallName,
              "languageDirection": res.languageDirection,
              "value": res.mallId
            });
          });
          this.mallList = this.removeDuplicatesJSON(this.mallList, 'mallId');
        });
    }
    else {
      this.disabledMall = true;
    }
  }

  openFilter() {
    this.status = !this.status;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataInView.length;
    return numSelected === numRows;
  }

  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      'tableData': this.originalSelection,
      'totalCount': this.resultsLength
    }
    localStorage.removeItem('stores');
    // localStorage.setItem('stores', JSON.stringify(this.stores));
    this.dialogRef.close(obj);
  }
  clearData(){
    localStorage.removeItem('stores');
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
   this.checkboxClicked || this.isAllSelected() ?
      // this.selection.clear() :
      this.dataInView.forEach(row => this.selection.deselect(row)) :
      this.dataInView.forEach(row => this.selection.select(row));
    this.checkboxClicked = !this.checkboxClicked;
  }
  onSelectStore(){
    let groupId = Date.now();
    console.log(groupId);
    let Obj;
    let obj1;
    this.displayPriceCurrencyError= false;
    this.displayPriceError = false;

    if(this.activeGroupId !== 0) {
        let storeGroup = this.selection.selected;
      Obj ={
        activeGroupId:this.activeGroupId,
        currencyCode:this.displayPriceCurrency,
        displayPrice: this.displayPrice,
        storeOids:storeGroup,
       
      }
      if(storeGroup.length>0){
        obj1 = {
            'buttonName': 'SELECT',
            'tableData': Obj,
          }
      }else{
        obj1 = {
          'buttonName': 'REMOVE',
        }
      }
      if(this.displayPriceCurrency==undefined){
        this.displayPriceCurrencyError = true;
       }
       if(this.displayPrice == undefined){
        this.displayPriceError = true;

       }
    }else{
       this.activeGroupId=groupId;
       let storeGroup = this.selection.selected;
       if(this.displayPriceCurrency==undefined){
        this.displayPriceCurrencyError = true;
       }
       if(this.displayPrice == undefined){
        this.displayPriceError = true;

       }
       Obj ={
        activeGroupId:this.activeGroupId,
        currencyCode:this.displayPriceCurrency,
        displayPrice: this.displayPrice,
        storeOids:storeGroup
      }
      if(storeGroup.length>0){
        obj1 = {
            'buttonName': 'SELECT',
            'tableData': Obj,
          }
      }else{
        obj1 = {
          'buttonName': 'REMOVE',
        }
      }
    }

    if(!this.displayPriceCurrencyError && !this.displayPriceError){
      this.dialogRef.close(obj1);
    }
    
  }
  resetForm() {
     this.buildForm();
    // this.showFilteredCount = false;
    this.countryInput.selectAllChecked = false;
    this.cityInput.selectAllChecked = false;
    this.countries = [];
    this.cityList = [];
    this.mallList = [];
    this.disabledCountry = true;
    this.disabledCity = true;
    this.disabledMall = true;
    this.isFilterOn = false;
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.total,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
    
  }

  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.getLocalStorageSearchList();
  }

  
  applyFilters(filteredSource) {
    let formData = this.searchStoreForm.value;
    let result = filteredSource;
    if(formData.countryName !== '' && formData.countryName.length !== 0) {
      let countries = formData.countryName.map((i) => {
        return this.countryList.find( country => country.countryId === i);
      });
      result = countries.map((country) => {
        return result.filter( store => store.countryName === country.countryName);
      });
      result = [].concat(...result);
    }
    if(formData.cityName !== '' && formData.cityName.length !== 0) {
      let cities = formData.cityName.map((i) => {
        return this.cityList.find( city =>  city.cityId === i);
      });
      result = cities.map((city) => {
        return result.filter( store => store.cityName === city.cityName);
      });
      result = [].concat(...result);
    }
    if(formData.mall !== '' && formData.mall.length !== 0) {
      let malls = formData.mall.map((i) => {
        return this.mallList.find( mall => mall.mallId === i);
      });
      result = malls.map((mall) => {
        return result.filter( store => store.mallName === mall.mallName);
      });
      result = [].concat(...result);
    }
    return result;
  }
  eventPreventDefault($event, flag =false) {
    $event.preventDefault();
    this.getLocalStorageSearchList(flag);
    return false;
  }
  storesForEdit = [];
  storesForEdit1 = [];

  getStoresForEdit() {
    this.storesForEdit1 = [];

    if(this.activeGroupId !== 0) {

     
      this.storesForEdit1 = this.stores.filter((store) => {
        return this.storesForEdit.includes(store.storeOid);
      });
      for (let i of this.storesForEdit1) {
        this.selection.select(i);
      }
      this.originalSelection = this.selection.selected;

    } else {
      this.storesForEdit = [];
    }
    let filteredStores = [];
    let existingStoreOids = this.storeList;

    filteredStores = this.stores.filter((store) => {
      return !existingStoreOids.includes(store.storeOid);
    });

    this.storesForEdit = [...this.storesForEdit1, ...filteredStores];
    this.resultsLength = this.storesForEdit.length;
  }

  getLocalStorageSearchList(flag = false) {
    if(flag) {
      this.paginationData = {
        pageIndex: 0,
        pageSize: 10,
        length: this.total,
        previousPageIndex: 0
      };
      this.paginator.pageIndex = this.paginationData.pageIndex;
    }
    this.totalRecordVal = true;
    const searchValue = this.searchStoreForm.value.searchtxt.toLowerCase();
    let searchedSource = this.storesForEdit;
    if (searchValue !== '') {
      searchedSource = this.storesForEdit.filter((store) => {
        return ('storeId' in store && store.storeId.toLowerCase().includes(searchValue)) ||
        ('brandName' in store && store.brandName.toLowerCase().includes(searchValue)) ||
        ('storeName' in store && store.storeName.toLowerCase().includes(searchValue)) ||
        ('storeAddress' in store && store.storeAddress.toLowerCase().includes(searchValue)) ||
        ('mallName' in store && store.mallName.toLowerCase().includes(searchValue)) ||
        ('cityName' in store && store.cityName.toLowerCase().includes(searchValue)) ||
        ('countryName' in store && store.countryName.toLowerCase().includes(searchValue));
      });
    }

    if(this.isFilterOn) {
      let formData = this.searchStoreForm.value;
      if(formData.brand || formData.cityName || formData.countryName || formData.mall) {
        searchedSource = this.applyFilters(searchedSource);
      }
    }

    let start = this.paginationData.pageIndex * this.paginationData.pageSize;
    let end = start + this.paginationData.pageSize;
    let filteredSource = searchedSource.slice(start, end);

    this.dataSource = new MatTableDataSource(filteredSource);
    this.filteredResultsLength = searchedSource.length;
    if (this.filteredResultsLength === 0) {
      this.noRecords = true;
    } else {
      this.noRecords = false;
    }

    if (this.total === 0) {
      this.disabledTable = true;
    } else {
      this.disabledTable = false;
    }

    this.brandValueList = [];

    for(let store of this.stores) {
      for(let brand of this.allBrands) {
        if(store.brandId === brand.brandId) {
          this.brandValueList.push(brand);
        }
      }
    }

    this.brandValueList = this.removeDuplicatesJSON(this.brandValueList, 'brandId');
    this.loadingResponse = false;
    this.dataInView = searchedSource;
  }
  getStoreList(formData) {
    let data = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : this.totalCount,
      "order": {
        "column": "oid",
        "dir": "asc"
      },
      "keySearch": formData ? formData.searchtxt : "",
      "fieldSearch": [
        {
          "fieldName": "country.oid",
          "fieldValue": formData ? formData.countryName : "",
        },
        {
          "fieldName": "cityOids",
          "fieldValue": formData ? formData.cityName.toString() : "",
        },
        {
          "fieldName": "mallOids",
          "fieldValue": formData ? formData.mall.toString() : "",
        },
        {
          "fieldName": "brandOids",
          "fieldValue": this.brandId,
        }
      ]
    }

    this.loadingResponse = true;
    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
      this.loadingResponse = false;
      this.totalRecordVal = true;
      this.totalFilterRecordVal = true;

      this.dataSource = new MatTableDataSource(res["items"]);
      this.stores = res['items'];
      this.resultsLength = res["totalCount"];
      this.total = res["totalCount"];

      this.noRecords = false;
      localStorage.setItem('stores', JSON.stringify(this.stores));
      this.paginationData = {
        pageIndex: 0,
        pageSize: 10,
        length: this.total,
        previousPageIndex: 0
      };
      this.getStoresForEdit();
      this.getUpdate(this.paginationData);

    }, error => {
      this.commonFunctions.displayErrorMessage(error);
      this.loadingResponse = true;
    })
  }
}
