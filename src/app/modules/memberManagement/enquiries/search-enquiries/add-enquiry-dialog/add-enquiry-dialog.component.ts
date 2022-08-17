import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'add-enquiry-dialog',
  templateUrl: './add-enquiry-dialog.component.html',
  styleUrls: ['./add-enquiry-dialog.component.scss']
})
export class AddEnquiryDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<MatDialog>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }
  public enquiryList = [
    {
      "id": 1,
      "name": 'Complaint'
    },
    {
      "id": 2,
      "name": 'Query'
    },
    {
      "id": 3,
      "name": 'Transaction Enquiry'
    }
  ]
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
