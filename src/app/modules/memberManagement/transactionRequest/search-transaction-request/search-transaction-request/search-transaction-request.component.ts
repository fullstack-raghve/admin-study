import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Sort } from '@angular/material/sort';
import * as moment from 'moment';
import { InvalidTxnViewDialogComponent } from '../invalid-transaction-view-dialog/invalid-txn-view-dialog.component';
import { ReasonInvalidCommentsComponent } from '../reason-invalid-comments/reason-invalid-comments.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface UserData {
  referenceId: number;
  memberName: string;
  phoneNumber: string,
  txnBarcode: string;
  requestDate: string;
  status: string;
  action: string;
}

export interface Country {
  countryId: number;
  countryName: string;
}

@Component({
  selector: 'search-transaction-request',
  templateUrl: './search-transaction-request.component.html',
  styleUrls: ['./search-transaction-request.component.scss']
})
export class SearchTransactionRequestComponent implements OnInit {
searchTransactionReqForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Member Management',
    link: ''
  }];
  public txnReqId;
  public displayedColumns: string[] = ['transactionRequestOid', 'userName', 'phoneNumber', 'transactionId', 'createdTime', 'transactionRequestStatus', 'transactionRequestVal'];
  public status = true;
  public dataSource;
  public countries: any = [];
  public resultsLength = 0;
  noRecordData: boolean = false;
  searchtransReqVal: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;

  public countryId;
  public countryList;
  Countries: Country[] = [];
  countryCtrl = new FormControl();
  filteredCountries: Observable<Country[]>;
  public keySearchVal : any ;
  constructor(private fb: FormBuilder, private https: HttpService, public dialog: MatDialog, public router: Router) {
    // this.getAllCountries();
    this.buidsearchTransactionReqForm();
    this.getAllCountriesA();
  }

  openFilter() {
    this.status = !this.status;
  }

  ngOnInit() {
    this.getAllCountriesA();
    this.dataSource = new MatTableDataSource();
    if (sessionStorage.getItem('CheckType') == 'TxnReqList') {
      if (sessionStorage.searchValue != "null") {
        this.searchTransactionReqForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
      }
      if (sessionStorage.paginationData) {
        let obj = JSON.parse(sessionStorage.paginationData);
        this.paginationDetail = new BehaviorSubject({
          length: obj.length,
          pageIndex: obj.pageIndex,
          pageSize: obj.pageSize
        });
        this.paginationDetail.next(obj);
        this.paginationData = obj;
        this.searchVal();
        this.paginator.pageIndex = obj.pageIndex;
      } else {
        this.searchVal();
      }
    } else {
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType', 'TxnReqList');
    }
    // this.searchVal();
  }
  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        console.log(response);
        this.countries = response;

      })
  }

  getAllCountriesA() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        // console.log(response);
        this.countryList = [];
        this.Countries = [];
        this.countryList = response;
        for (let i = 0; i <= this.countryList.length - 1; i++) {
          let objMallkey = {
            countryId: this.countryList[i]['countryId'],
            countryName: this.countryList[i]['countryName'],
          }
          // console.log(objMallkey);
          this.Countries.push(objMallkey);
        }
        this.filteredCountries = this.countryCtrl.valueChanges
          .pipe(
            startWith(''),
            map(country => country ? this._filterCountries(country) : this.Countries.slice())
          );
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.Countries.filter(country => country.countryName.toLowerCase().indexOf(filterValue) === 0);
  }

  getAllcountry(countryId) {
    this.countryId = countryId;
    console.log(this.countryId);
  }



  buidsearchTransactionReqForm() {
   let form ={
      status: [""],
      searchVal: [""],
      countryCtrl: [""],
      mobileNoCtrl: ["", Validators.minLength(8)],
      refIdCtrl: [""],
      reqStartDateCtrl: [""],
      reqEndDateCtrl: [""],
      transactionBarCodeCtrl: [""],
    }
    this.searchTransactionReqForm = this.fb.group(form);
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  searchVal() {
    let formdata = this.searchTransactionReqForm.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    this.searchtransReqVal = true;
    this.noRecordData = false;
    this.keySearchVal = sessionStorage.getItem('searchValue');
    if(this.keySearchVal == "null"){
      this.keySearchVal = '';
    }

    if(this.searchTransactionReqForm.invalid == false){
      let data = {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": "oid",
          "dir": "desc"
        },
        "keySearch": this.keySearchVal,
        "fieldSearch": [
  
          {
            "fieldName": "phoneNumber",
            "fieldValue": formdata.mobileNoCtrl == null ? '' : formdata.mobileNoCtrl
          },
          {
            "fieldName": "countryOid",
            "fieldValue": this.countryId == undefined || this.countryId == '' ? '' : this.countryId 
          },
          {
            "fieldName": "fromDate",
            "fieldValue": formdata.reqStartDateCtrl == null ||  formdata.reqStartDateCtrl == '' ? '' : moment(formdata.reqStartDateCtrl).format('YYYY-MM-DD') 
          },
          {
            "fieldName": "toDate",
            "fieldValue": formdata.reqEndDateCtrl == null ||  formdata.reqEndDateCtrl == '' ? '' : moment(formdata.reqEndDateCtrl).format('YYYY-MM-DD') 
          },
          {
            "fieldName": "oid",
            "fieldValue": formdata.refIdCtrl   == null ? '' :  formdata.refIdCtrl
          },
          {
            "fieldName": "transactionId",
            "fieldValue": formdata.transactionBarCodeCtrl == null ? '' : formdata.transactionBarCodeCtrl
          },
          {
            "fieldName": "transactionRequestStatus",
            "fieldValue": formdata.status == null ? '' : formdata.status
          }
        ]
      }
  
      this.https.postJson(environment.APIEndpoint + 'api/rpa/transaction/request/v1/search', data).subscribe
        ((response) => {
          this.searchtransReqVal = false;
          console.log(response);
          this.dataSource = new MatTableDataSource(response["items"]);
          this.resultsLength = response["totalCount"];
          console.log(this.resultsLength);
          if (this.resultsLength == 0) {
            this.noRecordData = true;
          } else {
            this.noRecordData = false;
          }
          this.dataSource.sort = this.sort;
        },
          (error) => {
            console.log(error);
            this.searchtransReqVal = true;
          })
    }
  }
  resetForm() {
    this.noRecordData = false;
    this.buidsearchTransactionReqForm();
    this.searchVal();
    this.countryCtrl.reset('');
    this.countryId = '';
    this.Countries = [];
  }

  openManualTxnDialog(value) {
    console.log(value);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      txnOid: value
    }
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(InvalidTxnViewDialogComponent, dialogConfig);
    dialogRef.componentInstance.txnReqId = value;
  }
  openCommentsDialog(value, status) {
    console.log(value, status);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      txnOid: value
    }
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(ReasonInvalidCommentsComponent, dialogConfig);
    dialogRef.componentInstance.txnReqId = value;
    dialogRef.componentInstance.txnRequestStatus = status;
  }
  viewTxnMember(ID) {
    localStorage.setItem('memberCustomerId', ID);
    this.router.navigate(['/view-member']);
  }
}
