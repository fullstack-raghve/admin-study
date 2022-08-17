import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface UserData {
  RP_OID: string;
  CARD_NAME: string;
  CARD_FOR: string,
  VALUE_TYPE: string;
  DATE_OF_PUBLISH: string;
  PUBLISH_STATUS: string;
}

@Component({
  selector: 'search-gift-card',
  templateUrl: './search-gift-card.component.html',
  styleUrls: ['./search-gift-card.component.scss']
})
export class SearchGiftCardComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Gift Card',
    link: ''
  }];
  public noRecords: boolean = false;
  public searchGiftVal: boolean = true;
  public searchNotificationForm: FormGroup;
  public displayedColumns: string[] = ['RP_OID', 'CARD_NAME', 'CARD_FOR', 'VALUE_TYPE', 'DATE_OF_PUBLISH', 'PUBLISH_STATUS'];
  public status = true;
  public dataSource;
  public satausDeatils=[]
  @ViewChild(MatPaginator) paginator:MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  notification_data = []
    ;
  constructor(private fb: FormBuilder, private https: HttpService, ) {
    this.buidsearchNotificationForm()
  }

  ngOnInit() {
    // this.buidsearchNotificationForm();
    this.searchVal()
    // this.dataSource.paginator = this.paginator;
    var d = new Date();
    console.log(d.toLocaleString());
  }

  openFilter() {
    this.status = !this.status;
    this.displayStatus()
  }

  buidsearchNotificationForm() {
    this.searchNotificationForm = this.fb.group({
      cardFor: [""],
      cardValue: [""],
      status: [""],
      readstatus: ["",],
      store: ["",],
      searchVal: [""],
    });
  }
  searchVal() {
    let formdata = this.searchNotificationForm.value;
    console.log(formdata);
    var d = new Date();
    console.log(d.toLocaleString());
    let data = {

      "languageCode": "en",
      "cardfor": formdata.cardFor,
      "cardvalue": formdata.cardValue,
      "status": formdata.status,
      "requestTime": d.toLocaleString()
    }
    console.log(data);


    this.https.postJson1('https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/Get_Gift_Card_View_list', data).subscribe(res => {
      console.log(res);
      this.notification_data = res['Output'];
      let result=res['Output']
      this.dataSource = new MatTableDataSource(res['Output']);
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
    this.buidsearchNotificationForm()
    this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
     if (this.dataSource.filter !=this.dataSource.filter) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
  }

  displayStatus(){
this.satausDeatils.push('NEW','AWAITS APPROVAL', 'LIVE', 'OFFLINE')
console.log(this.satausDeatils);
 }
}
