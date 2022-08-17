import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { HttpService } from '../../../../services/http-service'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
export interface PeriodicElement {
  slNo: number;
  transactionData: string;
  description: string;
  debit: string;
  CURRENCY_CODE: string;
  balance;
  PRODUCT_NAME: string;
  storeOid: string;
  STORE_NAME:string;
}
@Component({
  selector: 'app-view-history-dialog',
  templateUrl: './view-history-dialog.component.html',
  styleUrls: ['./view-history-dialog.component.scss']
})

export class ViewHistoryDialogComponent implements OnInit {
  public historyData;
  @Input('historyList') historyList = [];
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  displayedColumns: string[] = ['slNo', 'transactionData', 'description','debit','CURRENCY_CODE','balance','PRODUCT_NAME','storeOid','STORE_NAME'];
  dataSource: MatTableDataSource<PeriodicElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // dataSource = ELEMENT_DATA;
  ngOnInit() {
    console.log(this.historyList);
    this.getHistoryList();
    this.dataSource.paginator = this.paginator;
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  // get history data from view
  getHistoryList() {
    this.dataSource = new MatTableDataSource(this.historyList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource);
    // this.historyList = this.dataSource;
  }


}
