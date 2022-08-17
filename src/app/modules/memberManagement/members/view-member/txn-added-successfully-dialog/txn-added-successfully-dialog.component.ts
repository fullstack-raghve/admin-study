import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'txn-added-successfully-dialog.component',
  templateUrl: './txn-added-successfully-dialog.component.html',
  styleUrls: ['./txn-added-successfully-dialog.component.scss']
})
export class TxnAddedSuccessfullyDialogComponent implements OnInit {
  public response;
  public customerOid = 0;
  public txnId:String;
  constructor(private dialogRef: MatDialogRef<MatDialog>, private fb: FormBuilder, private https: HttpService, private snackBar: MatSnackBar,
    private router:Router) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    console.log(this.customerOid);
    
  }

  onCloseClick(ID): void {
    console.log(ID);
    localStorage.setItem('memberCustomerId',ID);
    this.router.navigate(['/view-member']);
    // this.router.navigate(['/view-member/'+this.customerOid]);
    this.dialogRef.close();
  }





}
