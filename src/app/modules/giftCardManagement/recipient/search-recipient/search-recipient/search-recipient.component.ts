import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatButtonToggleModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from '../../../../../../../src/app/services/http-service';
import { environment } from '../../../../../../../src/environments/environment';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { AddRecipientComponent } from '../../add-recipient/add-recipient/add-recipient.component';
import { BulkUploadComponent } from '../bulk-upload/bulk-upload.component';
import { ViewRecipientComponent } from '../../view-recipient/view-recipient/view-recipient.component';
// import { getMaxListeners } from 'cluster';
export interface UserData {
  id: string;
  name: string;
  emailId: string;
  mobileNumber: string;
  corporate: string;
}


@Component({
  selector: 'app-search-recipient',
  templateUrl: './search-recipient.component.html',
  styleUrls: ['./search-recipient.component.scss']
})
export class SearchRecipientComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    link: ''
  },
  ];
  noRecords
  datashow: boolean;
  public searchCorporateAccountForm: FormGroup;
  public displayedColumns: string[] = ['empId', 'USER_NAME', 'EMAIL', 'MOBILE_NUMBER', 'CORPORATE_NAME'];
  public status = true;
  // public dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public viewRecipientId;
  notification_data: UserData[] = [];
  dataSource: MatTableDataSource<UserData>;
  corporateDetails: any;
  COPID='';
  searchStoreVal = true;
  NoRecord= false;
  constructor(private formBuilder: FormBuilder, private https: HttpService, private http: HttpService,
    private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder, ) {


  }

  ngOnInit() {
    this.getData();
    this.getCorporateId();
    this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.buidsearchNotificationForm();
  }

  openFilter() {
    this.status = !this.status;
  }

  buidsearchNotificationForm() {
    this.searchCorporateAccountForm = this.fb.group({
      Corporate: [""],
      // lastMOdifiedDate: [""],
      // // cardValue : [""],
      // status: [""],
      // // readstatus: ["",],
      // // store: ["",]

    });
  }
  searchVal() {
   this.COPID = this.searchCorporateAccountForm.get('Corporate').value;
    this.getData();
  }
  resetForm() {
    this. buidsearchNotificationForm();
    this.COPID= '';
    this.getData();
  }

  // calling component
  addRecipient() {


    

    const dialogRef = this.dialog.open(AddRecipientComponent,
      {panelClass: 'dialogAddReciStyleChange'});
   

    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.autoFocus = false;
    // const dialogRef = this.dialog.open(
    //   AddRecipientComponent,
    //   dialogConfig
    // );
  }


  viewRecipient(value) {
    // console.log(value);
    this.viewRecipientId = value;
    const dialogRef = this.dialog.open(ViewRecipientComponent,{panelClass: 'dialogAddReciStyleChange'}
      );
    dialogRef.componentInstance.editViewRecipientId = this.viewRecipientId;
    localStorage.setItem('RPOID', value);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    // const dialogRef = this.dialog.open(
    //   ViewRecipientComponent,
    //   dialogConfig
    // );
  }
  uploadImage() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      BulkUploadComponent,
      {panelClass: 'dialogBulkStyleChange'}
    );

  }
  getData() {
    this.searchStoreVal= true;
    this.NoRecord=false;
    let TEMPURL = 'https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/get_recipients_user';
    let data = {
      "corporateId":this.COPID
    }

    return this.http.postCustomizeJson(TEMPURL, data)
      .subscribe((response) => {
        // console.log(response);
        this.dataSource = new MatTableDataSource(response["Output"]);
        // console.log(JSON.stringify(response));
        let value = response;
        this.searchStoreVal= false;
        this.notification_data = value['Output'];
        console.log(this.notification_data);
        // const notification_data: UserData[] = NewColums;
        this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
          if(this.notification_data.length==0){
            this.NoRecord=true;
          }

      },
        (error) => {
          // console.log(error);

        });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getCorporateId() {
    let data = {
      "searchText":""
    }
    this.https.postCustomizeJson('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate_list', data).subscribe(res => {
      console.log(res);
      this.corporateDetails = res['Output'];
      console.log(this.corporateDetails);


    });
  }
}
