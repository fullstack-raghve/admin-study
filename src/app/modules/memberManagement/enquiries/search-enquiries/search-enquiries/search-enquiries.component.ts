import { OnInit, ViewChild, Output, Input, Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Sort } from '@angular/material/sort';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface UserData {
  referenceId: number;
  customerId: string;
  phoneNumber: string;
  enquiryType: string;
  enquiryDate: string;
  enquiryStatus: string;
}

export interface Country {
  countryId: number;
  countryName: string;
}

export interface City {
  cityId: number;
  cityName: string;
}

@Component({
  selector: 'search-enquiries',
  templateUrl: './search-enquiries.component.html',
  styleUrls: ['./search-enquiries.component.scss']
})
export class SearchEnquiriesComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Member Management',
    link: ''
  }
  ];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  @ViewChild("searchEnquiriesForm") searchEnquiriesForm;
  searchAboutUsFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['referenceId', 'customerId', 'customerName', 'phoneNumber', 'enquiryType', 'internalEnquiryType', 'countryName', 'cityName', 'enquiryDate', 'status'];
  dataSource: MatTableDataSource<UserData>;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  public countryId;
  public countryList;
  Countries: Country[] = [];
  countryCtrl = new FormControl();
  filteredCountries: Observable<Country[]>;

  public cityId;
  public cityList;
  Cities: City[] = [];
  cityCtrl = new FormControl();
  filteredCities: Observable<City[]>;

  constructor(private fb: FormBuilder, private https: HttpService, public dialog: MatDialog,private router: Router,) {
    this.buildSearchEnquiryForm();
    this.dataSource = new MatTableDataSource();
  }
  public paginationData: any;
  status = true;
  public resultsLength = 0;
  buildFlag = false;
  public excelDate: any;
  public formattedJson: any;
  public enquiryTypeList: any;

  openFilter() {
    this.status = !this.status;
  }
  ngOnInit() {
   // this.getCountryList();
   this.getAllCountriesA();
    this.getEnquiryType();
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    if(sessionStorage.getItem('CheckType')=='Enquiries')
    {
          if (sessionStorage.searchValue) {
      this.searchAboutUsFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType','Enquiries');
    }
    // this.searchVal();
  }

  public exportAsExcel() {

    this.formattedJson = this.excelDate.map(res => {
      return {
        'Reference Id': res.referenceId,
        'Customer Id': res.customerId,
        'Customer Name': res.customerName,
        'Phone Number': res.phoneNumber,
        'Enquiry Type': res.enquiryType,
        'Internal Enquiry Type': res.internalEnquiryType,
        'Description': res.description,
        'City Name': res.cityName,
        'Country Nane': res.countryName,
        'Enquiry Date': res.eqnuiryDate != '' ? moment(res.eqnuiryDate).format('YYYY-MM-DD') : '',
        'Status': res.enquiryStatus,
        'Latest Internal Comment': res.internalComments,
        'Latest Customer Response': res.userResponse
      }
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.formattedJson);//convert the json value to xlsx woorkSheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'enquire');

    /* save to file */
    XLSX.writeFile(wb, 'Enquires.xlsx');
  }

  getCountryList() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countryList = response;

      })
  }

  getCitys(countryId: any) {
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
    this.https.getJson(GET_ALL_CITIES + "?countryIds=" + countryId)
      .subscribe((response) => {
        this.cityList = response;
      })
  }

  getAllCountriesA() {
    this.cityId = '';
    this.cityCtrl.reset('');
    this.cityList = [];
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
        .subscribe((response) => {
            // console.log(response);
            this.countryList = [];
            this.Countries = [];
            this.countryList = response;
            for (let i = 0; i <= this.countryList.length - 1; i++) {
                let objMallkey = {
                    countryId: this.countryList[i]['countryId'],
                    countryName: this.countryList[i]['countryName'],
                }
                // console.log(objMallkey);
                this.Countries.push(objMallkey);
            }
            this.filteredCountries = this.countryCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(country => country ? this._filterCountries(country) : this.Countries.slice())
                );
        },
            (error) => {
                console.log(error);
            });
}
private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.Countries.filter(country => country.countryName.toLowerCase().indexOf(filterValue) === 0);
}


  getAllCitiesA(countryId) {
    console.log(countryId);
    this.cityId = '';
    this.cityCtrl.reset('');
    this.cityList = [];
    if(countryId != undefined || countryId != ''){
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
    this.https.getJson(GET_ALL_CITIES + "?countryIds=" +  countryId)
        .subscribe((response) => {
            console.log(response);
            this.cityList = [];
            this.Cities = [];
            this.cityList = response;
            for (let i = 0; i <= this.cityList.length - 1; i++) {
                let objMallkey = {
                    cityId: this.cityList[i]['cityId'],
                    cityName: this.cityList[i]['cityName'],
                }
                // console.log(objMallkey);
                this.Cities.push(objMallkey);
            }
            this.filteredCities = this.cityCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(city => city ? this._filterCities(city) : this.Cities.slice())
                );
        },
            (error) => {
                console.log(error);
            });
}
}
private _filterCities(value: string): City[] {
    const filterValue = value.toLowerCase();
    return this.Cities.filter(city => city.cityName.toLowerCase().indexOf(filterValue) === 0);
}

