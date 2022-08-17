import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-send-email-verification-error',
  templateUrl: './send-email-verification-error.component.html',
  styleUrls: ['./send-email-verification-error.component.scss']
})
export class SendEmailVerificationErrorComponent implements OnInit {

  constructor(private dialogRefe: MatDialogRef<MatDialog>) {
    dialogRefe.disableClose = true;
  }

  ngOnInit() {
  }
  onCloseClick(): void {
    this.dialogRefe.close();
  }

}
