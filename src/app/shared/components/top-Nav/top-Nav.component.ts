import { Component, OnInit } from '@angular/core';
import { NavService } from '../../../services/navService';
import { Router } from '@angular/router';
import { loginServcie } from '../../../services/LoginServcie';
import { environment } from '../../../../environments/environment'
import { HttpService } from '../../../services/http-service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-Nav.component.html',
  styleUrls: ['./top-Nav.component.scss']
})
export class TopNavComponent implements OnInit {
  public logout = 'Logout';
  public showDropdown: boolean = false;
  public fullName;
  constructor(public navService: NavService,
    private router: Router,
    private https: HttpService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getNavigationArray();
  }

  public showlogout() {
    this.showDropdown = !this.showDropdown;
  }

  // public appLogout() {
  //   localStorage.clear();
  //   localStorage.clear();
  //   this.snackBar.openFromComponent(SnackBarComponent, {
  //     duration: 2500,
  //     data: {
  //       status: "logout",
  //       message: "You have successfully logged out"
  //     }
  //   });
  //   this.router.navigate(['/login']);
  // }


  public appLogout() {
    const userData = JSON.parse(localStorage.getItem("userpermissions"));
    if (userData && userData.access_token != null && userData.access_token != '') {
      let req = {}
      let NAVIGATION = environment.APIEndpoint + "api/rpa/user/v1/logout";
      this.https.postJson(NAVIGATION, req).subscribe(
        (res) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 2500,
            data: {
              status: "logout",
              message: "You have successfully logged out"
            }
          });
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      )
    }
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  public getNavigationArray() {
    let req = [];
    let NAVIGATION = environment.APIEndpoint + "api/rpa/user/menu/list";
    this.https.postJson(NAVIGATION, req)
      .subscribe((response) => {
        localStorage.setItem("navigationArray", response["menuIds"].sort());
        localStorage.setItem("imgBaseUrl", response["imgBaseUrl"]);
        localStorage.setItem("fileBaseUrl", response["fileBaseUrl"]);
        localStorage.setItem("fullName", response["fullName"]);
        localStorage.setItem("userId", response["userId"]);
        this.fullName = localStorage.getItem("fullName")
      }), (err) => {
       
        if (err.status == 0) {
          this.getNavigationArray();
        }
      }
  }
}
