import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { HttpService } from '../../../../../services/http-service'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SnackBarComponent } from '../../../../../../../src/app/shared/components/snack-bar/snack-bar.component';
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
  selector: 'app-edit-history-dialog',
  templateUrl: './edit-history-dialog.component.html',
  styleUrls: ['./edit-history-dialog.component.scss']
})
export class EditHistoryDialogComponent implements OnInit {

  public viewCorporateId;
  public historyData;
  corporateId;
  @Input('historyList') historyList = [];
  @Input('corporateRpoId') corporateRpoId;
  transactionId: any;
  constructor(private fb: FormBuilder,
    public dialog: MatDialog, private https: HttpService, public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MatDialog>,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }
  // displayedColumns: string[] = ['date'];
  public IssendForApproval: boolean = false;
  public menuIds: any = localStorage.getItem("navigationArray");
   displayedColumns: string[] = ['date', 'time', 'addAmt', 'deductAmt','BALANCE','name','approveStatus'];
  dataSource: MatTableDataSource<PeriodicElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // dataSource = ELEMENT_DATA;
  ngOnInit() {
    console.log(this.historyList);
    this.getMenuRole()
    this.dataSource = new MatTableDataSource(this.historyList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.getHistoryList();
    // this.dataSource.paginator = this.paginator;
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  // get history data from view
  getHistoryList() {
    this.dataSource = new MatTableDataSource(this.historyList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getApprove(listData){
    console.log(listData);
    console.log(listData['transactionId']);
    this.transactionId=listData['transactionId']
    
    let data={
        "corporateId": this.corporateRpoId,
        "transactionId": this.transactionId
         }        
         this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/approve_status', data).subscribe(res => {
          console.log(res);
          let msg1
          msg1 = res['Output']
          console.log(msg1);
    
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1000,
            data: {
              status: 'success',
              message: msg1
            }
          });
          window.location.reload();
    
        }, err => {
          console.log(err)
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: 'failure',
              message: 'Your request cannot be saved at this time. Please try again later'
            }
          });
        })
  }
  getMenuRole(){
    if (this.menuIds.indexOf('10006012') > -1) {
      this.IssendForApproval = true;
      } else {
      this.IssendForApproval = false;
      }
  }

}
