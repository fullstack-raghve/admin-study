import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-kiosk-selected-user',
  templateUrl: './kiosk-selected-user.component.html',
  styleUrls: ['./kiosk-selected-user.component.scss']
})
export class KioskSelectedUserComponent implements OnInit {
  users: any;
  public searchUserForm: FormGroup;
  public paginationData;
  public status = true;
   public dataSource;
   public selectAll:boolean=false;
   public loadingResponse: boolean = false;
  resultsLength: any;
   displayedColumns: string[] = ['select', 'userId', 'fullName'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input('UserList') UserList = [];
  selection = new SelectionModel(true, []);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<KioskSelectedUserComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private http: HttpService,
    public snackBar: MatSnackBar ) {

     }

  ngOnInit() {
    console.log(this.UserList);
    
    this.buildUserForm();
     this.searchVal();

  }

  paginationDetail = new BehaviorSubject(
    {
        length: 5,
        pageIndex: 0,
        pageSize: 5
    });
  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
  searchVal() {
    this.loadingResponse = true;
    const formdata = this.searchUserForm.value;
    const data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": 1000,
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": formdata.searchVal,
      "fieldSearch": [
        {
          "fieldName": "fullName",
          "fieldValue": formdata.fullName,
        },
        {
          "fieldName": "emailId",
          "fieldValue": formdata.emailId,
        },
        {
          "fieldName": "phoneNumber",
          "fieldValue": formdata.phoneNumber
        },

        // {
        //   "fieldName" : "StoreName",
        //   "fieldValue" :formdata.storeName
        // },
        {
          "fieldName": "status",
          "fieldValue": formdata.status
        }
      ]
    }
    
    this.http.postJson(environment.APIEndpoint + 'api/rpa/user/search', data).subscribe(res => {
            this.dataSource = new MatTableDataSource(res['items']);
            this.loadingResponse = false;
            this.dataSource.sort = this.sort;
            this.resultsLength = res['totalCount'];
            if (this.UserList.length > 0) {
              for (const i of this.dataSource.data) {
                if (this.UserList.indexOf(i['userId']) > -1) {
                  this.selection.select(i);
                }
              }
            } else if (this.selectAll) {
              for (const i of this.dataSource.data) {
                console.log(i);
                  this.selection.select(i);
              }
            }
    }, err => {
      this.loadingResponse = false;
          console.log(err)
          if(err.status==0){
            this.searchVal();
          }
    })

  }
  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    console.log(numSelected);
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }



  buildUserForm() {
    this.searchUserForm = this.fb.group({
      searchVal: ['', ],
    });
  }
}
