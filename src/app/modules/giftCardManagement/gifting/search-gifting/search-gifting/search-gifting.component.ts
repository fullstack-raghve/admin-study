import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from '../../../../../services/http-service';
import * as moment from 'moment';
export interface UserData {
  GIFTING_ID: string;
  OCCASSION_NAME: string;
  CARD_TYPE: string;
  CORPORATE_NAME: string;
  CORPORATE_VALUE: string;
  currecncyCode: string
  RECIPIENT: number;
  DELIVERY_DATE_TIME: string;
  LAST_MODIFIED_DATE: string;
  STATUS: string;
}

@Component({
  selector: 'app-search-gifting',
  templateUrl: './search-gifting.component.html',
  styleUrls: ['./search-gifting.component.scss']
})
export class SearchGiftingComponent implements OnInit {
  corporateDetails = []
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    link: ''
  },
  ];
  public noRecords: boolean = false;
  public searchGiftingForm: FormGroup;
  public displayedColumns: string[] = ['GIFTING_ID', 'OCCASSION_NAME', 'CARD_TYPE', 'CORPORATE_NAME', 'CORPORATE_VALUE', 'currecncyCode', 'RECIPIENT', 'DELIVERY_DATE_TIME', 'LAST_MODIFIED_DATE', 'STATUS'];
  public status = true;
  public dataSource;
  public searchGiftVal: boolean = true;
  datashow;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  notification_data: UserData[] = [];

  constructor(private fb: FormBuilder, private https: HttpService, ) { }

  ngOnInit() {
    this.buidsearchNotificationForm();
    this.searchVal();
    this.getCorporateNames()
  }

  openFilter() {
    this.status = !this.status;
  }

  buidsearchNotificationForm() {
    this.searchGiftingForm = this.fb.group({
      searchVal: [""],
      corporateId: [""],
      cardType: [""],
      fromDate: [""],
      toDate: [""]

    });
  }
  searchVal() {
    let formData=this.searchGiftingForm.value;
    // console.log(formDtata);
    let From = formData.fromDate;
    let TO = formData.toDate;
    if(formData.fromDate != ''){
      From = moment(formData.fromDate).format('YYYY-MM-DD');
    }
    if(formData.toDate != '')
    {
      TO = moment(formData.toDate).format('YYYY-MM-DD')
    }
    let data = {
      "corporateId": formData.corporateId,
      "cardType":formData.cardType,
      "fromDate":From,
      "toDate": TO
    }

    this.https.postJson1('https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/gifting_search', data).subscribe(res => {
      console.log(res['Output']);
      let result=res['Output']
      this.notification_data = res['Output'];

      this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.searchGiftVal = false;
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
    this.buidsearchNotificationForm();
    this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
    this.dataSource.paginator = this.paginator;
  }

  // Corporate names
  getCorporateNames() {
    let data = {
      "searchText": ""
    }

    this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate', data).subscribe(res => {
      console.log(res['Output']);
      console.log(JSON.stringify(res['Output']));
      this.corporateDetails = res['Output']

    })
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
