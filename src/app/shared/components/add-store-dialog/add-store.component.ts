import { OnInit, ViewChild, Input, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

@Component({
  selector: 'add-store.component',
  templateUrl: 'add-store.component.html',
  styleUrls: ['add-store.component.scss']
})

export class addStoreDialog implements OnInit {
  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
  @ViewChild('mallInput') mallInput: SelectAutocompleteComponent;
  public cityIdValue;
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  dataSource: MatTableDataSource<object>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'storeId', 'brandName', 'storeName', 'address', 'mallName', 'city', 'country'];
  @Input('storeList') storeList = [];
  @Input('totalCount') totalCount = [];
  @Input('programBrand') programBrand;
  @Input('brandOid') brandOid: number = 0;
  @Input('isDisabled') isDisabled: boolean = false;
  disabledCountry: boolean = true;
  disabledCity: boolean = true;
  disabledMall: boolean = true;
  loadingResponse: boolean = true;
  disabledTable: boolean = true;
  totalFilterRecordVal: boolean = true;
  // public isDisabled;
  public searchStoreForm: FormGroup;
  public paginationData;
  public Obj;
  public resultsLength = 0;
  public selectAll: boolean = false;
  public noRecords: boolean = false;
  public arrlength = [10, 20, 50, 100];
  public total: number;
  public updatedTotal;
  public paginatorArray;
  public selectedArray;
  public getSelected = [];
  dataSourceAll;
  public selectedCount = 0;
  status = true;

  public selectedOptions;

  public storeOidValue;
  public selectedmallIdValue;
  selectedBrandIdValue: any;
  mallList: any = [];


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
  brands: any[];
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
  public selectedStoreLength;

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

    this.buildForm();
     this.getAllBrands();

    console.log(this.programBrand);
    console.log(this.brandOid);
    this.selectedStoreLength = this.storeList.length;
    // if (this.brandOid > 0) {
    //   let brandOids = this.searchStoreForm.get('brands');

    //   brandOids.setValue(this.brandOid);
    //   brandOids.updateValueAndValidity();
    // }
    this.getStoreList(this.searchStoreForm.value);
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  
  public countryIdval;
  public brandValueList = [];
  

  public selectedCityIdValue;
  allBrandCountryCityList = [];
  allBrandCountryBrandList = [];
  allSelectedCountries = [];

  getAllBrands() {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
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
            var uniqueArray = this.removeDuplicatesJSON(this.brandValueList, 'brandId');
            console.log(uniqueArray);
            this.brandValueList = uniqueArray;
          });
          console.log(this.brandValueList);
      },
        (error) => {
          console.log(error);
        });
}

  getAllCountries(selectedBrandIds) {
    this.selectedCityOptions = [];
    this.selectedCountryOptions = [];
    this.selectedMallOptions = [];
    this.countryInput.selectAllChecked = false;
    this.cityInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    if (selectedBrandIds != '' && selectedBrandIds != null && selectedBrandIds != undefined) {
      this.disabledCountry = false;
    const GET_ALL_COUNTRIES = environment.APIEndpoint + 'api/rpa/master/brand/v1/get/regions';
    this.https.getJson(GET_ALL_COUNTRIES + '?brandOid=' + selectedBrandIds).subscribe(res => {
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
        var uniqueArray = this.removeDuplicatesJSON(this.countryList, 'countryId');
        console.log(uniqueArray);
        this.countryList = uniqueArray;
      });
      console.log(this.countryList);
    }, err => {
      console.log(err);
    });
  }
  else{
    this.cityList = [];
    this.countryList = [];
    this.mallList = [];
  }
}
  getAllCities(event,brandId) {
    console.log(brandId);
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
          console.log(response);
          // this.cities = response;
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
            console.log(this.cityList);
            // this.cityList = this.cities;
            var uniqueArray = this.removeDuplicatesJSON(this.cityList, 'cityId');
            console.log(uniqueArray);
            this.cityList = uniqueArray;
          }
          )
        })
    } else {
      this.cityList = [];
      this.mallList = [];
    }
  }

  getAllMalls(event, brandId, countryId) {
    this.cityId = event;
    this.selectedMallOptions = [];
    this.mallInput.selectAllChecked = false;
    if (this.cityId != '' && this.cityId != null && this.cityId != undefined && countryId != '' && countryId != null && countryId != undefined && brandId != '' && brandId != null && brandId != undefined) {
      this.disabledMall = false;
      this.countrylistMall = this.searchStoreForm.controls['countryName'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchStoreForm.controls['brand'].value;
    console.log(this.brandMallList);
    brandId = [];
    brandId.push(this.brandMallList);
      let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
      this.https
        .getJson(GET_ALL_MALLS + "?brandOids=" + brandId + '&countryOids=' + countryId + "&cityOids=" + this.cityId)
        .subscribe(response => {
          console.log(response);
          // this.mallListall = response;
          this.mallList = [];
          console.log(this.mallList)
          response.forEach(res => {
            this.mallList.push({
              "mallCode": res.mallCode,
              "mallId": res.mallId,
              "mallName": res.mallName,
              "languageDirection": res.languageDirection,
              "value": res.mallId
            });

          });

         // this.mallList = this.mallListall;
          var uniqueArray = this.removeDuplicatesJSON(this.mallList, 'mallId');
          console.log(uniqueArray);
          this.mallList = uniqueArray;
        });
    }
    else {
      this.mallList = [];
      // this.disabledMall = true;
    }
    }

  
  public mallIdValue;
  getMallVal(ev) {
    console.log(ev.mallId);
    this.mallIdValue = ev.mallId;
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

  openFilter() {
    this.status = !this.status;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;

    const numRows = this.dataSource.data.length;
    // console.log(numSelected);
    // console.log(this.selection.selected);
    this.selectedArray = this.selection.selected;

    return numSelected === numRows;
    console.log(numSelected);

  }


  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      'tableData': this.selection.selected,
      'totalCount': this.resultsLength
    }
    this.dialogRef.close(obj);

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  resetForm() {
    this.buildForm();
    this.countryInput.selectAllChecked = false;
    this.cityInput.selectAllChecked = false;
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.countries = [];
    this.cities = [];
    this.mallList = [];
    this.disabledCountry = true;
    this.disabledCity = true;
    this.disabledMall = true;
    this.getStoreList(this.searchStoreForm.value);
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
    this.getStoreList(this.searchStoreForm.value);
  }

  getStoreData(paginator) {
    console.log(paginator);
  }

  getStoreList(formData) {
    console.log(this.totalCount);

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
          // "fieldValue": this.brandOid > 0 ? this.brandOid : "",
          "fieldValue": formData ? formData.brand.toString() : "",
        }
      ]
    }

    console.log(data.fieldSearch['fieldValue'] == !"");
    if (data.fieldSearch['fieldValue'] == !"") {
      console.log("not empty")
    }
    this.loadingResponse = true;
    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
      this.loadingResponse = false;
      this.totalRecordVal = true;
      this.totalFilterRecordVal = true;
      this.dataSource = new MatTableDataSource(res["items"]);
      this.dataSourceAll = this.dataSource;
      console.log(this.dataSourceAll);
      this.resultsLength = res["totalCount"];
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      this.total = res["totalCount"];
      console.log(this.total);

      if (this.total == 0) {
        this.disabledTable = true;
      } else {
        this.disabledTable = false;
      }

      // console.log(this.total);
      // console.log(typeof(this.total));
      console.log(res);


      // console.log(this.arrlength);
      if (this.storeList.length > 0) {
        console.log(this.storeList.length);
        console.log(this.storeList);

        for (let i of this.dataSource.data) {
          if (this.storeList.indexOf(i["storeOid"]) > -1) {
            this.selection.select(i);
          }
        }
      } else if (this.selectAll) {
        for (let i of this.dataSource.data) {
          this.selection.select(i);
        }
      }

    }, err => {
      console.log(err);
      this.loadingResponse = true;
    })
    // if(this.total > 100){
    //   this.updateTotal(this.total);
    // }

  }
  public updateTotal(total) {
    setTimeout(function () {
      this.loadingResponse = true;
    }, 500);

    let updatedTotal = total;
    this.arrlength.push(updatedTotal);
    // console.log(updatedTotal);
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
        },
        {
          "fieldName": "mallOids",
          "fieldValue": formData ? formData.mall.toString() : "",
        },
        {
          "fieldName": "brandOids",
          // "fieldValue": this.brandOid > 0 ? this.brandOid : "",
          "fieldValue": formData ? formData.brand.toString() : "",
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
      console.log(res);

    })
  }
}