import { OnInit, ViewChild, Input, Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  public yesChangeValue: boolean = false;
  public noChangeValue: boolean = false;
  public errorDetails: any = [];
  constructor(private dialogRef: MatDialogRef<MatDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      console.log(data)
      this.errorDetails = data;
     }

  ngOnInit() {
   
  }
  yesChange(){
    this.yesChangeValue = true;
    this.dialogRef.close();
  }
  noChange(){
    this.noChangeValue = true;
    this.dialogRef.close();
  }
}
