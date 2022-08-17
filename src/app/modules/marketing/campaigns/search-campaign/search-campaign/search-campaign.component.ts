import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { Router } from '@angular/router';



export interface CampaignSearchData {
  campaignId: string;
  campaignName: string;
  communicationType: string;
  promotionType: string;
  frequency: string;
  schedulingStatus: string;
  createdBy: string;
  modifiedOn: string;
  status: string;

}


@Component({
  selector: 'search-campaign',
  templateUrl: './search-campaign.component.html',
  styleUrls: ['./search-campaign.component.scss']
})


export class SearchCampaignComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Campaigns',
    link: '/search-campaign'
  }
  ];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  @ViewChild("searchCampaignsForm") searchCampaignsForm;
  searchCampaignsFormGroup: FormGroup;
  displayedColumns: string[] = ['campaignId', 'campaignName', 'communicationType', 'promotionType', 'frequency', 'schedulingStatus', 'createdBy', 'modifiedUserId', 'modifiedOn', 'status'];
  dataSource: MatTableDataSource<CampaignSearchData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  public activity: any;
  public activities: any = [];
  public activityID;
  public loadingResponse: boolean = false;

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  constructor(private fb: FormBuilder, private router: Router,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
    this.buildSearchCampaignsForm();
  }

  public status: boolean = true;
  openFilter() {
    this.status = !this.status;
  }
  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    if (sessionStorage.getItem('CheckType') == 'Campaign') {
      if (sessionStorage.searchValue) {
        this.searchCampaignsFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
        this.getActivityList();
        this.paginator.pageIndex = obj.pageIndex;
      } else {

        this.searchVal();
        this.getActivityList();

      }
    } else {
      sessionStorage.clear();
      this.searchVal();
      this.getActivityList();
      sessionStorage.setItem('CheckType', 'Campaign');
    }

  }
  public buildSearchCampaignsForm() {
    let form = {
      activity: [''],
      searchVal: [""],
      campaignId: [""],
      campaignName: ["", Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:.?_ ]*')],
      communicationType: [""],
      status: [""],

    }
    this.searchCampaignsFormGroup = this.fb.group(form);
  }
  getActivityList() {
    let GET_ACTIVITY_LIST = environment.APIEndpoint + "api/rpa/campaign/v1/activity/list";
    this.https.getJson(GET_ACTIVITY_LIST)
      .subscribe((response) => {
        this.activities = response;
      }
        , err => {
          console.log("error Status = " + err.status);
        })
  }
  public getNotificationData() {
    this.searchCampaignsFormGroup.get('notificationName').value;
    // this.notificationStartDate = moment(this.firstFormGroup.get('startDate').value).format('DD-MM-YYYY');
    // this.notificationEndDate = moment(this.firstFormGroup.get('endDate').value).format('DD-MM-YYYY');
    this.activities.forEach(activity => {
      if (activity.id == this.searchCampaignsFormGroup.get('activity').value) {
        this.activity = activity.value;
      }
    });

    // let d1 = new Date(this.firstFormGroup.get('startDate').value);
    // let d2 = new Date(this.firstFormGroup.get('endDate').value);

    // this.dateError = d1 > d2 ? true : false;
  }

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  searchKey() {
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  onItemChange(ev) {
    console.log(ev);
    this.activityID = ev;
  }

  indexResetFormdataSearch() {

    let formData = this.searchCampaignsFormGroup.value;
    if (formData.searchVal != '' && formData.searchVal != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formData.campaignId != '' && formData.campaignId != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formData.campaignName != '' && formData.campaignName != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formData.communicationType != '' && formData.communicationType != null) {
      this.paginationData.pageIndex = 0;
    }
    if (this.activityID != '' && this.activityID != null && this.activityID != 'undefined') {
      this.paginationData.pageIndex = 0;
    }
    if (formData.status != '' && formData.status != null) {
      this.paginationData.pageIndex = 0;
    }
  }

  searchVal() {
    this.searchStoreVal = true;
    this.loadingResponse = true;
    if (this.searchCampaignsFormGroup.invalid == false) {
      let formdata = this.searchCampaignsFormGroup.value;
      sessionStorage.setItem('searchValue', formdata.searchVal);
      if (formdata.searchVal != '') {
        let isDate = moment(formdata.searchVal, 'DD/MM/YYYY').format('YYYY-MM-DD');
        formdata.searchVal = isDate === 'Invalid date' ? formdata.searchVal : isDate;
      }
      let data =
      {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": "modifiedTime",
          "dir": "desc"
        },
        "keySearch": sessionStorage.getItem('searchValue'),
        "fieldSearch": [
          {
            "fieldName": "oid",
            "fieldValue": formdata.campaignId,
          },
          {
            "fieldName": "campaignName",
            "fieldValue": formdata.campaignName
          },
          {
            "fieldName": "communicationType",
            "fieldValue": formdata.communicationType,
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          },
          {
            "fieldName": "activityId",
            "fieldValue": this.activityID != undefined ? this.activityID : ""
          }
        ]
      }
      let CAMPAIGN_SEARCH = "api/rpa/campaign/v1/search"
      this.https.postJson(environment.APIEndpoint + CAMPAIGN_SEARCH, data).subscribe(res => {
        this.searchStoreVal = false;
        this.loadingResponse = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
      }, err => {
        console.log(err);
        this.searchStoreVal = false;
        this.loadingResponse = false;
      })
    }
  }

  resetForm() {
    this.noRecords = false;
    this.activityID = ''
    this.buildSearchCampaignsForm();
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.searchVal();
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  MoveToViewUser(ID) {
    localStorage.setItem('UserViewID', ID);
    this.router.navigate(['/view-user'])
  }
  MoveToView(ID) {
    // alert('hi')
    localStorage.setItem('CampaignViewID', ID);
    this.router.navigate(['/view-campaign'])
  }
}
