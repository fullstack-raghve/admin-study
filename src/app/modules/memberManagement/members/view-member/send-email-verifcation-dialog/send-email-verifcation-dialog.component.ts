import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'send-email-verifcation-dialog',
  templateUrl: './send-email-verifcation-dialog.component.html',
  styleUrls: ['./send-email-verifcation-dialog.component.scss']
})
export class SendVerificationDialogComponent implements OnInit {

      constructor(private dialogRef: MatDialogRef<MatDialog>) {
      dialogRef.disableClose = true;
    }

  ngOnInit() {
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
