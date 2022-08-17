import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-view-img',
  templateUrl: './view-img.component.html',
  styleUrls: ['./view-img.component.scss']
})
export class ViewImgComponent implements OnInit {
  @Input('programBrand') programBrand;
  public kioskID: any;
  public KioskScreenShotImg: any;
  public imgUrl = localStorage.getItem('imgBaseUrl');
  public pageLoader: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    public snackBar: MatSnackBar,
    private https: HttpService) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.kioskID = this.data.kioskId;
    this.getUpdateScreenShotImg();
  }
  getUpdateScreenShotImg() {
    this.pageLoader = true;
    let request = {
      "kioskId": this.kioskID
    }
    let GET_SCREENSHOT_IMG = environment.APIEndpoint + "api/rpa/feedback/kiosk/v1/getKioskImage";
    this.https.postJson(GET_SCREENSHOT_IMG, request).subscribe((response) => {
      console.log(response);
      this.KioskScreenShotImg = response['kioskImage'];
      console.log(this.KioskScreenShotImg);
      this.pageLoader = false;
    },
      err => {
        if (err.status == 400) {
          console.log(err)
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "failure",
              message: err.error.message
            }
          });
          this.pageLoader = false;
          this.onCloseClick();
        } else {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "failure",
              message: "Internal server error"
            }
          });
          this.pageLoader = false;
        }
      })
  }
  onCloseClick(): void {
    this.dialogRef.close(this.KioskScreenShotImg);
  }
}
