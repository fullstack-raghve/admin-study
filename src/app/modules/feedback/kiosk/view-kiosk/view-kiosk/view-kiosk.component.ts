import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import {ViewImgComponent} from '../view-img/view-img.component';
export interface UserData {
  alertId: number,
  isEmail: string,
  isSMS: number,
  alert: string,
  creationTime: string
}
@Component({
  selector: 'app-view-kiosk',
  templateUrl: './view-kiosk.component.html',
  styleUrls: ['./view-kiosk.component.scss']
})
export class ViewKioskComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Feedback',
    link: ''
  }];
  //kiosk alerts table
  public displayedColumns: string[] =
    ['alertId', 'isEmail', 'isSMS', 'alert', 'creationTime'];
  public status = true;
  public dataSource;
  buildFlag = false;
  public searchResults: boolean = false;
  public paginationData;
  public resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  public imgUrl = localStorage.getItem('imgBaseUrl');
  public toggleVal: boolean = true;
  public statusValue: string = 'ONLINE';
  public kioskId;
  public kioskData;
  public checked = false;
  public verificationCode;
  public imgUpload = false;
  public KioskScreenShotImg: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.activatedRoute.params.subscribe((params) => {
      this.kioskId = params.id;
      this.dataSource = new MatTableDataSource();
    });
  }
  ngOnInit() {
    this.getkioskById();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.searchVal();
    // this.getUpdateScreenShotImg();
  }
  getkioskById() {
    const GET_KIOSK_BY_ID = environment.APIEndpoint + 'api/rpa/feedback/kiosk/v1/view';
    const request = {
      kioskId: this.kioskId
    };
    this.http.postJson(GET_KIOSK_BY_ID, request)
      .subscribe((response) => {
        console.log(response);
        this.kioskData = response;
        this.checked = response['status'] === 'ONLINE' ? true : false;
        this.verificationCode = response['verificationCode'];
        this.KioskScreenShotImg = response['kioskImage'];
        console.log(this.verificationCode);
      }
        , err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: 'failure',
              message: 'Your request cannot be saved at this time. Please try again later'
            }
          });
          console.log('error Status = ' + err.status);
        });
  }
  getVerificationCode() {
    const GET_VERIFICATION_CODE = environment.APIEndpoint + 'api/rpa/feedback/kiosk/v1/refreshCode';
    const requestBody = {
      kioskId: this.kioskId
    };
    this.http.postJson(GET_VERIFICATION_CODE, requestBody).subscribe(
      (res) => {
        console.log(res);
        this.verificationCode = res['code'];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // kiosk alerts
  searchVal() {
    // this.updateAlertStatus();
    const data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "oid",
        "dir": "desc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "kioskOid",
          "fieldValue": this.kioskId
        }

      ]
    }

    this.searchResults = true;
    console.log(data);
    const SEARCH_ALERT_BY_KIOSKID = 'api/rpa/feedback/alert/v1/searchByKioskId'
    this.http.postJson(environment.APIEndpoint + SEARCH_ALERT_BY_KIOSKID, data).subscribe(res => {
      this.resultsLength = res["totalCount"];
      this.searchResults = false;
      console.log(this.resultsLength);
      this.dataSource = new MatTableDataSource(res['items']);
      this.dataSource.sort = this.sort;
      this.buildFlag = true;
      if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
        this.paginationData.pageIndex = 0;
        this.paginator.pageIndex = 0;
        this.searchVal();
      }
    }, err => {
      console.log(err);
      this.searchResults = false;
    })
  }
  // updateAlertStatus(){
  //   let UPDATE_ALERT_STATUS = environment.APIEndpoint + 'api/rpa/feedback/alert/v1/updateAlertStatus';
  //   let request = {
  //     feedbackAlertId: this.kioskId
  //   }
  //   this.http.postJson(UPDATE_ALERT_STATUS, request).subscribe(
  //     (res) => {
  //       console.log(res);
  //     }
  //   )
  // }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  viewImgDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      kioskId: this.kioskId
    }
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(ViewImgComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.KioskScreenShotImg = result;
      console.log(this.KioskScreenShotImg);
      
    })
  }
  getUpdateScreenShotImg() {
    let request = {
      "kioskId": this.kioskId
    }
    let GET_SCREENSHOT_IMG = environment.APIEndpoint + "api/rpa/feedback/kiosk/v1/getKioskImage";
    this.http.postJson(GET_SCREENSHOT_IMG, request).subscribe((response) => {
      console.log(response);
      this.KioskScreenShotImg = response['kioskImage'];
    },
      err => {
        if (err.error.errorType == 'VALIDATION') {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "failure",
              message: err.error.errorDetails[0].description
            }
          });
        } else {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "failure",
              message: "Internal server error"
            }
          });
        }
      })
  }

}

