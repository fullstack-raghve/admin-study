import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-send-otp-dialog',
  templateUrl: './send-otp-dialog.component.html',
  styleUrls: ['./send-otp-dialog.component.scss']
})
export class SendOtpDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<MatDialog>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
