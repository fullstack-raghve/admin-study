import { OnInit, ViewChild, Input, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { CommonFunctions } from 'src/app/services/common-functions';

@Component({
  selector: 'select-store-variant.component',
  templateUrl: 'select-store-variant.component.html',
  styleUrls: ['select-store-variant.component.scss']
})

export class selectStoreVariantDialog implements OnInit {
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
  @Input('brandId') brandId: number;
  @Input('tableData') tableData;
  @Input('storeGroup') storeGroup;
  @Input('activeGroupId') activeGroupId;
  @Input('productVariants') productVariants;
  @Input('isDisabled') isDisabled: boolean = false;
  @Input('programBrand') programBrand;
  disabledCountry: boolean = true;
  disabledCity: boolean = true;
  disabledMall: boolean = true;
  loadingResponse: boolean = true;
  disabledTable: boolean = true;

  // public selectAll: boolean = false;

  public searchStoreForm: FormGroup;
  public paginationData;
  public resultsLength = 0;
  public filteredResultsLength = 0;
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

  cityList: any;
  brandList: any[];

  cityId: any;
  countryIds: any;
  countryList: any = [];

  public countryIdval;
  public brandValueList = [];


  public selectedCityIdValue;
  allBrandCountryCityList = [];
  allBrandCountryBrandList = [];
  allSelectedCountries = [];

  paginationDetail = new BehaviorSubject({
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });

  mallList = [];
  stores = [];
  allBrands = [];
  isFilterOn = false;
  dataInView = [];
  checkboxClicked = false;
  storesForEdit = [];
  activeGroup = {
    groupId : 0,
    storeCount : 0,
    displayPriceCurrency : "INR",
    storeOids : [],
    variantTypeDetails: []
  };
  showFilteredCount: boolean = false;

  constructor(private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    public snackBar: MatSnackBar,
    private commonFunctions: CommonFunctions) {
    dialogRef.disableClose = true;
    this.dataSource = new MatTableDataSource();
  }
  public selection = new SelectionModel(true, []);

  ngOnInit() {
    this.buildForm();
    this.getAllBrands();
    this.getAllCountries();
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

  setProductVariants() {
    this.activeGroup.variantTypeDetails = [];
    this.productVariants.forEach(variant => {
      const obj = {
        variantTypeName : variant.variantTypeName,
        displayPrice : Number(variant.displayPrice)
      }
      this.activeGroup.variantTypeDetails.push(obj);
    });
  }

  getAllBrands() {
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

      let brandId = 0;
      if (localStorage.getItem('brandStores') !== null) {
        const obj = JSON.parse(localStorage.getItem('brandStores'));
        this.stores = obj.stores;
        brandId = obj.brandId;
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
      } else {
        this.getStoreList(this.searchStoreForm.value);
      }
      if(brandId != this.brandId) {
        this.getStoreList(this.searchStoreForm.value);
      }

    },
    (error) => {
      this.commonFunctions.displayErrorMessage(error);
      this.loadingResponse = true;
    });
  }

  getStoresForEdit() {
    this.storesForEdit = [];
    if(this.activeGroupId !== 0) {
      this.activeGroup = this.storeGroup.filter((group) => {
        return group.groupId === this.activeGroupId;
      })[0];

      this.storesForEdit = this.stores.filter((store) => {
        return this.activeGroup.storeOids.includes(store.storeOid);
      });

      for (let i of this.storesForEdit) {
        this.selection.select(i);
      }
     this.setProductVariants();

    } else {
      this.activeGroup = {
        groupId : 0,
        storeCount : 0,
        displayPriceCurrency : "INR",
        storeOids : [],
        variantTypeDetails: []
      }
      this.setProductVariants();
    }
    let filteredStores = [];
    let existingStoreOids = [];

    this.storeGroup.forEach((group) => {
      group.storeOids.forEach(storeOid => {
        existingStoreOids.push(storeOid);
      });
    });
    filteredStores = this.stores.filter((store) => {
      return !existingStoreOids.includes(store.storeOid);
    });

    this.storesForEdit = [...this.storesForEdit, ...filteredStores];
    this.resultsLength = this.storesForEdit.length;
  }

  getAllCountries() {
    this.selectedCityOptions = [];
    this.selectedCountryOptions = [];
    this.selectedMallOptions = [];

    this.disabledCountry = false;
    const GET_ALL_COUNTRIES = environment.APIEndpoint + 'api/rpa/master/country/v1/get/countries';
    this.https.getJson(GET_ALL_COUNTRIES).subscribe(res => {
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

  getAllCities(event) {
    this.countryIds = event;
    this.selectedCityOptions = [];
    this.selectedMallOptions = [];
    if (this.countryIds != '' && this.countryIds != null && this.countryIds != undefined) {
      this.disabledCity = false;
      let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/store/v1/get/cityList";
      this.https.getJson(GET_ALL_CITIES + "?brandOids=" + this.brandId + '&countryOids=' + this.countryIds)
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

  getAllMalls(event, countryId) {
    this.cityId = event;
    this.selectedMallOptions = [];
    this.mallList = [];
    if (countryId != '' && countryId != null && countryId != undefined && this.cityId != '' && this.cityId != null && this.cityId != undefined) {
      this.disabledCity = false;
      this.countrylistMall = this.searchStoreForm.controls['countryName'].value;
      countryId = [];
      countryId.push(this.countrylistMall);

      let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
      this.https
        .getJson(GET_ALL_MALLS + "?brandOids=" + this.brandId + '&countryOids=' + countryId + "&cityOids=" + this.cityId)
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

  onSelectStore() {
    let groupId = this.storeGroup.length === 0 ? 1 : this.storeGroup.length + 1;
    if(this.activeGroupId !== 0) {
      groupId = this.activeGroupId;
      this.storeGroup = this.storeGroup.filter((group) => {
        return group.groupId !== this.activeGroupId;
      })
    }
    let storeOids = [];
    this.selection.selected.forEach(store => {
      storeOids.push(store.storeOid);
    });
    const storeObj = {
      groupId: groupId,
      storeCount: storeOids.length,
      displayPriceCurrency: this.activeGroup.displayPriceCurrency,
      storeOids: storeOids,
      variantTypeDetails: this.activeGroup.variantTypeDetails
    }
    this.storeGroup.push(storeObj);

    let obj = {
      'buttonName': 'SELECT',
      'tableData': this.storeGroup,
    }
    this.dialogRef.close(obj);
  }

  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      'tableData': this.tableData,
    }
    this.dialogRef.close(obj);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
   this.checkboxClicked || this.isAllSelected() ?
      this.dataInView.forEach(row => this.selection.deselect(row)) :
      this.dataInView.forEach(row => this.selection.select(row));
    this.checkboxClicked = !this.checkboxClicked;
  }

  resetForm() {
    this.buildForm();
    this.showFilteredCount = false;
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
    this.showFilteredCount = true;
    return false;
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
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : 2000,
      "order": {
        "column": "oid",
        "dir": "asc"
      },
      "keySearch": formData ? formData.searchtxt : "",
      "fieldSearch": [
        {
          "fieldName": "country_oid",
          "fieldValue": formData ? formData.countryName : "",
        },
        {
          "fieldName": "city_oid",
          "fieldValue": formData ? formData.cityName.toString() : "",
        },
        {
          "fieldName": "brand_oid",
          "fieldValue": this.brandId,
        }
      ]
    }

    this.loadingResponse = true;
    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
      this.loadingResponse = false;
      this.totalRecordVal = true;

      this.dataSource = new MatTableDataSource(res["items"]);
      this.stores = res['items'];
      this.resultsLength = res["totalCount"];
      this.total = res["totalCount"];

      this.noRecords = false;
      const obj = {
        brandId : this.brandId,
        stores : this.stores
      }
      localStorage.setItem('brandStores', JSON.stringify(obj));
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
