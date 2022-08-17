import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from '../../../../services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { ResetPinComponent } from '../reset-pin/reset-pin.component';

export interface UserData {
  userId: number;
  fullName: string;
  role: string;
  phoneNumber: string;
  emailId: string;
  createdTime: string;
  status: string;
  resetPin:string;
}

export interface Role {
  roleId: string;
  roleName: string;
}

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})

export class SearchUserComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'User Management',
    link: ''
  }];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  displayedColumns: string[] = ['userId', 'fullName', 'roles', 'phoneNumber', 'emailId', 'createdTime', 'status','resetPin'];
  //displayedColumns: string[] = ['userId', 'fullName', 'roles', 'phoneNumber', 'emailId', 'createdTime', 'status'];
  public searchUserForm: FormGroup;
  public paginationData;
  public resultsLength = 0;
  public roleId;
  public status = true;
  public checked: boolean = true;
  dataSource: MatTableDataSource<any>;
  public totalCount: [];
  public storeValList: [];
  public stores: [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  public success: boolean = false;
  public resetErrorSend: any;
  // public roleId;
  public roleList;
  Roles: Role[] = [];
  roleCtrl = new FormControl();
  filteredRoles: Observable<Role[]>;

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  error: boolean;
  unverifiedEmail: any;
  resetSuccessSend: string;
  constructor(private fb: FormBuilder,private router: Router,public dialog: MatDialog, 
    private https: HttpService,private http: HttpClient) {
    this.dataSource = new MatTableDataSource();
    let data = {
      "order": {
        "column": "storeId",
        "dir": "asc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "mall.city.oid",
          "fieldValue": "",
        },
        {
          "fieldName": "mall.city.country.oid",
          "fieldValue": "",
        },
      ]
    }

    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
      this.totalCount = res["totalCount"];
      this.storeValList = res['items'];
      console.log(this.storeValList);
      console.log(this.storeValList.length);

      for (let i = 0; i < this.storeValList.length; i++) {
        this.stores = this.storeValList[i];
      }

      // this.dataSource.data = res["items"];
      // console.log(this.dataSource.data);
    });

  }

  // storeSearch(){
  //   this.filteredOptions = this.myControl.valueChanges
  //   .pipe(
  //     startWith(''),
  //     map(value => this._filter(value))
  //   );
  // }
  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.searchUserForm = this.fb.group({
      fullName: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(3)])],
      emailId: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(6), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      phoneNumber: ["", [Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]+$")]],
      // roles: [""],
      storeName: [""],
      status: [""],
      searchVal: [""]
    }); 
    this.getRoles();
    // this.searchVal();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.dataSource = new MatTableDataSource();
    this.filterData();

    if(sessionStorage.getItem('CheckType')=='Users')
    {
          if (sessionStorage.searchValue) {
      this.searchUserForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType','Users');
    }

  }
  openFilter() {
    this.status = !this.status;

  }
 

  selectRow(row) {
    console.log(row.target.value);
  }

  // getRoles() {
  //   this.https.getJson(environment.APIEndpoint + "api/rpa/role/v1/get/roles").subscribe(res => {
  //     console.log(res);
  //     this.roleId = res;
  //   }, err => {
  //     console.log(err)
  //   })
  // }
  getRoles() {
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/role/v1/get/roles";
    this.https.getJson(GET_ALL_CITIES)
        .subscribe((response) => {
            // console.log(response);
            this.roleList = response;

            for (let i = 0; i <= this.roleList.length - 1; i++) {
                let objMallkey = {
                    roleId: this.roleList[i]['roleId'],
                    roleName: this.roleList[i]['roleName'],
                }
                console.log(objMallkey);
                this.Roles.push(objMallkey);
            }
            this.filteredRoles = this.roleCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(role => role ? this._filterRoles(role) : this.Roles.slice())
                );
        },
            (error) => {
                console.log(error);
            });
}
private _filterRoles(value: string): Role[] {
    const filterValue = value.toLowerCase();
    return this.Roles.filter(role => role.roleName.toLowerCase().indexOf(filterValue) === 0);
}

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
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

  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


  myTrim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
  }

  searchKey(){
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }

  getRole(roleId){
    this.roleId = roleId;
    console.log(this.roleId);
  }

  searchVal() {
    this.searchStoreVal = true;
    let formdata = this.searchUserForm.value;
    
    sessionStorage.setItem('searchValue', formdata.searchVal);
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortColumn,
        "dir": this.sortDirection
      },
      "keySearch": formdata.searchVal,
      "fieldSearch": [
        {
          "fieldName": "fullName",
          "fieldValue": formdata.fullName,
        },
        {
          "fieldName": "emailId",
          "fieldValue": formdata.emailId,
        },
        {
          "fieldName": "phoneNumber",
          "fieldValue": formdata.phoneNumber
        },
        {
          "fieldName": "role.oid",
          "fieldValue": this.roleId != undefined ? this.roleId : ""
        },
        // {
        //   "fieldName": "roles",
        //   "fieldValue": formdata.roles
        // },
        {
          "fieldName": "StoreName",
          "fieldValue": formdata.storeName
        },
        {
          "fieldName": "status",
          "fieldValue": formdata.status
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/user/search', data).subscribe(res => {
      this.searchStoreVal = false;
      console.log(res);
      this.dataSource.data = res["items"];
      this.resultsLength = res["totalCount"];
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      // if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
      //   this.paginationData.pageIndex = 0;
      //   this.paginator.pageIndex = 0;
      //   this.searchVal();
      // }
    }, err => {
      this.searchStoreVal = true;
      console.log(err);
      // if (err.status == 0) {
      //   this.searchVal();
      // }
    })

  }

  resetForm() {
    this.noRecords = false;
    // this.searchUserForm.reset();
    this.roleCtrl.reset('');
    this.roleId = '';
    this.searchUserForm.reset();
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.searchVal();
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;

  }


  filterData() {
    this.filteredOptions = this.searchUserForm.get('storeName').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.stores.filter(store => this.storeValList[''].option.toLowerCase().includes(filterValue));
  }

  resetPin(userEmail,userName) {
    let emailId = {
      // "emailId": userEmail,
      "userId": userName
    }
    // this.showSpinner=true;
    let url = environment.APIEndpoint + "api/rpa/user/v2/forgot/password"
    if (this.searchUserForm.valid) {
      let userData = JSON.parse(localStorage.getItem("userpermissions"));
      let httpOptions = new HttpHeaders({
          'Authorization': userData.token_type +" "+ userData.access_token,
          'Content-Type': 'application/json',
          'Accept-Language': 'en'
      }); 
      this.http.post(url,emailId, { headers: httpOptions }).subscribe(res => {
        this.success=true;
        if(this.success = true){
          this.openResetPinDialog();        }
        // this.showSpinner=false;
        //  this.roleId=res;
       
      }, err => {
        console.log(err.error.errorDetails);
        this.resetErrorSend = err.error.errorDetails;
        if (err.status == 400) {
          // this.showSpinner=false;
          console.log(err)
          this.error = true;
          this.unverifiedEmail = err.error.errorDetails[0].description;
          this.openResetPinDialog();
        }
      })
    }
  }

  openResetPinDialog() {
    console.log(this.resetErrorSend);
    const dialogRef = this.dialog.open(ResetPinComponent);
    dialogRef.componentInstance.resetPinErrorMessage = this.resetErrorSend;
    // dialogRef.componentInstance.resetPinSuccessMessage = this.resetSuccessSend;

  }

  MoveToView(ID){
    localStorage.setItem('UserViewID',ID);
    this.router.navigate(['/view-user']);
  }

  getRoleId(val){
    console.log(val);
    this.roleId = val;
  }
}
