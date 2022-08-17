import {  OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { HttpService } from '../../../../../services/http-service'
import { environment } from '../../../../../../environments/environment'
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import * as access from '../../../../../constants/menu.constant';
import { Router } from '@angular/router';
import { FormsModule }   from '@angular/forms';


@Component({
  selector: 'app-edit-roles-permission',
  templateUrl: './edit-roles-permission.component.html',
  styleUrls: ['./edit-roles-permission.component.scss']
})
export class EditRolesPermissionComponent implements OnInit {
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
    public breadCrumbData: Array<Object> = [{
      title: 'User Management',
      link: ''
    }, {
      title: 'Roles & Permissions',
      link: '/search-user'
    }];
  editRoleFormGroup: FormGroup;
  public href;
  public emptyPermissionsArray;
  // public acessList=access.permissions.data;
  public acessList;
  public toggleVal;
  public editRoleData;
  public permissionList=[];
  public permissionsList = [];
  public viewRoleDatafromserv;
  checked = true;
  disabled = false;

  constructor(private fb: FormBuilder,
    private https: HttpService,
    private router: Router,
    public snackBar: MatSnackBar,) {
    this.getviewMenus()
    this.buildEditRoleForm();
  }
  buildEditRoleForm() {
    const form = {
      role: ['', Validators.compose([Validators.required,Validators.maxLength(50),Validators.minLength(4)])],
      roleDescription: ['',Validators.compose([Validators.maxLength(250),Validators.minLength(4)])],
    };
    this.editRoleFormGroup = this.fb.group(form);
  }
  ngOnInit() {
    let data = localStorage.getItem('RPEditID');
    if(data){
      this.href=data;
      // this.getViewData();
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-role'])

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
  getViewData() {
    // this.href = this.router.url.split('edit-role/')[1];
    let data = {
      "roleId": this.href
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/role/v1/view', data).subscribe(res => {
     this.viewRoleDatafromserv = res;
      this.permissionList= res["permissions"];
      for (let i of this.acessList){
        for (let j of i.children) {
            if(this.permissionList.indexOf(j.menuId) != -1 ){
              j.checked=true;
            }else{
              j.checked=false;
            }
            if (j.children) {
              for (let k of j.children) {
                if (this.permissionList.indexOf(k.menuId) != -1 ) {
                  k.checked=true;
                }else {
                  k.checked=false;
                }
              }
            }
        }
      }
      this.populatedata();
      this.toggleVal = res["status"] == "ONLINE" ? true : false
    }, err => {
      console.log(err);
    })
  }

  populatedata() {

    this.editRoleFormGroup.patchValue({
        role : this.viewRoleDatafromserv.roleName,
        roleDescription : this.viewRoleDatafromserv.roleDescription
    })

  }

  addRole(x, formVal) {
    this.permissionsList = [];
    for (let i of x ) {
      for (let j of i.children) {
        if (j.children.length!=0) {
          for (let k of j.children) {
            if (k.checked == true) {
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

    if (this.editRoleFormGroup.valid == true) {
      let data = {
        "roleId":this.viewRoleDatafromserv.roleId,
        "roleName": formVal.role,
        "roleDescription": formVal.roleDescription,
        "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
        "permissionIds": roleList
      }

      this.https.postJson(environment.APIEndpoint + 'api/rpa/role/v1/update', data).subscribe(res => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "Roles updated successfully"
          }
        });
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
  }


}
