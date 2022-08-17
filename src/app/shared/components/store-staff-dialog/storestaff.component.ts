import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { MatPaginator, MatSort, MatTableDataSource, MatSlideToggleModule } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export interface UserData {
  storeId: number;
  userId: number;
  userName: string;
  storeName: string;
  city: string;
  country: string;
  phoneNumber: number;
  adminName: string;
  status: string;
}

@Component({
  selector: 'store-staff.component',
  templateUrl: 'store-staff.component.html',
  styleUrls: ['store-staff.component.scss']
})


export class storeStaffDialog implements OnInit {
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
  dataSource: MatTableDataSource<object>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public emptySet = false;
  totalFilterRecordVal: boolean = true;
  displayedColumns: string[] = ['select', 'empId', 'userName', 'fullName', 'role', 'phoneNumber', 'email', 'status'];
  public storeList = [];
  public searchStaffForm: FormGroup;
  public roleId;
  public paginationData;
  public resultsLength = 0; 
  public datalength = 0;
  public preSelectStoreStaff = [];
  selectionMap = [];
  public arrlength = [10, 20, 50, 100];
  public total:number;
  toggle: boolean = false;
  public totalRecordVal: boolean = false;
  loadingResponse:boolean = true;
  disabledTable: boolean = true;
  @Input('totalCount') totalCount = [];
  constructor(private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MatDialog>, ) {
    this.dataSource = new MatTableDataSource();
    dialogRef.disableClose = true;

  }
  public selection = new SelectionModel(true, []);

  status = true;
  openFilter() {
    this.status = !this.status;
  }
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  ngOnInit() {
    this.buildStoreStaffForm();
    this.searchVal(this.searchStaffForm.value);
  }

  resetForm() {
    this.buildStoreStaffForm();
    this.searchVal(this.searchStaffForm.value);
  }

  myTrim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datalength;
    return numSelected === numRows;
  }
  masterToggle() { this.isAllSelected() ? this.clearCheckBox() : this.selectCheckBox() }
  selectCheckBox() {
    this.dataSource.filteredData.forEach((row) => {
      this.checked(row);
    })
  }

  clearCheckBox() {
    this.dataSource.data.forEach((row) => {
      this.unchecked(row);
    });
  }

  searchVal(formData) {
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : this.totalCount,
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": formData ? formData.searchVal : "",
      "fieldSearch": [
        {
          "fieldName": "status",
          "fieldValue": "ONLINE",
        },
        {
          "fieldName": "fullName",
          "fieldValue": this.myTrim(formData.fullName),
        },
        {
          "fieldName": "emailId",
          "fieldValue": this.myTrim(formData.email)
        },

        {
          "fieldName": "employeeId",
          "fieldValue": formData.employeeId
        },
        {
          "fieldName": "status",
          "fieldValue": formData.status
        }
      ]
    }
    this.loadingResponse = true;
    this.https.postJson(environment.APIEndpoint + 'api/rpa/user/search', data).subscribe(res => {
      this.loadingResponse = false;
      this.totalFilterRecordVal = true;
      this.datalength = (res["page"] * res["pageSize"]) + res["pageSize"];
      this.dataSource.data = res["items"];
      this.resultsLength = res["totalCount"];
      this.total = res["totalCount"];
      this.total = res["totalCount"];

      if (this.total == 0) {
        this.disabledTable = true;
      } else {
        this.disabledTable = false;
      }
      this.totalRecordVal = true;
      if (this.dataSource.data.length == 0) {
        this.emptySet = true;
      } else {
        this.emptySet = false;
      }
      if (this.storeList.length > 0) {
        this.dataSource.filteredData.forEach((row) => {
          if (this.storeList.indexOf(row["userId"]) > -1) {
            this.selection.select(row);
            var found = this.selection.selected.find(x => x.userId == row["userId"]);
            if (this.selectionMap.map(a => a.userId).indexOf(row["userId"]) <= -1) {
              this.selectionMap.push(row);
            }

            if (found) found.checked = true;
          }
        })

      }
    }, err => {
    })
    if(this.total > 100){
      this.updateTotal(this.total);
    }
  }

  public updateTotal(total){    
    let updatedTotal = total;
    this.arrlength.push(updatedTotal);
    const arrray = this.arrlength;
    this.arrlength = Array.from(new Set(arrray));
    this.arrlength = this.arrlength.filter(function( element ) {
   return element !== undefined;
  });
  }

  buildStoreStaffForm() {
    let form = {
      searchVal: [""],
      employeeId: ["", Validators.pattern("^[A-Za-z0-9\"&\'(),-:.?_ ]{1,20}$")],
      fullName: ["", Validators.pattern("^[A-Za-z ]{1,200}$")],
      email: ["", Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      status: [""]
    }
    this.searchStaffForm = this.fb.group(form);
  }
  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal(this.searchStaffForm.value);
  }
  onCloseClick() {
    this.dialogRef.close();
  }
  checked(row: any) {
    this.selection.select(row)
    var found = this.selection.selected.find(x => x.userId == row.userId);
    if (this.selectionMap.map(a => a.userId).indexOf(row["userId"]) <= -1) {
      this.selectionMap.push(row);
    }

    if (found) found.checked = true;
  }

  unchecked(row: any) {
    var found = this.selection.selected.find(x => x.storeId == row.storeId);
    this.toggle = false;
    if (this.selectionMap.map(a => a.userId).indexOf(row["userId"]) > -1) {
      const index: number = this.selectionMap.indexOf(row);
      if (index !== -1) {
        this.selectionMap.splice(index, 1);
      }
    }
    if (found) found.checked = false;

    this.selection.deselect(found);
  }//This is very important to deselect 'found' instead of 'row' since selectionmodel will not be able to find 'row' to deselect after page change.

  isChecked(row: any) {
    var found = this.selection.selected.find(x => x.userId == row.userId);
    if (found) return found.checked;
  }
}
