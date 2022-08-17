import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../environments/environment';
import { HttpService } from '../../../../services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { addStoreDialog } from '../../../../shared/components/add-store-dialog/add-store.component';
import * as access from '../../../../constants/menu.constant';
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
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
  public breadCrumbData: Array<Object> = [{
    title: 'User Management',
    link: '/search-user'
  }];

  displayedColumns: string[] = ['storeId', 'storeName', 'address'];
  dataSource: MatTableDataSource<StoreData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  editUserFormGroup: FormGroup;
  public roleId;
  public role_name: any;
  public href;
  public editUserData;
  // public totalCount;
  public toggleVal: boolean;
  public checked: boolean = true;
  public permissionList;
  public selectedStorearray;
  // public acessList = access.permissions.data;
  public acessList;
  public storeCount = false;

  public totalCount: [];
  public selectedStore = [];
  public selectedCount;
  public storeRequired = false;
  public storePopUpDisable = false;
  public storeErrorMsg;
  public roleList;
  Roles: Role[] = [];
  roleCtrl = new FormControl();
  filteredRoles: Observable<Role[]>;
  prePopulateRoleId: any;
  
  constructor(private fb: FormBuilder,
    private router: Router,
    private https: HttpService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public route: ActivatedRoute,
    private http: HttpService) {
    this.getviewMenus();
    this.buildEditUserForm();
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
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit() {
    // this.getviewMenus();
    let data = localStorage.getItem('UserEditID');
    // this.getProgramDetails();
    if (data) {
      this.href = data;
      console.log(this.href);
      
      // this.acessList = access.permissions.data;
      // console.log(this.acessList);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // this.getRoles();
      localStorage.removeItem('UserEditID');
    } else {
      sessionStorage.clear();
      this.router.navigate(['/search-user']);
    }
  }
  getviewMenus() {
    let viewUserMenus = environment.APIEndpoint + 'api/rpa/user/v1/menus';
    this.https.getJson(viewUserMenus).subscribe(
      (response) => {
        console.log(response['data'].length);
        this.acessList = response['data'];
        console.log(this.acessList);
      this.getViewData();
        
      },
      (error)=>{
        console.log(error);
        
      }
    )
  }
  // openDialog() {
  //   const dialogRef = this.dialog.open(addStoreDialog);

  //   dialogRef.afterClosed().subscribe(result => {
  //      this.dataSource.data=result.tableData;
  //      this.totalCount=result.totalCount;
  //   });
  // }
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
  populatedata() {
    this.editUserFormGroup.patchValue({
      // role: this.editUserData.roleName,
      title: this.editUserData.title,
      firstName: this.editUserData.firstName,
      middleName: this.editUserData.middleName,
      lastName: this.editUserData.lastName,
      employeeId: this.editUserData.employeeId,
      emailId: this.editUserData.emailId,
      userName: this.editUserData.userName,
      phoneNumber: this.editUserData.phoneNumber,
      accessType: this.editUserData.accessType
    })
    this.validateAccessType(this.editUserFormGroup.value);
  }
  getViewData() {
    // this.route.params
    //   .subscribe(
    //     (params: Params) => {
    //       this.href = params['id']
    //     }
    //   );
    let data = {
      "userId": this.href
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/user/view', data).subscribe(res => {
      this.editUserData = res;
      console.log(this.editUserData);
      this.dataSource.data = res["userStores"] == null ? '' : res["userStores"];
      this.toggleVal = res["status"] == "ONLINE" ? true : false;
      this.permissionList = res["menuIds"];
      console.log(this.permissionList);
      this.prePopulateRoleId = this.editUserData.roleId;
      console.log(this.prePopulateRoleId);
      this.getRoles(this.prePopulateRoleId);

     
      // this.getviewMenus();

      if (null != res["userStores"] && res["userStores"].length > 0) {
        this.selectedStore = res["userStores"].map(oid => oid.storeId)
      }
      console.log(this.editUserData);
      if (this.permissionList) {
        console.log(this.acessList);
        
        if(this.acessList!=undefined){
          for (let i of this.acessList) {
            console.log(this.acessList);
            
            for (let j of i.children) {
              if (this.permissionList.indexOf(j.menuId) != -1) {
                j.checked = true;
              } else {
                j.checked = false;
              }
              if (j.children) {
                for (let k of j.children) {
                  if (this.permissionList.indexOf(k.menuId) != -1) {
                    k.checked = true;
                  } else {
                    k.checked = false;
                  }
                }
              }
            }
          }
        }
      }
      this.buildEditUserForm();
      this.populatedata();
    }, err => {
      console.log(err);
      if (err.status == 0) {
        this.getViewData();
      }
    })
  }

  public setPermissions(value: any) {
    // let selectedRoleId = this.roleId.find(obj => {
    //   return obj.roleName == value
    // });

    let roleData = {
      "roleId": this.roleId,
    }

    this.https.postJson(environment.APIEndpoint + "api/rpa/role/v1/view", roleData).subscribe(res => {
      let rolePermissionList = res["permissions"];

      for (let i of this.acessList) {
        console.log(this.acessList);
        
        for (let j of i.children) {
          if (rolePermissionList.indexOf(j.menuId) != -1) {
            j.checked = true;
          } else {
            j.checked = false;
          }
          if (j.children) {
            for (let k of j.children) {
              if (rolePermissionList.indexOf(k.menuId) != -1) {
                k.checked = true;
              } else {
                k.checked = false;
              }
            }
          }
        }
      }

    }, err => {
      console.log(err)
    });
  }
  // getRoles() {
  //   this.https.getJson(environment.APIEndpoint + "api/rpa/role/v1/get/roles").subscribe(res => {
  //     console.log(res);
  //     this.roleId = res;
  //   }, err => {
  //     console.log(err)
  //     if (err.status == 0) {
  //       this.getRoles();
  //     }
  //   })
  // }

  getRoles(prePopulateRoleId) {
    // this.prePopulateRoleId = prePopulateRoleId;
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
        for (let j = 0; j < this.Roles.length; j++) {
          if (this.Roles[j].roleId == this.prePopulateRoleId) {
            this.roleCtrl.setValue(this.Roles[j].roleName);
          }
        }

      },
        (error) => {
          console.log(error);
        });
  }
  private _filterRoles(value: string): Role[] {
    const filterValue = value.toLowerCase();
    return this.Roles.filter(role => role.roleName.toLowerCase().indexOf(filterValue) === 0);
  }

  getAllRole(role) {
    this.prePopulateRoleId = role.roleId;
    this.role_name = role.roleName;
    console.log(this.roleId);
  }

  public editData(x, formData) {
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
    if (this.editUserFormGroup.invalid || required) {
      return false;
    }
    // let selectedRoleId = this.roleId.find(obj => {
    //   return obj.roleName == formData.role
    // })
    // let selectedStorearray = this.dataSource.data.map(a => a.storeOid)
    if (this.selectedStore.length > 0){
      this.selectedStorearray = this.dataSource.data.map(a => a.storeOid);
      console.log(this.selectedStorearray);
      }else{
      this.selectedStorearray = [];
      }
    this.permissionList = [];

    for (let i of x) {
      for (let j of i.children) {
        if (j.children.length != 0) {
          for (let k of j.children) {
            if (k.checked == true) {
              this.permissionList.push(i.menuId);
              this.permissionList.push(j.menuId);
              this.permissionList.push(k.menuId);
            }
          }
        } else {
          if (j.checked == true) {
            this.permissionList.push(i.menuId);
            this.permissionList.push(j.menuId);
          }
        }

      }
    }

    let roleList = []

    for (let i = 0; i < this.permissionList.length; i++) {
      if (roleList.indexOf(this.permissionList[i]) == -1) {
        roleList.push(this.permissionList[i])
      }
    }

    let updatedData = {
      "userId": this.editUserData.userId,
      "userName": formData.userName,
      "firstName": formData.firstName,
      "lastName": formData.lastName,
      "middleName": formData.middleName,
      "phoneNumber": formData.phoneNumber,
      "roleId": this.prePopulateRoleId,
      "roleName": this.role_name,
      "emailId": formData.emailId,
      "employeeId": formData.employeeId,
      "title": formData.title,
      "accessType": formData.accessType,
      "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
      "menuIds": roleList,
      "storeIds": this.selectedStorearray,
    }
    console.log(updatedData);
    this.https.postJson(environment.APIEndpoint + "api/rpa/user/update", updatedData).subscribe(response => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1500,
        data: {
          status: "success",
          message: "User updated successfully"
        }
      });
      sessionStorage.clear();
      this.router.navigate(['/search-user'])
    }, err => {

      if (err.error.errorType == 'VALIDATION') {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message: err.error.errorDetails[0].description
          }
        });
      } else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message: "Your request cannot be saved at this time. Please try again later"
          }
        });
      }
    })

  }
  public buildEditUserForm() {
    const form = {
      // role: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z & ( ) , - . : ? _""/-]{1,40}$')])],
      middleName: ['', Validators.compose([Validators.pattern('^[0-9a-zA-Z & ( ) , - . : ? _""/-]{1,40}$')])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z & ( ) , - . : ? _""/-]{1,40}$')])],
      employeeId: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9a-zA-Z"&,.: ? _% -]{1,40}$')])],
      emailId: ['', Validators.compose([Validators.minLength(7), Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
      userName: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z & ( ) , - . : ? _""/-]{1,40}$')])],
      phoneNumber: ['', [Validators.maxLength(15), Validators.minLength(10), Validators.pattern("^[0-9]+$")]],
      accessType: ['', Validators.compose([Validators.required])],
    };
    this.editUserFormGroup = this.fb.group(form);
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
}