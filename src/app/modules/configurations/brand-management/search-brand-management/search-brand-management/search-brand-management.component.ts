import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
export interface BrandsData {
  brandName: string;
  brandCode: string;
  groupBy: string;
  countryName: string;
  createdBy: string;
  createdTime: string;
  modifiedTime: string;
  status: string;
}


@Component({
  selector: 'search-brand-management',
  templateUrl: './search-brand-management.component.html',
  styleUrls: ['./search-brand-management.component.scss']
})
export class BrandsComponent implements OnInit {
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  public countries: any = [];
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  searchBrandFormGroup: FormGroup;

  public breadCrumbData: Array<Object> = [{
    title: 'Brand Management',
    link: ''
  }, {
    title: 'Search Brand',
    link: 'search-brand-management'
  }
  ];

  displayedColumns: string[] = ['brandName', 'brandCode', 'groupBy', 'countryName', 'createdBy', 'createdTime', 'modifiedTime', 'status'];
  dataSource: MatTableDataSource<BrandsData>;

  constructor(private fb: FormBuilder, private http: HttpService,
    public router: Router,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
  }

  status = true;
  openFilter() {
    this.status = !this.status;
  }

  ngOnInit() {
    this.buildBrandSearchForm();
    this.getAllCountries();
    if (sessionStorage.getItem('CheckType') == 'BrandManagementModule') {
      if (sessionStorage.searchValue) {
        this.searchBrandFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType', 'BrandManagementModule');
    }
    // this.searchVal();
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
  }

  public buildBrandSearchForm() {
    let form = {
      brandCode: ["",],
      brandName: ["",],
      countryId: ["",],
      status: [""],
      searchVal: [""]
    }
    this.searchBrandFormGroup = this.fb.group(form);
  }

  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.http.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countries = response;
      })
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }


  searchVal() {
    this.searchStoreVal = true;
    let formdata = this.searchBrandFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    if (this.searchBrandFormGroup.invalid == false) {
      let formdata = this.searchBrandFormGroup.value;
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
            "fieldName": "brand.brandCode",
            "fieldValue": formdata.brandCode,
          },
          {
            "fieldName": "brandName",
            "fieldValue": formdata.brandName
          },
          {
            "fieldName": "countryOids",
            "fieldValue": formdata.countryId
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          }
        ]
      }
      let SEARCH_BRANDS = "api/rpa/master/brand/v1/search"
      this.https.postJson(environment.APIEndpoint + SEARCH_BRANDS, data).subscribe(res => {
        this.searchStoreVal = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
        if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
          this.paginationData.pageIndex = 0;
          this.paginator.pageIndex = 0;
          this.searchVal();
        }
      }, err => {
        this.searchStoreVal = true;
      })
    }
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "asc";
    }
    this.searchVal();
  }

  resetForm() {
    this.noRecords = false;
    this.buildBrandSearchForm();
    this.searchVal();
  }

  viewBrandManagement(ID) {
    localStorage.setItem('viewBrandManagementId', ID);
    this.router.navigate(['/view-brand-management']);
  }
}

