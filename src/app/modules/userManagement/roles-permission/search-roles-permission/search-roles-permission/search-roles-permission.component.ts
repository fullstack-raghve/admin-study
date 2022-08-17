import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { HttpService } from '../../../../../services/http-service'
import { environment } from '../../../../../../environments/environment'
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface UserData {
  roleId: number;
  roleName: string;
  modifiedTime: string;
  createdTime: string;
  status: string;
}

@Component({
  selector: 'app-search-roles-permission',
  templateUrl: './search-roles-permission.component.html',
  styleUrls: ['./search-roles-permission.component.scss']
})

export class SearchRolesPermissionComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'User Management',
    link: ''
  }, {
    title: 'Roles & Permissions'
  }];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  displayedColumns: string[] = ['roleId', 'roleName', 'modifiedTime', 'createdTime', 'status'];
  dataSource: MatTableDataSource<any>;
  public paginationData;
  public resultsLength = 0;
  public roleId;
  public roleStatus;
  public keySearch = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private https: HttpService,
    private router: Router,
    public snackBar: MatSnackBar, ) {
    this.dataSource = new MatTableDataSource();
  }
  status = true;
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
   
    if(sessionStorage.getItem('CheckType')=='Amenities')
    {
          if (sessionStorage.searchValue) {
      this.keySearch = (sessionStorage.getItem('searchValue'));
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
      this.getSearchData();
      this.paginator.pageIndex = obj.pageIndex;
    } else {
      this.getSearchData();
    }
  }else{
      sessionStorage.clear();
      this.getSearchData();
      sessionStorage.setItem('CheckType','Amenities');
    }
  }
  openFilter() {
    this.status = !this.status;
  }


  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.getSearchData();
  }

  reset() {
    this.noRecords = false;
    this.roleId = '';
    this.roleStatus = ''
    // this.getSearchData();

    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
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
  getSearchData() {
    this.searchStoreVal = true;
    sessionStorage.setItem('searchValue', this.keySearch);
    let data = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": this.keySearch,
      "fieldSearch": [
        {
          "fieldName": 'oid',
          "fieldValue": this.roleId
        },
        {
          "fieldName": "status",
          "fieldValue": this.roleStatus
        }
      ]

    }
    this.https.postJson(environment.APIEndpoint + "api/rpa/role/v1/search", data).subscribe(res => {
      this.searchStoreVal = false;
      this.dataSource.data = res["items"];
      this.resultsLength = res["totalCount"];
      this.resultsLength = res["totalCount"];
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
      this.searchStoreVal = true;

    })
  }
 
  MoveToView(ID){
  localStorage.setItem('RPViewID',ID);
    this.router.navigate(['/view-role']);
  }
}
