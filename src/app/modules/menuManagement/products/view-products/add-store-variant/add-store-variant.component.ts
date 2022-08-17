import { OnInit, ViewChild, Input, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

export interface variantsData {
    extraColumns: string;
}

@Component({
    selector: 'add-store-variant',
    templateUrl: './add-store-variant.component.html',
    styleUrls: ['./add-store-variant.component.scss']
})

export class VariantsAddStoreDialogComponent implements OnInit {
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    public addStoreForm: FormGroup;
    secondFormGroup: FormGroup;
    dataSource: MatTableDataSource<variantsData>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['select', 'storeId', 'storeName', 'country', 'currencyCode', 'extraColumns'];
    @Input('storeList') storeList = [];
    @Input('variantsDataList') variantsDataList = [];
    @Input('storeListCurrency') storeListCurrency = [];
    @Input('variantsData') variantsData = [];
    @Input('variantsName') variantsName = [];
    @Input('variantsEditData') variantsEditData = [];
    @Input('variantsStorePopupDataEdit') variantsStorePopupDataEdit = [];
    @Input('viewVariantsName') viewVariantsName = [];
    @Input('totalCount') totalCount = [];
    @Input('programBrand') programBrand;
    @Input('brandOid') brandOid: number = 0;
    @Input('isDisabled') isDisabled: boolean = false;
    @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
    @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;
    disabledCity: boolean = true;
    disabledMall: boolean = true;
    loadingResponse: boolean = true;
    disabledTable: boolean = true;
    totalFilterRecordVal: boolean = true;
    public countryOid: number;
    public Obj;
    public cities: any = [];
    public countries: any = [];
    public selectAll: boolean = false;
    public totalRecordVal: boolean = false;
    public brandList = [];
    public paginatorArray;
    public selectedArray = [];
    public getSelected = [];
    dataSourceAll;
    public selectedCount = 0;
    status = true;
    cityOid: number;
    rigionList: any;
    currencyOids: any;
    conversionList: any[];
    table: any;
    variantsDataArray: any[];
    dataView: any;
    variantsDataView: any = [];
    getData: any;
    editFlag: any;
    selectedStoreCount: any;
    contentEditable: boolean;
    public checked;
    viewData: any;
    public localesList: any[] = [0];
    totalStores: variantsData[];
    totalStoresAvailable: any[];
    variantsView: any;
    allStoreDetails: any;
    variantsTypeArray: any;

    public paginationData;
    public resultsLength = 0;
    public noRecords: boolean = false;
    public arrlength = [10, 20, 50, 100];
    public total: number;
    public updatedTotal;
    stores = [];
    isFilterOn = false;
    dataInView = [];
    checkboxClicked = false;
    allCountries = [];
    countryIds: any;
    countryList: any = [];

    selectedCityOptions: any[];
    selectedCountryOptions : any[];
    cityList: any[];

    constructor(private fb: FormBuilder,
        private https: HttpService,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<MatDialog>,
        public snackBar: MatSnackBar,
        private http: HttpService) {
        dialogRef.disableClose = true;
        this.dataSource = new MatTableDataSource();
      
    }
    
    public selection = new SelectionModel(true, []);

    ngOnInit() {
        this.getOnBoardingRegions();
        this.getBaseCurrency();
        this.buildForm();
        this.getVariantList(this.addStoreForm.value);
        this.getAllCountries();
        this.buildCreateVariantsFrom();
    }

    buildForm() {
        this.addStoreForm = this.fb.group({
            searchtxt: [""],
            cityName: [""],
            countryName: [""]
        });
    }

    applyFilters(filteredSource) {
      let formData = this.addStoreForm.value;
      let result = filteredSource;
      console.log(filteredSource);
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
      return result;
    }
      eventPreventDefault($event, flag =false) {
        $event.preventDefault();
        this.getLocalStorageSearchList(flag);
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
        this.totalFilterRecordVal = true;
        const searchValue = this.addStoreForm.value.searchtxt.toLowerCase();
        let searchedSource = this.stores;
        if (searchValue !== '') {
          searchedSource = this.stores.filter((store) => {
            return ('storeId' in store && store.storeId.toLowerCase().includes(searchValue)) ||
            ('storeName' in store && store.storeName.toLowerCase().includes(searchValue)) ||
            ('storeAddress' in store && store.storeAddress.toLowerCase().includes(searchValue)) ||
            ('cityName' in store && store.cityName.toLowerCase().includes(searchValue)) ||
            ('countryName' in store && store.countryName.toLowerCase().includes(searchValue));
          });
        }
    
        if(this.isFilterOn) {
          let formData = this.addStoreForm.value;
          if(formData.cityName || formData.countryName) {
            searchedSource = this.applyFilters(searchedSource);
          }
        }
    
        let start = this.paginationData.pageIndex * this.paginationData.pageSize;
        let end = start + this.paginationData.pageSize;
        let filteredSource = searchedSource.slice(start, end);
    
        this.dataSource = new MatTableDataSource(filteredSource);
        this.resultsLength = searchedSource.length;
        if (this.resultsLength === 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
    
        if (this.total === 0) {
          this.disabledTable = true;
        } else {
          this.disabledTable = false;
        }
    
        // this.countryList = [];
        for(let store of this.stores) {
          for(let country of this.allCountries) {
            if(store.countryId === country.countryId) {
              this.countryList.push(country);
            }
          }
        }
    
        this.countryList = this.removeDuplicatesJSON(this.countryList, 'countryId');
        this.loadingResponse = false;
        this.dataInView = searchedSource;
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

    getAllCountries() {
      // this.countryInput.selectAllChecked = false;
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
        this.allCountries = JSON.parse(JSON.stringify(this.countryList));
        if (localStorage.getItem('stores') !== null) {
          this.stores = JSON.parse(localStorage.getItem('stores'));
          this.total = this.stores.length;
          this.paginationData = {
            pageIndex: 0,
            pageSize: 10,
            length: this.total,
            previousPageIndex: 0
          };
          this.getUpdate(this.paginationData);
          this.paginator.pageIndex = this.paginationData.pageIndex;
        } else {
          this.getVariantList(this.addStoreForm.value);
        }
  
        if (this.storeList.length > 0) {
          for (let i of this.stores) {
            if (this.storeList.indexOf(i["storeOid"]) > -1) {
              this.selection.select(i);
            }
          }
        }
      }, err => {
        console.log(err);
      });
    }
  
    getAllCities(event) {
      this.countryIds = event;
      this.selectedCityOptions = [];
      // this.cityInput.selectAllChecked = false;
      if (this.countryIds != '' && this.countryIds != null && this.countryIds != undefined) {
        this.disabledCity = false;
      let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
     this.https.getJson(GET_ALL_CITIES + "?countryIds=" + this.countryIds)
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
            }, err => {
              console.log(err);
            });
            this.cityList = this.removeDuplicatesJSON(this.cityList, 'cityId');
          });
      } else {
        this.cityList = [];
      }
    }

    openFilter() {
        this.status = !this.status;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        this.selectedArray = this.selection.selected;
        this.selectedStoreCount = this.selectedArray.length;
        return numSelected === numRows;
    }


    onCloseClick(): void {
        let obj = {
            'buttonName': 'CANCEL',
            'tableData': this.selection.selected,
            'variantsData': this.variantsDataView,
            'totalCount': this.resultsLength
        }
        this.dialogRef.close(obj);
        console.log(obj);
        console.log(this.variantsDataView);

    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    resetForm() {
        this.buildForm();
        this.disabledCity = true;
    }
    paginationDetail = new BehaviorSubject(
        {
            length: 10,
            pageIndex: 0,
            pageSize: 10
        });

    getUpdate(event) {
        this.paginationDetail.next(event);
        this.paginationData = event;
        this.getLocalStorageSearchList();
    }

    getStoreData(paginator) {
        console.log(paginator);
    }

    getOnBoardingRegions() {
        let GET_ALL_REGIONS = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view";
        this.http.getJson(GET_ALL_REGIONS)
            .subscribe((response) => {
                this.currencyOids = response["regionList"].map(oid => oid.currencyOid);
                this.rigionList = response['regionList'];
                this.getCurrencyConversionValue(this.currencyOids);
            })
    }

    public basecurrency = '';
    getBaseCurrency() {
        let GET_BASE_CURRENCY = environment.APIEndpoint + "api/rpa/master/currency/v1/getbasecurrency";
        this.http.getJson(GET_BASE_CURRENCY)
            .subscribe((response) => {
                this.basecurrency = response["currencyCode"];
            })
    }

    public getCurrencyConversionValue(currencyOids: any) {
        let GET_ALL_CURRENCY_CONVERSION_VALUE = environment.APIEndpoint +
            "api/rpa/master/currencyconversion/v1/get/conversionRate?currencyOids=" +
            currencyOids;
        this.http.getJson(GET_ALL_CURRENCY_CONVERSION_VALUE)
            .subscribe((response) => {
                console.log(response);
                this.conversionList = response;

            })
    }

    public buildCreateVariantsFrom() {
        let formData = {
            variantRegionArray: this.fb.array([])
        }
        this.secondFormGroup = this.fb.group(formData);
    }

    public getGroupDataVariants(viewData) {
        this.storeListCurrency = viewData;
        if (this.variantsStorePopupDataEdit.length <= 0 || this.variantsStorePopupDataEdit.length == null) {
            for (let j = 0; j < this.variantsData.length; j++) {
                if (this.variantsData[j].isVariantTypeSelected == true) {
                    const control = <FormArray>this.secondFormGroup.controls['variantRegionArray'];
                    let newForm = this.fb.group({
                        variantTypeOid: [this.variantsData[j].variantTypeOid],
                        displayPrice: [this.variantsData[j].displayPrice, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
                    });
                    control.push(newForm);
                }
            }
            this.variantsDataView = this.secondFormGroup.value;
        }
        else {
            for (let i = 0; i < this.totalStoresAvailable.length; i++) {
                for (let k = 0; k < this.variantsData.length; k++) {
                    const control = <FormArray>this.secondFormGroup.controls['variantRegionArray'];
                    if (this.variantsData[k].isVariantTypeSelected == true) {
                        const newForm = this.fb.group({
                            variantTypeOid: [this.variantsData[k].variantTypeOid],
                            displayPrice: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
                        });
                        control.push(newForm);
                    }
                }
                if (this.storeListCurrency[i].storeOid == this.totalStoresAvailable[i].storeOid) {
                    for (let j = 0; j < this.storeListCurrency[i].variants.length; j++) {
                        let details = this.secondFormGroup.get('variantRegionArray') as FormArray;
                        let displayPrice = details.at(j).get('displayPrice');
                        displayPrice.setValue(this.storeListCurrency[i].variants[j].displayPrice);
                        displayPrice.updateValueAndValidity();
                    }
                }
            }
            this.variantsDataView = this.secondFormGroup.value;
        }
    }

    public getAllDetails(data) {  
        this.variantsDataView = this.secondFormGroup.value;
        this.variantsTypeArray = [];
        const control = <FormArray>this.secondFormGroup.controls['variantRegionArray'];
        for (let i = 0; i < this.selection.selected.length; i++) {
            for (let j = 0; j < this.variantsData.length; j++) {
                let details = this.secondFormGroup.get('variantRegionArray') as FormArray;
                let locale = {
                    variantTypeOid: details.at(j).get('variantTypeOid').value,
                    displayPrice: details.at(j).get('displayPrice').value,
                }
                this.variantsTypeArray.push(locale);
            }
        } 
    }

    public autoPopulateCurrencyValue(column: any, row: any, currencyValue: any) {
        // if (row == 0 && currencyValue != null && currencyValue != '') {
        //     for (let i = 0; i < this.storeListCurrency.length; i++) {
        //         for (let conversion of this.conversionList) {
        //             const control = <FormArray>this.secondFormGroup.controls['variantRegionArray'];
        //             // const array = <FormArray>control.controls['variants'];
        //             // const array = <FormArray>this.secondFormGroup.controls['variants'];
        //             console.log(control);
        //             console.log(conversion.currencyCode);
        //             // for (let j = 0; j < this.variantsData.length; j++) {
        //             //     if (conversion.currencyCode === this.storeListCurrency[i].currency && j !== 0) {
        //             //         let conversionValue = conversion.conversionValue * parseInt(currencyValue);
        //             //         array.at(j).patchValue({
        //             //             displayPrice: [conversionValue.toFixed(2)]
        //             //         });
        //             //         array.markAsPristine;
        //             //     }
        //             // }
        //             for (let j = 0; j < this.variantsStorePopupDataEdit.length; j++) {
        //                 for (let k = 0; k <= j; k++) {
        //                     if (conversion.currencyCode === this.storeListCurrency[i].currency && k !== 0) {
        //                         let conversionValue = conversion.conversionValue * parseInt(currencyValue);
        //                         control.at(i).patchValue({
        //                             displayPrice: [conversionValue.toFixed(2)]
        //                         });
        //                         control.markAsPristine;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
    }

      getVariantList(formData) {
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
                }
            ]
        }

        if (data.fieldSearch['fieldValue'] == !"") {
            console.log("not empty")
        }

        this.loadingResponse = true;
        this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
            this.totalStoresAvailable = res["items"];
            this.loadingResponse = false;
            this.totalRecordVal = true;
            this.totalFilterRecordVal = true;
            this.dataSource = new MatTableDataSource(res["items"]);
            this.dataSourceAll = this.dataSource;
            this.stores = res['items'];
            this.totalStores = this.dataSource.data;
            this.resultsLength = res["totalCount"];
            this.noRecords = false;
            this.total = res["totalCount"];
            this.getGroupDataVariants(this.storeListCurrency);
            localStorage.setItem('stores', JSON.stringify(this.stores));
            this.paginationData = {
              pageIndex: 0,
              pageSize: 10,
              length: this.total,
              previousPageIndex: 0
            };
            this.getUpdate(this.paginationData);
        }, err => {
            console.log(err);
            this.loadingResponse = true;
        })
    }

    public updateTotal(total) {
        setTimeout(function () {
            this.loadingResponse = true;
        }, 500);

        let updatedTotal = total;
        this.arrlength.push(updatedTotal);
        console.log(this.arrlength);
        const arrray = this.arrlength;
        console.log(arrray);
        this.arrlength = Array.from(new Set(arrray));
        console.log(this.arrlength);
        this.arrlength = this.arrlength.filter(function (element) {
            return element !== undefined;
        });

    }

    public updateCheck(i) {
        console.log('updateCheck');
        console.log(i);
    }

    public doSelectAll(formData) {
        console.log('doSelectAll');
        console.log(formData);
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
                }
            ]
        }
        this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/search', data).subscribe(res => {
            console.log(res);

        })
    }
}


