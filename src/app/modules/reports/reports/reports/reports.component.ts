import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DomSanitizer } from '@angular/platform-browser';

export interface UserData {
  BrandName: string;
  MallName: string;
  StoreId: number;
  StoreName: string;
  Status: string;
  CountryName: string;
  CityName: string;
  TotalTransactions: number;
  TotalLoyalityTransaction: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Reports',
    link: ''
  },
  ];
  public reportsUrl: any;
  @ViewChild("genrateReportFileForm") genrateReportFileForm;
  @ViewChild("searchReportForm") searchReportForm;
  searchReportFormGroup: FormGroup;
  genrateReportFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['BrandName', 'MallName', 'StoreId', 'StoreName','Status','CountryName',
  'CityName','TotalTransactions','TotalLoyalityTransaction'];
  dataSource: MatTableDataSource<UserData>;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public userId = localStorage.getItem("userId");
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  status = true;
  ranges = [
    {
      rangeId: 1,
      rangeLevel: '1'
    },
    {
      rangeId: 2,
      rangeLevel: '2'
    },
  ];
  countries = [
    {
      countryId: 1,
      countryName: 'India'
    },
    {
      countryId: 2,
      countryName: 'London'
    },
  ];
  cities = [
    {
      cityId: 1,
      cityName: 'Banglore'
    },
    {
      cityId: 2,
      cityName: 'London'
    },
  ];
  brands = [
    {
      brandId: 1,
      brandName: 'Brand 1'
    },
    {
      brandId: 2,
      brandName: 'Brand 2'
    },
  ];
  malls = [
    {
      mallId: 1,
      mallName: 'Mall 1'
    },
    {
      mallId: 2,
      mallName: 'Mall 2'
    },
  ];
  stores = [
    {
      storeId: 1,
      storeName: 'Store 1'
    },
    {
      storeId: 2,
      storeName: 'Store 2'
    },
  ];
  reporttypes = [
    {
      reportTypeId: 1,
      reporttypeName: 'Report Type Name 1'
    },
    {
      reportTypeId: 2,
      reporttypeName: 'Report Type Name 2'
    },
  ];
  reports = [
    {
      reportId: 1,
      reportName: 'Report 1'
    },
    {
      reportId: 2,
      reportName: 'Report 2'
    },
  ];
  REPORT_URL: string;
  constructor(private fb: FormBuilder, private https: HttpService,private sanitized: DomSanitizer) {
    const fileUploadList: UserData[] = [
      {
        'BrandName': 'ALDO',
        'MallName': 'Abu Dhabi Mall',
        'StoreId': 372323,
        'StoreName': 'Al Raji mall',
        'Status': 'Online',
        'CountryName': 'UAE',
        'CityName': 'Abu Dhabi',
        'TotalTransactions': 2500,
        'TotalLoyalityTransaction': 1000
      },
     ];
     console.log(fileUploadList);
    this.dataSource = new MatTableDataSource(fileUploadList);
  }

  ngOnInit() {
    this.getReports();
    this.buildSearchReportForm();
    this.buildCreateReportForm();
    this.searchVal();
    // this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  openFilter() {
    this.status = !this.status;
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
    this.searchVal();
  }
  buildSearchReportForm() {
    let form = {
      rangeCtrl: [""],
      countryCtrl: [""],
      cityCtrl: [""],
      brandCtrl: [""],
      mallCtrl: [""],
      storeCtrl: [""] 
    }
    this.searchReportFormGroup = this.fb.group(form);
  }
  buildCreateReportForm() {
    let form = {
      reportTypeCtrl: [""],
      reportCtrl: [""],
    }
    this.genrateReportFormGroup = this.fb.group(form);
  }
  genrateReport(){
    
  }
  searchVal() {
    let formdata = this.searchReportFormGroup.value;
    console.log(formdata);

  }
  resetForm() {
    this.buildSearchReportForm();
    this.searchVal();
  }

  getReports(){
    // this.REPORT_URL = 'https://danbroreport.reciproci.com/get_report?user_id='+this.userId+'&language_id=1&Menu_OID=9&pr=Yes';
    this.REPORT_URL = 'https://danbroreport.reciproci.com/New_get__reports?user_id='+this.userId+'&language_id=1&Menu_OID=9&pr=Yes'
  }
  public items = [
    {
        id: 0
    },
    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    },
    {
        id: 4
    },
    {
        id: 5
    },
    {
        id: 6
    },
    {
        id: 7
    },
    {
        id: 8
    },
    {
        id: 9
    },
    {
        id: 10
    },
]

}
