import { Component, OnInit ,ViewChild,Input} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatSnackBar } from '@angular/material';
export interface RecipientList {
  RP_OID:string;
  USER_NAME: string;
  EMAIL: string;
  MOBILE_NUMBER: number;
  empId:number;
}
// const ELEMENT_DATA: RecipientList[] = [
//   { referenceId: 'AB5654', name: 'Kumar Swamy', emailId:'kumar@gmail.com', mobileNumber: 9898767654},
//   { referenceId: 'AB5655', name: 'Uday Kumar', emailId:'uday@gaiml.com', mobileNumber: 7465876545 },

// ];
@Component({
  selector: 'app-select-recipient-dialog',
  templateUrl: './select-recipient-dialog.component.html',
  styleUrls: ['./select-recipient-dialog.component.scss']
})
// check box table
export class SelectRecipientDialogComponent implements OnInit {
  RecipientDetails: RecipientList[] = [  ];
  public dataSource: MatTableDataSource<RecipientList>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public selection = new SelectionModel(true, []);
  dataSourceAll: MatTableDataSource<RecipientList>;
  CorporateID:any;
  searchCorporateAccountForm: FormGroup;
  disabled=true;
  displayedColumns: string[] = ['select','empId' ,'USER_NAME', 'EMAIL','MOBILE_NUMBER'];
  @Input('isDisabled') isDisabled: boolean = false;


  totalRecordVal: boolean;
  totalFilterRecordVal: boolean;
  resultsLength: any;
  noRecords: boolean;
  total: any;
  selectedRecipientDetails=[];
  public selectAll: boolean = false;
  loadingResponse: boolean = true;
  selectedArray: any[];
  selectedStoreCount: number;


  constructor(private formBuilder: FormBuilder, private https: HttpService, private http: HttpService,
    private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder, ) {

  }

  ngOnInit() {
    this.getRecipientList();
    this.dataSource = new MatTableDataSource<RecipientList>(this.RecipientDetails);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getRecipientList(){
    let TempURL = "https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/get_recipients_user";
    let data = {
      "corporateId":this.CorporateID,
    }
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        console.log(response['Output']);
        if(response['Output'][0]=='No data found'){
          this.noRecords = true;
        }else{
        this.dataSource = new MatTableDataSource<RecipientList>(response['Output']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.totalRecordVal = true;
      this.totalFilterRecordVal = true;
      this.loadingResponse = false;

      this.resultsLength = response["Output"].length;
      if (response['Output'][0]=='No data found') {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      this.total = this.resultsLength;
      console.log(this.total);

      if (this.total == 0) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
      
      if (this.selectedRecipientDetails.length > 0) {
        console.log(this.selectedRecipientDetails.length);
        // this.SKU_CODE = this.selectedRecipientDetails[0]
        for (let i of this.dataSource.data) {
          if (this.selectedRecipientDetails.indexOf(i["RP_OID"]) > -1) {
            this.selection.select(i);
          }
        }
      } else if (this.selectAll) {
        for (let i of this.dataSource.data) {
          this.selection.select(i);
        }
      }
    }
    },err => {
      console.log(err);
      this.loadingResponse = true;
    // })
  }); 
       
     
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
}
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.selectedArray = this.selection.selected;
    this.selectedStoreCount = this.selectedArray.length;
    return numSelected === numRows;
}
applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
}

