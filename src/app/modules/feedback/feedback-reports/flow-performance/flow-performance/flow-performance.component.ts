import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-flow-performance',
  templateUrl: './flow-performance.component.html',
  styleUrls: ['./flow-performance.component.scss']
})
export class FlowPerformanceComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
      title: 'Home',
      link: ''
    },
    {
      title: 'Feedback',
      link: ''
    },
    {
      title: "Reports",
      link: ""
    }
  ];

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  public displayedColumns: string[] = [
    'flowId',
    'flowName',
    'kioskAssigned',
    'email',
    'sms',
    'feedbackCount',
    'responseTime'
  ];
  public status = true;
  public dataSource;
  public paginationData;
  public resultsLength = 0;
  public stores;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchFlowPerformanceForm') searchFlowForm;
  searchFlowPerformanceForm: FormGroup;
  buildFlag: boolean;
  public excelDate: any;
  public formattedJson: any;
  public minDate: Date = new Date();
  public searchResults: boolean = false;

  constructor(private fb: FormBuilder,
    private https: HttpService) {
    }


  ngOnInit() {
    this.buildFlowSearchForm();
    this.searchVal();
  }

  public buildFlowSearchForm() {
    this.searchFlowPerformanceForm = this.fb.group({
      startDate: [''],
      endDate: [''],
    });
  }
  openFilter() {
    this.status = !this.status;
  }
  searchVal() {
    this.searchResults = true;
    if (this.searchFlowPerformanceForm.invalid === false) {
      const formdata = this.searchFlowPerformanceForm.value;
      const data = {
        'page': this.paginationData !== undefined ? this.paginationData.pageIndex : '0',
        'pageSize': this.paginationData !== undefined ? this.paginationData.pageSize : '10',
        'order': {
          'column': 'modifiedTime',
          'dir': 'desc'
        },
        'keySearch': formdata.searchVal,
        'fieldSearch': [
          {
            'fieldName': 'startDate',
            'fieldValue': formdata.startDate !== '' ? moment(formdata.startDate).format('YYYY-MM-DD') : '',
          },
          {
            'fieldName': 'endDate',
            'fieldValue': formdata.endDate !== '' ? moment(formdata.endDate).format('YYYY-MM-DD') : '',
          }
        ]
      };
      this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/report/v1/flowPerformanceReport', data).subscribe(res => {
        this.resultsLength = res['totalCount'];
        this.searchResults = false;
        this.dataSource = new MatTableDataSource(res['items']);
        this.dataSource.sort = this.sort;
        this.buildFlag = true;
        if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength ) {
          this.paginationData.pageIndex = 0;
            this.paginator.pageIndex = 0;
            this.searchVal();
          }
      }, err => {
        console.log(err);
        this.searchResults = false;
      });

    }
  }

  excelValue() {
    if (this.searchFlowPerformanceForm.invalid === false) {
      const formdata = this.searchFlowPerformanceForm.value;
      const data = {
        'page': '0',
        'pageSize': this.resultsLength,
        'order': {
          'column': 'modifiedTime',
          'dir': 'desc'
        },
        'keySearch': formdata.searchVal,
        'fieldSearch': [
          {
            'fieldName': 'startDate',
            'fieldValue': formdata.startDate !== '' ? moment(formdata.startDate).format('YYYY-MM-DD') : '',
          },
          {
            'fieldName': 'endDate',
            'fieldValue': formdata.endDate !== '' ? moment(formdata.endDate).format('YYYY-MM-DD') : '',
          }
        ]
      };
      this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/report/v1/flowPerformanceReport', data).subscribe(res => {
        this.excelDate = res['items'];
        this.exportAsExcel();
      }, err => {
        console.log(err);
      });

    }
  }

  public exportAsExcel() {

    this.formattedJson = this.excelDate.map(res => {
      return {
        'Flow Id': res.flowId,
        'Flow Name': res.flowName,
        'Kiosk Assigned': res.kioskAssigned,
        'Email': res.email,
        'SMS': res.sms,
        'FeedBack Count': res.feedbackCount,
        'ResponseTime': res.responseTime,
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.formattedJson);//convert the json value to xlsx woorkSheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'enquire');

    /* save to file */
    XLSX.writeFile(wb, 'Flow_Summary.xlsx');
  }



  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  reset() {
    this.buildFlowSearchForm();
    this.searchVal();
  }

}
