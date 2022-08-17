import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { HttpService } from '../../../../services/http-service'
import { environment } from '../../../../../environments/environment'
import { MatPaginator, MatSort, MatTableDataSource, MatSlideToggleModule } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Globals } from 'src/app/services/global';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';

export interface StoreData {
  storeId: string;
  storeName: string;
  address: string;
  storeOid: number;
}

export interface Role {
  roleId: string;
  roleName: string;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  checked = true;
  disabled = false;
  selectedStorearray;
  displayedColumns: string[] = ['storeId', 'storeName', 'address'];
  public breadCrumbData: Array<Object> = [{
    title: 'User Management',
    link: '/search-user'
  }];
  dataSource: MatTableDataSource<StoreData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  addUserFormGroup: FormGroup;
  public roleId
  public role_name: any;
  public toggleVal = true;
  public totalCount: [];
  public selectedStore = [];
  public selectedCount;
  public storeRequired = false;
  public storePopUpDisable = false;
  public storeCount = false;
  public storeErrorMsg;

  public roleList;
  Roles: Role[] = [];
  roleCtrl = new FormControl();
  filteredRoles: Observable<Role[]>;

  valmobile;
  
  constructor(
    private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private http: HttpService) {
    console.log(Globals.regCommValWhiteListed);
    console.log(Globals.regEmailVal);
    this.buildAddUserForm();
    // tslint:disable-next-line:prefer-const
    this.dataSource = new MatTableDataSource();

  }

  public refresh() {
    this.addUserFormGroup.reset()
  }

  public buildAddUserForm() {
    const form = {
      // role: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(Globals.regAlbhanumericVal)])],
      middleName: ['', Validators.compose([Validators.pattern("^[0-9a-zA-Z & ( ) , - \"\'. @ # * : ? ' _/-]{1,40}$")])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(Globals.regCommValWhiteListed)])],
      employeeId: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9a-zA-Z"&,.: \"\'? _% -]{1,40}$')])],
      emailId: ['', Validators.compose([Validators.minLength(7), Validators.pattern(Globals.regEmailVal)])],
      userName: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z & ( )\"\' , - . : ?  _/-]{1,40}$')])],
      phoneNumber: ['', Validators.compose([Validators.maxLength(15), Validators.minLength(10), Validators.pattern(Globals.regMobileVal)])],
      accessType: ['', Validators.compose([Validators.required])],
    };

    this.addUserFormGroup = this.fb.group(form);
  }
  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;

    let data = {
      "order": {
        "column": "storeId",
        "dir": "asc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "mall.city.country.oid",
          "fieldValue": "",
        },
        {
          "fieldName": "mall.city.oid",
          "fieldValue": "",
        }
      ]
    }

    this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
      console.log(res);

      this.totalCount = res['totalCount'];
      // this.selectedCount = res["totalCount"];
      console.log(this.totalCount);
    });
    this.getRoles();
  }

  openDialog() {
    const dialogRef = this.dialog.open(selectStoreDialog);
    dialogRef.componentInstance.storeList = this.selectedStore;
    dialogRef.componentInstance.totalCount = this.totalCount;
    // dialogRef.componentInstance.brandOid = this.brandOid;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.buttonName === 'SELECT') {
          this.selectedStore = [];
          this.selectedCount = result.tableData.length;
          this.dataSource.data = result.tableData ? result.tableData : '';
          this.totalCount = result.totalCount;
          console.log(this.selectedCount);
          if (this.selectedCount != 0) {
            for (let i = 0; i < result.tableData.length; i++) {
              let storeId = result.tableData[i].storeOid;
              this.selectedStore.push(parseInt(storeId));
              console.log(result.tableData);
              console.log(result.tableData.length);
              const arrrayTemp = this.selectedStore;
              this.selectedStore = Array.from(new Set(arrrayTemp));
              console.log(this.selectedStore.length);

              this.selectedStore = this.selectedStore.filter(function (element) {
                return element !== undefined;
              });
            }
            if (this.selectedStore.length != 0) {
              this.storeRequired = false;
              this.storeErrorMsg = "Please select Store";
            }
          } else {
            // this.storeErrorMsg = "Please select Store";
          }
        }
      }
    );
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
            console.log(this.roleList);
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

getAllRole(role){
  this.roleId = role.roleId;
  this.role_name = role.roleName;
  console.log(this.roleId);
  console.log(this.role_name);
  
}

  validateAccessType(formData) {
    if (formData.accessType == 'FULL_ACCESS') {
      this.storeCount = false;
      this.storePopUpDisable = true;
      this.dataSource.data = [];
    }else{
      this.storePopUpDisable = false;
      this.storeCount = true;
    }
  }

  createUser(formData) {
    console.log(formData);
    let required = false;
    if (formData.accessType == 'RESTRICTED_ACCESS' && this.selectedStore.length == 0) {
      this.storeRequired = true;
      this.storeErrorMsg = "Please select Store";
      required = true;
    } else {
      this.storeRequired = false;
      this.storeErrorMsg = "";
      required = false;
    }
    if (this.addUserFormGroup.invalid || required) {
      return false;
    }
    let selectedStorearray = this.dataSource.data.map(a => a.storeOid)
    let userData = {
      "userName": formData.userName,
      "firstName": formData.firstName,
      "middleName": formData.middleName,
      "lastName": formData.lastName,
      "phoneNumber": formData.phoneNumber,
      "roleId": this.roleId,
      "roleName": this.role_name,
      "emailId": formData.emailId,
      "employeeId": formData.employeeId,
      "title": formData.title,
      "accessType": formData.accessType,
      "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
      "storeIds": selectedStorearray
    }

    this.https.postJson(environment.APIEndpoint + 'api/rpa/user/save', userData).subscribe(response => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1500,
        data: {
          status: "success",
          message: "User added successfully"
        }
      });
      sessionStorage.clear();
      this.router.navigate(['/search-user'])
    }, err => {
      if (err.status == 0) {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message: "token expired , please submit the form again"
          }
        });
      }
      for (let i of err.error.errorDetails) {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message: i.description
          }
        });

      }

    })
  }
}
