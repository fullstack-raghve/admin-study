import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { HttpService } from '../../../../services/http-service'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
export interface PeriodicElement {
  time: string;
  date: number;
  addAmt: number;
  deductAmt: string;
  BALANCE: number;
  name: string;
  approveStatus: string;
}

@Component({
  selector: 'app-corporate-account-history',
  templateUrl: './corporate-account-history.component.html',
  styleUrls: ['./corporate-account-history.component.scss']
})


export class CorporateAccountHistoryComponent implements OnInit {
  public viewCorporateId;
  public historyData;
  @Input('historyList') historyList = [];
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;

  }

  displayedColumns: string[] = ['date', 'time', 'addAmt', 'deductAmt','BALANCE','name','approveStatus'];
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

