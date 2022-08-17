import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { MatPaginator, MatSort, MatTableDataSource, MatSlideToggleModule } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'edit-store.component',
  templateUrl: 'edit-store.component.html',
  styleUrls: ['edit-store.component.scss']
})


export class editStoreDialog implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  dataSource: MatTableDataSource<object>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'storeId', 'storeName', 'address', 'city', 'country'];
  public storeList = [];
  public searchStoreForm: FormGroup;
  public paginationData;
  public Obj;
  public resultsLength = 0;
  constructor(private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {

    this.dataSource = new MatTableDataSource();

  }
  public selection = new SelectionModel(true, []);

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchStoreForm = this.fb.group({
      searchtxt: [""],
      fullName: [""],
      emailId: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(6), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      phoneNumber: ["", [Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]+$")]],
      roles: [""],
      storeName: [""],
      status: [""],
    });

    this.getStoreList(this.searchStoreForm.value);
  }
  status = true;
  openFilter() {
    this.status = !this.status;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  resetForm() {
    this.searchStoreForm.reset()
  }
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
  }
  getStoreList(formData) {
    let data = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "storeId",
        "dir": "asc"
      },
      "keySearch": formData ? formData.searchtxt : "",
      "fieldSearch": [
        {
          "fieldName": "storeId",
          "fieldValue": "",
        },
        {
          "fieldName": "roles",
          "fieldValue": formData ? formData.roles : "",
        },
        {
          "fieldName": "storeAdmin.emailId",
          "fieldValue": formData ? formData.emailId : "",
        }, {
          "fieldName": "storeAdmin.phoneNumber",
          "fieldValue": formData ? formData.phoneNumber : "",
        }, {
          "fieldName": "storeAdmin.adminName",
          "fieldValue": formData ? formData.searchtxt : "",
        },
        {
          "fieldName": "status",
          "fieldValue": formData ? formData.status : "",
        }
      ]
    }


    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
      this.dataSource.data = res["items"];
      this.resultsLength = res["totalCount"]
    }, err => {
    })
  }

}
