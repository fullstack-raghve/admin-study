import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../../services/http-service'
import { environment } from '../../../../../../environments/environment'
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import * as access from '../../../../../constants/menu.constant';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-roles-permission',
  templateUrl: './view-roles-permission.component.html',
  styleUrls: ['./view-roles-permission.component.scss']
})
export class ViewRolesPermissionComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'User Management',
      link: ''
    }, {
      title: 'Roles & Permissions',
      link: '/search-user'
    }];
  public href;
  // public acessList=access.permissions.data;
  public acessList;
  public toggleVal;
  public permissionList=[];
  public viewRoleDatafromserv;
  public disabled :boolean=true;
  public checked=false;


  constructor(
    private fb: FormBuilder,
    private https: HttpService,
    private router: Router,
    public snackBar: MatSnackBar,
  ) { 
    this.getviewMenus();
  }

  ngOnInit() {
    let data = localStorage.getItem('RPViewID');
    if(data){
      this.href = data
      this.getViewData();
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-role']);
    }
       
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
  //public navigationArray="[117,108,37,120,30,22,89,74,76,132,20,66,87,82,6,4,99,79,35,72,90,107,34,95,133,57,91,104,111,129,73,98,122,48,112,75,14,67,71,88,121,81,103,2,15,18,106,113,36,28,100,84,39,127,56,116,11,54,123,97,10,25,26,12,21,38,52,125,134,17,101,9,51,128,7,102,80,78,5,47,96,53,110,40,130,32,49,85,118,29,27,1,16,68,58,33,59,55,8,61,50,13,126,131,19,114,70,119,60,86,3,93,83,109,105,124,94,69,92,23,31]";
  getViewData() {
    // this.href = this.router.url.split('view-role/')[1];
    let data = {
      "roleId": this.href
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/role/v1/view', data).subscribe(res => {
     this.viewRoleDatafromserv = res;
      this.permissionList= res["permissions"];
      this.toggleVal = res["status"] == "ONLINE" ? true : false
    }, err => {
      console.log(err);
    })
  }

  MoveToEdit(ID){
    localStorage.setItem('RPEditID',ID);
    this.router.navigate(['/edit-role']);  }

}
