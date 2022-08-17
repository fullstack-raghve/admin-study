import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import {
  MatTableDataSource, MatPaginator, MatSort, MatDialogRef,
  MatDialog, MAT_DIALOG_DATA
} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-select-kiosk-dialog',
  templateUrl: './select-kiosk-dialog.component.html',
  styleUrls: ['./select-kiosk-dialog.component.scss']
})
export class SelectKioskDialogComponent implements OnInit {
  public searchKioskForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Feedback',
    link: ''
  }];
  public displayedColumns: string[] = ['select', 'deviceId', 'deviceName', 'location', 'countryName', 'brandName', 'connections', 'lastOnline', 'batteryPercentage', 'status', 'code', 'preview'];
  public status = true;
  public dataSource;
  public paginationData;
  public resultsLength = 0;
  public storeList;
  public searchResults: boolean = false;
  public selectAll: boolean = false;
  loadingResponse: boolean = true;
  disabledTable: boolean = true;
  totalFilterRecordVal: boolean = true;
  public totalRecordVal: boolean = false;
  public noRecords: boolean = false;
  public total: number;
  @Input('UserList') UserList = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input('totalCount') totalCount = [];
  scrollbarOptions;
  flows: any;
  flowURL: string;
  countries: any[];
  countryId: any;
  brandList: any;

  selection = new SelectionModel(true, []);
  public fieldSearchData: any;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private https: HttpService, private dialogRef: MatDialogRef<MatDialog>, ) {
    this.flowURL = window.location.href;
    this.flowURL = this.flowURL.replace(/\/.*/, '');
    console.log(this.flowURL);
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log(this.data);
    this.fieldSearchData = this.data;
    console.log(this.UserList);
    this.getAllStores();
    this.getFeedback();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.buildKioskForm();
    this.getKioskList();

  }

  openFilter() {
    this.status = !this.status;
  }

  buildKioskForm() {
    this.searchKioskForm = this.fb.group({
      kioskId: ['',],
      searchVal: ['',],
      kioskname: ['',],
      kioskstore: ['',],
      LastOnline: ['',],
      battery: ['',],
      code: ['',],
      device: ['',],
      assignedflow: ['',],
      // kioskCountry: [''],
      // kioskBrand: ['']
    });
  }
  getKioskList() {
    this.searchResults = true;
    console.log(this.paginationData);
    if (this.searchKioskForm.invalid === false) {
      const formdata = this.searchKioskForm.value;
      const data = {
        'page': this.paginationData !== undefined ? this.paginationData.pageIndex : '0',
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : 1000,
        "order": {
          "column": this.sortColumn,
          "dir": this.sortDirection
        },
        'keySearch': formdata.searchVal,
        'fieldSearch': [
          {
            'fieldName': 'oid',
            'fieldValue': formdata.kioskId
          },
          {
            'fieldName': 'deviceName',
            'fieldValue': formdata.kioskname
          },
          {
            'fieldName': 'store.oid',
            'fieldValue': formdata.kioskstore
          },
          {
            'fieldName': 'lastOnline',
            'fieldValue': formdata.LastOnline
          },
          {
            'fieldName': 'batteryStatus',
            'fieldValue': formdata.battery
          },
          {
            'fieldName': 'verificationCode',
            'fieldValue': formdata.code
          },
          {
            'fieldName': 'deviceMake',
            'fieldValue': formdata.device
          },
          {
            'fieldName': 'assignedFlowOid',
            'fieldValue': formdata.assignedflow
          },
          {
            'fieldName': 'countryOid',
            'fieldValue': this.fieldSearchData.countryOid == '' || this.fieldSearchData.countryOid == undefined ? '' : this.fieldSearchData.countryOid.toString()
          },
          {
            'fieldName': 'brandOid',
            'fieldValue': this.fieldSearchData.brandOid == '' || this.fieldSearchData.brandOid == undefined ? '' : this.fieldSearchData.brandOid.toString()
          },
          {
            'fieldName': "cityOid",
            'fieldValue': this.fieldSearchData.cityOid == '' || this.fieldSearchData.cityOid == undefined ? '' : this.fieldSearchData.cityOid.toString()
          },
          {
            'fieldName': "mallOid",
            'fieldValue': this.fieldSearchData.mallOid == '' || this.fieldSearchData.mallOid == undefined ? '' : this.fieldSearchData.mallOid.toString()
          },
          {
            'fieldName': 'status',
            'fieldValue': 'ONLINE'
          }
        ]
      };
      const SEARCH_KIOSK = 'api/rpa/feedback/kiosk/v1/search';
      this.https.postJson(environment.APIEndpoint + SEARCH_KIOSK, data).subscribe(res => {
        console.log(res);

        this.loadingResponse = false;
        this.totalRecordVal = true;
        this.totalFilterRecordVal = true;
        this.dataSource = new MatTableDataSource(res["items"]);
        // this.dataSourceAll = this.dataSource;
        // console.log(this.dataSourceAll);
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
        this.searchResults = false;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
        this.resultsLength = res['totalCount'];
        // if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength ){
        // this.paginationData.pageIndex = 0;
        //   this.paginator.pageIndex = 0;
        //   this.getKioskList(formdata);
        // }


        // if (this.couponList.length > 0) {
        //   console.log(this.couponList.length);

        //   for (let i of this.dataSource.data) {
        //   if (this.couponList.indexOf(i["couponId"]) > -1) {
        //   this.selection.select(i);
        //   }
        //   }
        //   } else if (this.selectAll) {
        //   for (let i of this.dataSource.data) {
        //   this.selection.select(i);
        //   }
        //   }

        //   }, err => {
        //   console.log(err);
        //   this.loadingResponse = true;
        //   })

        if (this.UserList.length > 0) {
          console.log(this.UserList.length);

          for (let i of this.dataSource.data) {
            if (this.UserList.indexOf(i["deviceId"]) > -1) {
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
        this.searchResults = false;
        this.loadingResponse = true;
      });
    }
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
    this.getKioskList();
  }

  getFeedback() {
    const data = {
      "page": 0,
      "pageSize": 1000,
      'order': {
        'column': 'modifiedTime',
        'dir': 'asc'
      },
      'keySearch': '',
      'fieldSearch': [
        {
          'fieldName': 'kioskType',
          'fieldValue': 'YES'
        }
      ]
    };
    this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/flow/v1/search', data).subscribe(res => {
      this.flows = res['items'];
      console.log(this.flows);
    }, err => {
      console.log(err);
    });
  }

  resetForm() {
    this.buildKioskForm();
    this.getKioskList();
  }

  getAllStores() {

    let GET_ALL_STORES = environment.APIEndpoint + "api/rpa/store/v2/getStoresByMallId";

    http://14.142.204.100:8080/api/rpa/store/v2/getStoresByMallId?brandOids=2,9,1,12,3,10,5,7,4&countryOids=7,1,6,5,4,3,2&cityOids=18,17,20,4,13,6,12,19,5,2,7,8,11,1,10,9,3&mallOids=1,2,3,10,13,8

    this.https.getJson(GET_ALL_STORES + "?brandOids=" + this.fieldSearchData.brandOid.toString() + '&countryOids=' + this.fieldSearchData.countryOid.toString() + '&cityOids=' + this.fieldSearchData.cityOid.toString() + '&mallOids=' + this.fieldSearchData.mallOid.toString())
      .subscribe(res => {
        console.log(res);
        this.storeList = res;
      });

  }




  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  // onCloseClick(): void {
  //   let obj = {
  //     buttonName: "CANCEL"
  //   };

  //   this.dialogRef.close(obj);
  // }

  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      'tableData': this.selection.selected,
      'totalCount': this.resultsLength
    }
    this.dialogRef.close(obj);

  }

  sortData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }

    this.getKioskList();
  }
}