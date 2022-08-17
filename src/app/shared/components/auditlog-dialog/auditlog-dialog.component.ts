import { OnInit, ViewChild, Input, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-auditlog-dialog',
  templateUrl: './auditlog-dialog.component.html',
  styleUrls: ['./auditlog-dialog.component.scss']
})
export class AuditlogDialogComponent implements OnInit {
  dataSource: MatTableDataSource<object>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['modifiedDate', 'changeType', 'fromValue', 'toValue', 'byWhom'];
  @Input('programId') programId;
  programdataSourceAll;
  earndataSourceAll;
  burndataSourceAll;
  
  programAudit: boolean = false;
  earnAudit: boolean = false;
  burnAudit: boolean = false;
  noRecords: boolean = false;

  constructor(private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    public snackBar: MatSnackBar,
    private http: HttpService) {
    dialogRef.disableClose = true;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    console.log(this.programId);
    this.getAuditLogList();
  }
  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      // 'tableData': this.selection.selected,
      // 'totalCount': this.resultsLength
    }
    this.dialogRef.close(obj);

  }

  getAuditLogList() {
    let AUTIDLOG_LIST = environment.APIEndpoint + 'api/rpa/loyalty/program/v1/auditlog';
    let req = {
      programId: this.programId
    }
    this.http.postJson(AUTIDLOG_LIST, req).subscribe(
      (response) => {
        console.log(response);
        
        if(response["programHistory"].length!=''){
          this.programAudit = true;
          this.dataSource = new MatTableDataSource(response["programHistory"]);
          this.programdataSourceAll = this.dataSource;
          console.log(this.programdataSourceAll);
        }
        if (response["earnruleHistory"].length!=''){
          this.earnAudit = true;
          this.dataSource = new MatTableDataSource(response["earnruleHistory"]);
          this.earndataSourceAll = this.dataSource;
          console.log(this.earndataSourceAll);
        }
        if (response["burnruleHistory"].length!=''){
          this.burnAudit = true;
          this.dataSource = new MatTableDataSource(response["burnruleHistory"]);
          this.burndataSourceAll = this.dataSource;
          console.log(this.burndataSourceAll);
        }
        // else if(response["burnruleHistory"].length!=''){
        //   this.dataSource = new MatTableDataSource(response["burnruleHistory"]);
        //   this.dataSourceAll = this.dataSource;
        //   console.log(this.dataSourceAll);
        // }
      }
    )
  }

}
