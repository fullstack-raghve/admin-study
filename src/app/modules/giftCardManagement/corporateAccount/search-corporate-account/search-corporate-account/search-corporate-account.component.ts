import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from '../../../../../services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
export interface UserData {
  rpOID: number;
  corporateName: string;
  balance: string;
  currencyCode: string;
  contactName: string;
  contactMobileNumber: string
  modifiedTime: string;
  status: string;

}

@Component({
  selector: 'search-corporate-account',
  templateUrl: './search-corporate-account.component.html',
  styleUrls: ['./search-corporate-account.component.scss']
})
export class SearchCorporateAccountComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Corporate Account',
    link: ''
  }];
  status2: any;
  public modifiedDate = [];
  date: any
  public oldData = [];
  todayDate:Date = new Date();
  public noRecords: boolean = false;
  public resultsLength = 0;
  public searchCorporateAccountForm: FormGroup;
  public displayedColumns: string[] = ['rpOID', 'corporateName', 'balance', 'currencyCode', 'contactName', 'contactMobileNumber', 'modifiedTime', 'status'];
  public status = true;
  public dataSource;
  searchStoreVal = true;
  status1: any;
  public formDataSeacrh: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  notification_data = [];
  constructor(private fb: FormBuilder, private https: HttpService, ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
  
    this.buidsearchNotificationForm()
    this.searchValue()
    this.dataSource.paginator = this.paginator;
    this.searchStoreVal = true;
  }

  openFilter() {
    this.status = !this.status;
  }

  buidsearchNotificationForm() {
    this.searchCorporateAccountForm = this.fb.group({
      searchVal: [""],
      lastMOdifiedDate: [""],
      status: [""],
    });
  }
  searchValue() {
    let formData = this.searchCorporateAccountForm.value
    let lastDate=''
    console.log(formData);
    if(formData['lastMOdifiedDate']){
     lastDate = moment(formData['lastMOdifiedDate']).format('YYYY-MM-DD');
     }
    
   let data=
  
    {
      "searchText": formData.searchVal,
      "status": formData.status,
      "updatedDate": lastDate
    }
    console.log(data);
    
    this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate_with_filter', data).subscribe(res => {
      console.log(res);
      this.notification_data = res['Output'];
      let result=res['Output']
      this.dataSource = new MatTableDataSource(res['Output']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.searchStoreVal = false;
      if (result == "No data found") {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
    }, err => {
      console.log(err)

    })
}
  resetForm() {
    this.noRecords = false;
    this.searchCorporateAccountForm.reset();
    this.searchValue();
    this.dataSource.paginator = this.paginator;
  }
  //  for search
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
