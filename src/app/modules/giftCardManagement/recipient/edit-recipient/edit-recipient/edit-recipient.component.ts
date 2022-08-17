
import { MatPaginator, MatSort, MatTableDataSource, MatButtonToggleModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';
@Component({
  selector: 'app-edit-recipient',
  templateUrl: './edit-recipient.component.html',
  styleUrls: ['./edit-recipient.component.scss']
})
export class EditRecipientComponent implements OnInit {
  public viewData = [];
  viewEditData = [];
  updateData = [];
  editRecipientForm: FormGroup;
  public buildFlag: boolean = false;
  @Input('editRecipientID') editRecipientID;
  constructor(private formBuilder: FormBuilder, private https: HttpService, private http: HttpService,
    private dialogRef: MatDialogRef<MatDialog>,
    private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.buildAddRecipientForm(this.viewData);
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getViewData();
    console.log(this.editRecipientID);
  }

  getViewData() {
    console.log();
    let data = {
      "recipientId": this.editRecipientID
    }
    this.https.postJson1('https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/get_selected_recipients_user', data).subscribe(res => {
      console.log(res);
      this.viewData = res['Output'];
      this.buildAddRecipientForm(this.viewData);
    });
  }

  public buildAddRecipientForm(editData) {
    console.log(editData);
    if (editData == undefined) {
      let form = {
        Id: " ",
        name: " ",
        mobileNumber: " ",
        EMAIL: " ",
      }
      this.editRecipientForm = this.fb.group(form);
    }
    else {
      this.buildFlag = true;
      console.log(editData);
      for (let i = 0; i < editData.length; i++) {
        this.viewEditData = editData[i]
        console.log(this.viewEditData);

      }
      this.editRecipientForm = this.fb.group({
        Id: [this.viewEditData['empId'], Validators.compose([Validators.required, Validators.maxLength(8), Validators.pattern("^[a-zA-Z0-9]+$")])],
        name: [this.viewEditData['name'], Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]*$")])],
        mobileNumber: this.viewEditData['mobileNumber'],
        EMAIL: [this.viewEditData['EMAIL'], Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(50), Validators.pattern(Globals.regEmailVal)])],
        recipientId: this.viewEditData['recipientId'],
      });
    }
  }

  createeditRecipientForm(formData) {
    console.log(formData);
    let data = {
      "languageCode": "en",
      "reciepentId": this.editRecipientID,
      "fullName": formData.name,
      "Email": formData.EMAIL,
      "empId": formData.Id,
      "corporateId":this.viewEditData['corporateId']
    }
    console.log(this.editRecipientID);

    this.https.postJson1('https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/recipients_edit', data).subscribe(res => {
      console.log(res);
      this.updateData = res['Output'];
      console.log(this.updateData);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
        data: {
          status: 'success',
          message: 'Recipient List has been updated successfully'
        }
      });
      this.dialogRef.close();
      window.location.reload();
    },
      (error) => {
        console.log(error);
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: 'failure',
            message: error.error.Error_message
          }
        });
      });
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
