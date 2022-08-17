import { OnInit, ViewChild, Component, Inject, Input } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from "@angular/forms";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA ,
  MatSnackBar
} from "@angular/material";
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { BehaviorSubject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-generate-qr-code',
  templateUrl: './generate-qr-code.component.html',
  styleUrls: ['./generate-qr-code.component.scss']
})
export class GenerateQrCodeComponent implements OnInit {
  
  elementType: 'url' | 'canvas' | 'img' = 'url';
  // value: string = 'facebook.com sdfs fasfsdfsdf';
  public scanId: any;
  public pageLoader: boolean = false;
  
  constructor(private dialogRef: MatDialogRef<GenerateQrCodeComponent>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public http:HttpService,
    public snackBar:MatSnackBar) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getEncryptedScanId();
  }
  public getEncryptedScanId(){
    this.pageLoader = true;
    let GET_SCANID = environment.APIEndpoint + 'api/rpa/feedback/kiosk/v1/getEncryptedScanId';
    this.http.getJson(GET_SCANID).subscribe(
      (response)=>{
        this.scanId = response['scanId'];
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
          this.onCloseClick();
        }
      })
  }
  onCloseClick(): void {
    this.closePopUp();
  }
  public closePopUp(){
    this.dialogRef.close(this.scanId);
  }
}
