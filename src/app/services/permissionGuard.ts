import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as path from '../constants/permission.constant'
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';


@Injectable({
    providedIn: 'root'
})
export class permissionGuard implements CanActivate {

    constructor(private router: Router ,public snackBar: MatSnackBar) { }
    public menuList;
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      this.menuList=path.Routes.path;
      let Activestate = this.menuList.filter((e)=>{
          if(e.path.split('/')[0]==state.url.split('/')[1]){
              return e.permissionId
          }
      })
      const permissionArr = localStorage.getItem('navigationArray').split(',');
      if (permissionArr.indexOf(Activestate[0].permissionId.toString()) != -1){
        return true;
      }

      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1500,
        data: {
          status: "failure",
          message: "Access denied"
        }
      });
      return false;
    }
}