getAllcountry(countryId) {
  this.countryId = countryId;
  console.log(this.countryId);
}

getAllcity(countryId) {
    this.cityId = countryId;
    console.log(this.cityId);
}

  public getEnquiryType() {
    let GET_ENQUIRY_TYPE = environment.APIEndpoint + "api/rpa/master/enquiry/type/v1/get/list";
    this.https.getJson(GET_ENQUIRY_TYPE)
      .subscribe(
        (response) => {
          this.enquiryTypeList = response;
        }, (err) => {

        })
  }

  public buildSearchEnquiryForm() {
    let form = {
      referenceId: ["",],
      enquiryStatus: [""],
      searchVal: [""],
      countryId: [""],
      cityId: [""],
      startDate: [""],
      endDate: [""],
      enquiryTypeId: [""]
    }
    this.searchAboutUsFormGroup = this.fb.group(form);
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  getUpdate(event: any) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  myTrim(x: any) {
    return x.replace(/^\s+|\s+$/gm, '');
  }

  searchVal() {
    let formdata = this.searchAboutUsFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    this.searchStoreVal = true;
    if (this.searchAboutUsFormGroup.invalid == false) {
      // let formdata = this.searchAboutUsFormGroup.value;
      let data =
      {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": this.sortColumn,
          "dir": this.sortDirection
        },
        "keySearch": sessionStorage.getItem('searchValue'),
        "fieldSearch": [
          {
            "fieldName": "oid",
            "fieldValue": this.myTrim(formdata.referenceId)
          },
          {
            "fieldName": "enquiryStatus",
            "fieldValue": this.myTrim(formdata.enquiryStatus)
          },
          {
            "fieldName": "countryOid",
            // "fieldValue": this.myTrim(formdata.countryId)
            "fieldValue": this.countryId != undefined ? this.countryId : ""
          },
          {
            "fieldName": "cityOid",
            // "fieldValue": this.myTrim(formdata.cityId)
            "fieldValue": this.cityId != undefined ? this.cityId : ""
          },
          {
            "fieldName": "fromDate",
            "fieldValue": formdata.startDate != '' ? moment(formdata.startDate).format('YYYY-MM-DD') : ''
          },
          {
            "fieldName": "toDate",
            "fieldValue": formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') : ''
          },
          {
            "fieldName": "enquiryStatus",
            "fieldValue": this.myTrim(formdata.enquiryStatus)
          }, {
            "fieldName": "enquiryType.oid",
            "fieldValue": this.myTrim(formdata.enquiryTypeId)
          }
        ]
      }
      this.https.postJson(environment.APIEndpoint + "api/rpa/enquiry/v1/search", data).subscribe(res => {
        this.searchStoreVal = false;
        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        this.buildFlag = true;
      },
      (error)=>{
        console.log(error);
        this.searchStoreVal = true;
      }
      )
    }
  }

  excelValue() {
    if (this.searchAboutUsFormGroup.invalid == false) {
      let formdata = this.searchAboutUsFormGroup.value;
      let data =
      {
        "page": "0",
        "pageSize": this.resultsLength,
        "order": {
          "column": "modifiedTime",
          "dir": "desc"
        },
        "keySearch": formdata.searchVal,
        "fieldSearch": [
          {
            "fieldName": "oid",
            "fieldValue": this.myTrim(formdata.referenceId)
          },
          {
            "fieldName": "enquiryStatus",
            "fieldValue": this.myTrim(formdata.enquiryStatus)
          },
          {
            "fieldName": "countryOid",
            // "fieldValue": this.myTrim(formdata.countryId)
            "fieldValue": this.countryId != undefined ? this.countryId : ""
          },
          {
            "fieldName": "cityOid",
            // "fieldValue": this.myTrim(formdata.cityId)
            "fieldValue": this.cityId != undefined ? this.cityId : ""
          },
          {
            "fieldName": "fromDate",
            "fieldValue": formdata.startDate != '' ? moment(formdata.startDate).format('YYYY-MM-DD') : ''
          },
          {
            "fieldName": "toDate",
            "fieldValue": formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') : ''
          },
          {
            "fieldName": "enquiryStatus",
            "fieldValue": this.myTrim(formdata.enquiryStatus)
          }, {
            "fieldName": "enquiryType.oid",
            "fieldValue": this.myTrim(formdata.enquiryTypeId)
          }
        ]
      }
      this.https.postJson(environment.APIEndpoint + "api/rpa/enquiry/v1/search", data).subscribe(res => {
        this.excelDate = res["items"];
        this.exportAsExcel();
      })
    }
  }


  reset() {
    this.buildSearchEnquiryForm();
    this.searchVal();
    this.cityCtrl.reset('');
    this.cityId = '';
    this.Cities = [];
    this.countryCtrl.reset('');
    this.countryId = '';
    this.Countries = [];
  }

  sortData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }

    this.searchVal();
  }
  viewEnquiry(ID){
    localStorage.setItem('EnquiryRefID',ID);
    this.router.navigate(['/view-enquiries']);
  }

}