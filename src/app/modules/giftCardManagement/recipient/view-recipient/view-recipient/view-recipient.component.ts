import { MatPaginator, MatSort, MatTableDataSource, MatButtonToggleModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { EditRecipientComponent } from '../../edit-recipient/edit-recipient/edit-recipient.component';
import { SnackBarComponent } from '../../../../..//shared/components/snack-bar/snack-bar.component';
import { SearchRecipientComponent } from '../../search-recipient/search-recipient/search-recipient.component';

@Component({
  selector: 'app-view-recipient',
  templateUrl: './view-recipient.component.html',
  styleUrls: ['./view-recipient.component.scss']
})
export class ViewRecipientComponent implements OnInit {
  EMAIL;
  mobileNumber;
  name;
  recipientId;
  RPOID;
  @Input('editViewRecipientId') editViewRecipientId;
  constructor(private formBuilder: FormBuilder, private http: HttpService, 
    private dialogRef: MatDialogRef<MatDialog>,
    private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
   this.RPOID = localStorage.getItem('RPOID');
    this.getData(this.RPOID);
    // console.log(this.editViewRecipientId);
    localStorage.removeItem('RPOID')
    
  }
  onCloseClick() {
    this.dialogRef.close();
  }
  // calling component
  editRecipient() {
    const dialogRef = this.dialog.open(EditRecipientComponent,{panelClass: 'dialogEditReciStyleChange'});
    dialogRef.componentInstance.editRecipientID = this.editViewRecipientId;
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    // const dialogRef = this.dialog.open(EditRecipientComponent,dialogConfig);
  }

  getData(value) {
    let TEMPURL = "https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/get_selected_recipients_user";
    let data = {
      recipientId: value
    }
    return this.http.postCustomizeJson(TEMPURL, data)
      .subscribe((response) => {
        // console.log(response);
        let TempData = response['Output'][0];
        this.EMAIL = TempData['EMAIL'];
        this.recipientId = TempData['empId'];
       this.name = TempData['name'];
        this.mobileNumber = TempData['mobileNumber'];
      });
  }
  deleteRecipient() {
    this.dialogRef.close();
    let TEMPURL = "https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/delete_recipients";

    let data = {
      recipientId: this.RPOID
    }
    return this.http.postCustomizeJson(TEMPURL, data)
    .subscribe((response) => {
      // console.log(response);
      this.router.navigate(["/search-recipient"]);
      location.reload();
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1500,
        data: {
          status: "success",
          message: "User Deleted successfully"
        }
      });
    },
      err => {
        // console.log(err)
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 3000,
          data: {
            status: "failure",
            message: err.error.errorDetails[0].description
          }
        });


      });
    }
}
