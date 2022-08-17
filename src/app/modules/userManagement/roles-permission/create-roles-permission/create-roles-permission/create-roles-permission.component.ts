import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { HttpService } from '../../../../../services/http-service'
import { environment } from '../../../../../../environments/environment'
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import * as access from '../../../../../constants/menu.constant';
import { Globals } from 'src/app/services/global';

@Component({
  selector: 'app-create-roles-permission',
  templateUrl: './create-roles-permission.component.html',
  styleUrls: ['./create-roles-permission.component.scss']
})
export class CreateRolesPermissionComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'User Management',
    link: ''
  }, {
    title: 'Roles & Permissions',
    link: '/search-user'
  }];
  createRoleFormGroup: FormGroup;
  public toggleVal = true;
  public showErr = false;
  public permissionsList = [];
  public acessList = [];
  checked = true;
  disabled = false;

  constructor(
    private fb: FormBuilder,
    private https: HttpService,
    private router: Router,
    public snackBar: MatSnackBar,
  ) {
    this.buildCreateRoleForm();

  }

  ngOnInit() {
    this.buildCreateRoleForm();
    this.getviewMenus();
    this.getfreshAccessList();
  }

  getviewMenus() {
    let viewUserMenus = environment.APIEndpoint + 'api/rpa/user/v1/menus';
    this.https.getJson(viewUserMenus).subscribe(
      (response) => {
        console.log(response['data'].length);
        this.acessList = response['data'];
        console.log(this.acessList);
      },
      (error)=>{
        console.log(error);
        
      }
    )
  }

  getfreshAccessList() {
    for (let i of this.acessList) {
      i.checked = false;
      if (i.children && i.displayName != 'User Management') {
        for (let j of i.children) {
          j.checked = false;
          if (j.children) {
            for (let k of j.children) {
              k.checked = false
            }
          }
        }
      }
      else {
        i.checked = true
      }
    }
    this.acessList = this.acessList;
  }
  buildCreateRoleForm() {
    const form = {
      role: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9a-zA-Z & ( ) , - . : ? ' _/-]{1,40}$")])],
      roleDescription: ['' , Validators.compose([Validators.pattern(Globals.regCustomwhiteList)])],
      // roleDescription: ['' , Validators.compose([Validators.pattern("^[0-9a-zA-Z & ( ) , - . : ? ' _/-]{1,40}$")])],
    };
    this.createRoleFormGroup = this.fb.group(form);
    console.log()
  }

  public refresh() {

    this.createRoleFormGroup.reset()
  }
  addRole(x, formVal) {
    this.permissionsList = [];
    for (let i of x) {
      for (let j of i.children) {
        if (j.children.length!=0) {
          for (let k of j.children) {
            if (k.checked == true) {
              this.permissionsList.push(i.menuId);
              this.permissionsList.push(j.menuId);
              this.permissionsList.push(k.menuId);
            }
          }
        }else{
          if (j.checked == true) {
          this.permissionsList.push(i.menuId);
          this.permissionsList.push(j.menuId);
        }
        }

      }
    }

  let roleList = []

    for(let i=0;i<this.permissionsList.length;i++){
     if(roleList.indexOf(this.permissionsList[i]) == -1){
           roleList.push(this.permissionsList[i])
        }
    }

    if (this.createRoleFormGroup.valid == true) {
      if (this.permissionsList.length <= 1) {
        this.showErr = true;
        return
      }

      this.showErr = false;
      let data = {
        "roleName": formVal.role,
        "roleDescription": formVal.roleDescription,
        "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
        "permissionIds": roleList
      }

      this.https.postJson(environment.APIEndpoint + 'api/rpa/role/v1/create', data).subscribe(res => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "Roles added successfully"
          }
        });
        this.permissionsList = [];
        this.acessList = [];
        sessionStorage.clear();
        this.router.navigate(['/search-role'])

      },
        err => {
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
    else if (this.createRoleFormGroup.invalid) {
      if (this.permissionsList.length <= 1) {
        this.showErr = true;
        return
      }

    }

  }
}
