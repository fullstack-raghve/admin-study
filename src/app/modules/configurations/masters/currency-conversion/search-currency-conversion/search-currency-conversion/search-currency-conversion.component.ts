import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface Currency {
    currencyId: number;
    currencyCode: string;
}

export interface ConversionData {
  baseCurrency: string;
  currency: string;
  conversionValue: string;
  createdTime: string;
  lastModifiedOn: string;
  modifiedBy: string;
  status: string;
}

@Component({
  selector: 'search-currency-conversion',
  templateUrl: './search-currency-conversion.component.html',
  styleUrls: ['./search-currency-conversion.component.scss']
})
export class SearchCurrencyConversionComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: ''
  }, {
    title: 'Currency Conversion',
    link: '/search-currency-conversion'
  }
  ];
  public currencyIdValue;
  currencies;
  Currencies: Currency[] = [];
  currencyCtrl = new FormControl();
  filteredCurrencies: Observable<Currency[]>;
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  searchConversionForm: FormGroup;
  displayedColumns: string[] = ['baseCurrency', 'currencyCode', 'conversionValue', 'createdTime', 'modifiedTime', 'modifiedBy', 'status'];
  dataSource: MatTableDataSource<ConversionData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public baseCurrencyData: any = [];
  // public currencies: any = [];
  public paginationData;
  public resultsLength = 0;
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  constructor(private fb: FormBuilder,private router:Router,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
    this.getAllCurrencies();
    this.getBaseCurrency();
  }
  status = true;
  openFilter() {
    this.status = !this.status;
  }
  
  ngOnInit() {
    this.buildSearchForm();
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.searchVal();
    if(sessionStorage.getItem('CheckType')=='CurrencyConversion'){
      if (sessionStorage.searchValue) {
        this.searchConversionForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
      }
      if (sessionStorage.paginationData ) {
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
      sessionStorage.setItem('CheckType','CurrencyConversion');
    }
  }
  public buildSearchForm() {
    this.searchConversionForm = this.fb.group({
      currency: [""],
      status: [""],
      searchVal: [""]
    });
  }
  
  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  searchKey(){
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchVal() {
    console.log(this.paginationData);
    this.searchStoreVal = true;
    let formdata = this.searchConversionForm.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);

    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": formdata.searchVal,
      "fieldSearch": [
        {
          "fieldName": "currency.oid",
        "fieldValue": this.currencyIdValue != undefined ? this.currencyIdValue : "",
        },
        {
          "fieldName": "status",
          "fieldValue": formdata.status
        }
      ]
    }
    let SEARCH_CURRENCY_CONVERSION = "api/rpa/master/currencyconversion/v1/search"
    this.https.postJson(environment.APIEndpoint + SEARCH_CURRENCY_CONVERSION, data).subscribe(res => {
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
      console.log(err);
      this.searchStoreVal = true;
    })
  }
  public getBaseCurrency() {
    let GET_BASE_CURRENCY = "api/rpa/master/currency/v1/getbasecurrency";
    this.https.getJson(environment.APIEndpoint + GET_BASE_CURRENCY)
      .subscribe((response) => {
        this.baseCurrencyData = response;

      })

  }
  // public getAllCurrencies() {
  //   let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
  //   this.https.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
  //     .subscribe((response) => {
  //       this.currencies = response;

  //     })

  // }

  getAllCurrencies() {

    let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
    this.https.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
        .subscribe((response) => {
            console.log(response);
            this.currencies = response;

            for (let i = 0; i <= this.currencies.length - 1; i++) {
                let objMallkey = {
                    currencyId: this.currencies[i]['currencyId'],
                    currencyCode: this.currencies[i]['currencyCode'],
                }
                this.Currencies.push(objMallkey);
            }
            this.filteredCurrencies = this.currencyCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(curreny => curreny ? this._filterCurrencies(curreny) : this.Currencies.slice())
                );

        },
            (error) => {
                console.log(error);
            });
}
private _filterCurrencies(value: string): Currency[] {
    const filterValue = value.toLowerCase();
    return this.Currencies.filter(curreny => curreny.currencyCode.toLowerCase().indexOf(filterValue) === 0);
}
oncurrencyChange(ev) {
    console.log(ev);
    this.currencyIdValue = ev;
}
  public reset() {
    this.currencyCtrl.reset('');
    this.currencyIdValue = '';
    this.noRecords = false;
    this.buildSearchForm();
    // this.searchVal();
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  MoveToView(ID){
    localStorage.setItem('CurrencyConversionViewID',ID);
    this.router.navigate(['/view-currency-conversion'])
  }

}
