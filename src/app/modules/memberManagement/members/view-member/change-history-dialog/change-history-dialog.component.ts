import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';

export interface HistoryData {
  modifiedDate: string;
  changeType: string;
  fromValue: string;
  toValue:string;
  changedBy: string;
}
@Component({
  selector: 'change-history-dialog',
  templateUrl: './change-history-dialog.component.html',
  styleUrls: ['./change-history-dialog.component.scss']
})
export class ChangeHistoryDialogComponent implements OnInit {
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };

  displayedColumns: string[] = ['modifiedDate', 'changeType', 'fromValue','toValue', 'changedBy'];
  dataSource: MatTableDataSource<HistoryData>;
  public memberId;
  public paginationData;
  public  resultsLength = 0;
  public searchForm: FormGroup;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialogRef: MatDialogRef<MatDialog>, private https: HttpService,private fb: FormBuilder) {
    dialogRef.disableClose = true;
    this.dataSource = new MatTableDataSource();
  }

  status = true;
  openFilter() {
    this.status = !this.status;
  }

  
  ngOnInit() {
     this.buildStoreForm();
     this.viewCustomerHistory();
  }
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

    buildStoreForm(){
      this.searchForm = this.fb.group({
        modifiedDate: [""],
        changeType: [""],
        searchKey:[""]
      });
  }

  public viewCustomerHistory(){
    let formdata = this.searchForm.value;
      let body ={
          "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
          "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
          "order": {
            "column": this.sortColumn,
            "dir": this.sortDirection
          },
          "keySearch": formdata.searchKey,
          "fieldSearch": [{
              "fieldName":"userOid",
              "fieldValue":this.memberId,

          },
          {
            "fieldName": "modifiedTime",
            "fieldValue": formdata.modifiedDate!='' ? moment(formdata.modifiedDate).format('YYYY-MM-DD'):'' 
          },
          {
            "fieldName": "changeType",
            "fieldValue": formdata.changeType
          }]


      }
      let GET_CUSTOMER_HISTORY = environment.APIEndpoint + "api/rpa/memberMgmt/v1/viewUserHistory";
      this.https.postJson(GET_CUSTOMER_HISTORY,body)
      .subscribe(
          (response)=>{
              console.log("changeHistory = "+response);
              this.dataSource = new MatTableDataSource(response["items"]);
              this.resultsLength = response["totalCount"];
          });
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }

  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.viewCustomerHistory();
  }

  sortData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }

    this.viewCustomerHistory();
  }
}
