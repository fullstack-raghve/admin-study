import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
@Component({
  selector: 'app-alert-message-dialog',
  templateUrl: './alert-message-dialog.component.html',
  styleUrls: ['./alert-message-dialog.component.scss']
})
export class AlertMessageDialogComponent implements OnInit {
  @Input('alertMes') alertMes:string;
  constructor(private dialogRef: MatDialogRef<AlertMessageDialogComponent>,public dialog: MatDialog,) {
    // dialogRef.disableClose = true;
   }

  ngOnInit() {
  }
  onCloseClick() {
    this.alertMes = '';
    this.dialogRef.close();
  }
}
