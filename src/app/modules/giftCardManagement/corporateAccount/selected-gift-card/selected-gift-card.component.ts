import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar} from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../../../src/app/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../src/environments/environment';
import { SnackBarComponent } from '../../../../../../src/app/shared/components/snack-bar/snack-bar.component';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { notificationDialog } from '../../../../../../src/app/shared/components/notification-dialog/notification.component';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
export interface corporate_data1 {
  giftcardId: number;
  cardName: string;
  // templateFor: string;
  backgroundImage: string;
}

@Component({
  selector: 'app-selected-gift-card',
  templateUrl: './selected-gift-card.component.html',
  styleUrls: ['./selected-gift-card.component.scss']
})
export class SelectedGiftCardComponent implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

  public langCode:any;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  users: any;
  corporate_data:any =[];
  public searchUserForm: FormGroup;
  public paginationData;
  public status = true;
  public iselectAll: boolean = false;
  resultsLength: any;
  brandData= [];
  displayedColumns: string[] = ['giftcardId', 'cardName','Corporate' ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input('ImageList') ImageList = [];
  selection = new SelectionModel(true, []);
  
  public dataSource = this.corporate_data;
  //  dataSource = corporate_data;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SelectedGiftCardComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private http: HttpService,private https: HttpService,
    public snackBar: MatSnackBar) {

  }

  ngOnInit() {
    // this.buildUserForm();
    // this.searchVal();
    // this.getAllBrands();
    this.getLAnguageList()
    this.getCorporateData();
    this.dataSource = new MatTableDataSource<corporate_data1>(this.corporate_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  onClickClose(): void {
    this.dialogRef.close();
  }
  
  public getLAnguageList() {
    for (let i = 0; i < this.languageList.length; i++) {
      this.langCode = this.languageList[i].languageCode;
      console.log(this.langCode);
    }
  }
getCorporateData(){
  let data={
    
      "languageCode":"en"
               
  }
  this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate_template_details', data).subscribe(res => {
    console.log(res);
    this.corporate_data = res['Output'];
    console.log(this.corporate_data);
    this.dataSource=this.corporate_data
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    if (this.ImageList.length > 0) {
            for (let i of this.corporate_data) {
              if (this.ImageList.indexOf(i['giftcardId']) > -1) {
                this.selection.select(i);
              }
            }
          } else if (this.isAllSelected) {
            for (const i of this.corporate_data) {
              console.log(i);
              this.selection.select(i);
            }
          }
        }, err => {
          console.log(err)
         
  
  })
}
  paginationDetail = new BehaviorSubject(
    {
      length: 5,
      pageIndex: 0,
      pageSize: 5
    });
  // searchVal() {
  //   const formdata = this.searchUserForm.value;
  //   const data =
  //   {
  //     "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
  //     "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "5",
  //     "order": {
  //       "column": "modifiedTime",
  //       "dir": "desc"
  //     },
  //     "keySearch": formdata.searchVal,
  //     "fieldSearch": [
  //       {
  //         "fieldName": "fullName",
  //         "fieldValue": formdata.fullName,
  //       },
  //       {
  //         "fieldName": "emailId",
  //         "fieldValue": formdata.emailId,
  //       },
  //       {
  //         "fieldName": "phoneNumber",
  //         "fieldValue": formdata.phoneNumber
  //       },

  //       // {
  //       //   "fieldName" : "StoreName",
  //       //   "fieldValue" :formdata.storeName
  //       // },
  //       {
  //         "fieldName": "status",
  //         "fieldValue": formdata.status
  //       }
  //     ]
  //   }
  //   this.http.postJson(environment.APIEndpoint + 'api/rpa/user/search', data).subscribe(res => {
  //     this.dataSource = new MatTableDataSource(res['items']);
  //     this.dataSource.sort = this.sort;
  //     this.resultsLength = res['totalCount'];
  //     if (this.UserList.length > 0) {
  //       for (const i of this.dataSource.data) {
  //         if (this.UserList.indexOf(i['userId']) > -1) {
  //           this.selection.select(i);
  //         }
  //       }
  //     } else if (this.selectAll) {
  //       for (const i of this.dataSource.data) {
  //         console.log(i);
  //         this.selection.select(i);
  //       }
  //     }
  //   }, err => {
  //     console.log(err)
  //     if (err.status == 0) {
  //       this.searchVal();
  //     }
  //   })

  // }
  
  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    // this.searchVal();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
    console.log(numRows);
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }



  buildUserForm() {
    this.searchUserForm = this.fb.group({
      searchVal: ['',],
    });
  }





}
