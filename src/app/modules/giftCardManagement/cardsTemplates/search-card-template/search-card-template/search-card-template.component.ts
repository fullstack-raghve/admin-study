import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
import { environment } from '../../../../../../environments/environment';

import { HttpClient } from '@angular/common/http';

export interface UserData {
  rpOid: number;
  templateName: string;
  templateFor: string,
  userAlias: string;
  modifiedTime: string;
  status: string;
}

@Component({
  selector: 'search-card-template',
  templateUrl: './search-card-template.component.html',
  styleUrls: ['./search-card-template.component.scss']
})

export class SearchCardTemplateComponent implements OnInit {

  //giftcard changes
// APIBaseURL: 'https://zp787p79v0.execute-api.ap-south-1.amazonaws.com/';
// APIBaseProjectName: 'sit';

  public searchNotificationForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Cards Template',
    link: ''
  }];
  public resultsLength;
  // StringSearch:any;
  public displayedColumns: string[] = ['rpOid', 'templateName', 'templateFor', 'userAlias', 'modifiedTime', 'status',];
  public status = true;
  // public dataSource;
  // displayedColumns: string[] = ['brandName', 'brandCode', 'groupBy', 'countryName', 'createdBy', 'createdTime', 'modifiedTime', 'status'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  //notification_data: UserData[] = [  ];
  TemplateType = "";
  TemplateStatus = "";
  // constructor() { }
  notification_data: UserData[] = [];
  OldData = [];
  searchStoreVal = true;
  NoRecord=false;
  constructor(private fb: FormBuilder,
    private http: HttpService,
    private https: HttpClient) {
    // console.log(this.http);

  }

  ngOnInit() {
    this.buidsearchNotificationForm();
     this.searchVal();
    this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
   

  }


  openFilter() {
    this.status = !this.status;
  }


  buidsearchNotificationForm() {

    this.searchNotificationForm = this.fb.group({
      status: [""],
      StringSearch: [""],
      templateFor: [""],
    });
  }
  searchVal(){
    this.searchStoreVal = true;
    this.NoRecord=false;
    let Data = this.searchNotificationForm.value;
    // let TEMPURL =environment.APIBaseURL+'cardtemplate_'+environment.APIBaseProjectName+'/rest/api/v1/gc_template/Get_Templates_keywords';

     let TEMPURL = 'https://zp787p79v0.execute-api.ap-south-1.amazonaws.com/cardtemplate_sit/rest/api/v1/gc_template/Get_Templates_keywords';
    let data = {
      
        languageCode:"En",
        pageIndex:0,
        pageRowCount:0,
        keyword:Data['StringSearch'],
        status :Data['status'],
        templateFor :Data['templateFor'] 
      
    }
 console.log(JSON.stringify(data));
    return this.http.postCustomizeJson(TEMPURL, data)
      .subscribe((response) => {
        // console.log(response);
        let notification_data = response['Output'];
        // console.log(this.notification_data);
        this.searchStoreVal = false;

        // const searchValnotification_data: UserData[] = NewColums;
    this.dataSource = new MatTableDataSource<UserData>(notification_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (notification_data == "No data found") {
      this.NoRecord = true;
    } else {
      this.NoRecord = false;
    }
      },
        (error) => {
          // console.log(error);

        });
  }

  resetForm() {
    this.buidsearchNotificationForm();
    this.TemplateStatus = 'null';
    this.TemplateType = 'null';
    this.searchVal();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
