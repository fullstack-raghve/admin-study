import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface Activity {
  activityId: number;
  activityName: string;
}

export interface NotificationSearchData {
  notificationId: number;
  notificationName: string;
  activityName: string;
  communicationType: string;
  createdBy: string;
  lastModifiedOn: string;
  status: string;
}

@Component({
  selector: 'search-notifications',
  templateUrl: './search-notifications.component.html',
  styleUrls: ['./search-notifications.component.scss']
})
export class SearchNotificationsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Notifications',
    link: '/search-notifications'
  }
  ];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  public activities: any = [];
  @ViewChild("searchNotificationsForm") searchNotificationsForm;
  searchNotificationsFormGroup: FormGroup;
  displayedColumns: string[] = ['notificationId', 'notificationName','activityName', 'communicationType', 'createdBy', 'modifiedOn', 'status'];
  dataSource: MatTableDataSource<NotificationSearchData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public activity: any;
  public paginationData;
  public resultsLength = 0;

  constructor(private fb: FormBuilder,private router:Router,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
    this.buildSearchNotificationsForm();
  }

  status = true;
  openFilter() {
    this.status = !this.status;
  }
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.searchVal();
    // this.getActivity();
    // this.getActivityList();
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };

    if(sessionStorage.getItem('CheckType')=='notifications'){
      if (sessionStorage.searchValue) {
        this.searchNotificationsFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
      }
      if (sessionStorage.paginationData ) {
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
    }else{
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType','notifications');
    }
    this.getActivity();
    this.getActivityList();
  }
  public buildSearchNotificationsForm() {
    let form = {
      activity: [''],
      notificationId: [""],
      notificationName: ["", Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:.?_ ]*')],
      communicationType: [""],
      searchVal: [""],
      status: [""],

    }
    this.searchNotificationsFormGroup = this.fb.group(form);
  }

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  getActivityList() {

    let GET_ACTIVITY_LIST = environment.APIEndpoint + "api/rpa/notification/v1/all/activity/list";

    this.https.getJson(GET_ACTIVITY_LIST)
        .subscribe((response) => {
            this.activities = response;
        }
            , err => {
                console.log("error Status = " + err.status);

            })
}
  public getNotificationData() {
    this.searchNotificationsFormGroup.get('notificationName').value;
    // this.notificationStartDate = moment(this.firstFormGroup.get('startDate').value).format('DD-MM-YYYY');
    // this.notificationEndDate = moment(this.firstFormGroup.get('endDate').value).format('DD-MM-YYYY');
    this.activities.forEach(activity => {
      if (activity.id == this.searchNotificationsFormGroup.get('activity').value) {
        this.activity = activity.value;
      }
    });

    // let d1 = new Date(this.firstFormGroup.get('startDate').value);
    // let d2 = new Date(this.firstFormGroup.get('endDate').value);

    // this.dateError = d1 > d2 ? true : false;
  }

  public activitiesList;
  Activity: Activity[] = [];
  activityCtrl = new FormControl();
  filteredactivities: Observable<Activity[]>;

  getActivity() {
    // console.log(this.KioskForm.get('brands').value);

    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/notification/v1/all/activity/list";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        // console.log(response);
        this.activitiesList = response;

        for (let i = 0; i <= this.activitiesList.length - 1; i++) {
          let objMallkey = {
            activityId: this.activitiesList[i]['id'],
            activityName: this.activitiesList[i]['value'],
          }
          // console.log(objMallkey);
          this.Activity.push(objMallkey);
        }
        this.filteredactivities = this.activityCtrl.valueChanges
            .pipe(
              startWith(''),
              map(Activity => Activity ? this._filterActivity(Activity) : this.Activity.slice())
            );
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterActivity(value: string): Activity[] {
    const filterValue = value.toLowerCase();
    return this.Activity.filter(Activity => Activity.activityName.toLowerCase().indexOf(filterValue) === 0);
  }
  
  public activityID;
  onItemChange(ev){
    console.log(ev);
    this.activityID = ev.activityId;
  }


  searchKey(){
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchVal() {
    this.searchStoreVal = true;
    if (this.searchNotificationsFormGroup.invalid === false) {
      let formdata = this.searchNotificationsFormGroup.value;
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
        "keySearch": formdata.searchVal,
        "fieldSearch": [
          {
            "fieldName": "oid",
            "fieldValue": formdata.notificationId,
          },
          {
            "fieldName": "notificationName",
            "fieldValue": formdata.notificationName
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
      let NOTIFICATION_SEARCH = "api/rpa/notification/v1/search"
      this.https.postJson(environment.APIEndpoint + NOTIFICATION_SEARCH, data).subscribe(res => {
        this.searchStoreVal = false;
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
        this.searchStoreVal = true;
      })
    }
  }

  resetForm() {
    this.activityCtrl.reset('');
    this.activityID = '';
    this.noRecords = false;
    this.buildSearchNotificationsForm();
    this.searchVal();
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
    // this.searchNotificationsFormGroup.controls['activityCtrl'].setValue('test');
  }
  MoveToView(ID){
    localStorage.setItem('NotificationViewID',ID);
    this.router.navigate(['/view-notifications'])

  }
}
