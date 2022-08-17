import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'search-transaction-id-dialog',
  templateUrl: './search-transaction-id-dialog.component.html',
  styleUrls: ['./search-transaction-id-dialog.component.scss']
})
export class SearchTransactionIdDialogComponent implements OnInit {	
  public minDate: Date | null; 
  constructor(private dialogRef: MatDialogRef<MatDialog>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }

}
