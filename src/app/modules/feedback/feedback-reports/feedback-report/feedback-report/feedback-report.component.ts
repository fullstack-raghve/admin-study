import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-feedback-report',
  templateUrl: './feedback-report.component.html',
  styleUrls: ['./feedback-report.component.scss']
})
export class FeedbackReportComponent implements OnInit {

  public breadCrumbData: Array<Object> = [
    {
      title: "Home",
      link: ""
    },
    {
      title: "Feedback",
      link: ""
    },
    {
      title: "Reports",
      link: ""
    }
  ];
  public displayedColumns: string[] = [
    'brandId',
    'brandName',
    'feedbackCount',
    'satisfaction',
    'npsScore'
  ];
  public status = true;
  public dataSource;
  public paginationData;
  public resultsLength = 0;
  public stores;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchFeedBackForm') searchFlowForm;
  public minDate: Date = new Date();
  searchFeedBackForm: FormGroup;
  public excelDate: any;
  public formattedJson: any;
  public satisfactionArray: string;
  buildFlag: boolean;
  totalValue: any;
  public searchResults: boolean = false;
  // public minExpiryDate;

  tomorrow = new Date();

  constructor(
    private fb: FormBuilder,
    private https: HttpService
  ) {
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }

  allEmoji = [
    {
      label: "assets/images/sentiments/1_1.png",
      value: "0",
    },
    {
      label: "assets/images/sentiments/2_1.png",
      value: "1",
    },
    {
      label: "assets/images/sentiments/3_1.png",
      value: "2",
    },
    {
      label: "assets/images/sentiments/4_1.png",
      value: "3",
    },
    {
      label: "assets/images/sentiments/5_1.png",
      value: "4",
    },
    {
      label: "assets/images/sentiments/6_1.png",
      value: "5",
    },
    {
      label: "assets/images/sentiments/7_1.png",
      value: "6",
    },
    {
      label: "assets/images/sentiments/8_1.png",
      value: "7",
    },
    {
      label: "assets/images/sentiments/9_1.png",
      value: "8",
    },
    {
      label: "assets/images/sentiments/10_1.png",
      value: "9",
    },
    {
      label: "assets/images/sentiments/11_1.png",
      value: "10",
    }
  ]


  ngOnInit() {
    this.buildKioskReportForm();
    this.searchVal();
    this.feedbackReportTotal();
  }
  public buildKioskReportForm() {
    this.searchFeedBackForm = this.fb.group({
      startDate: [''],
      endDate: [''],
    });
  }
  openFilter() {
    this.status = !this.status;
  }
  searchVal() {
    this.searchResults = true;
    this.feedbackReportTotal();
    if (this.searchFeedBackForm.invalid === false) {
      const formdata = this.searchFeedBackForm.value;
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
      this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/report/v1/feedbackReport', data).subscribe(res => {
        this.resultsLength = res['totalCount'];
        this.searchResults = false;
        this.dataSource = new MatTableDataSource(res['items']);
        this.dataSource.sort = this.sort;
        this.buildFlag = true;
        if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
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
    if (this.searchFeedBackForm.invalid === false) {
      const formdata = this.searchFeedBackForm.value;
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
      this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/report/v1/feedbackReport', data).subscribe(res => {
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
        'Brand Id': res.brandId,
        'Brand Name': res.brandName,
        'Feedback Count': res.feedbackCount,
        'Feedback Satisfaction Bean': res.feedbackSatisfaction,
        'NPS Score': res.npsScore,
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.formattedJson);//convert the json value to xlsx woorkSheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'enquire');

    /* save to file */
    XLSX.writeFile(wb, 'Brand_Summary.xlsx');
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  reset() {
    this.buildKioskReportForm();
    this.searchVal();
  }


  feedbackReportTotal() {
    if (this.searchFeedBackForm.invalid === false) {
      const formdata = this.searchFeedBackForm.value;
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
            'fieldValue': formdata.startDate !== '' ? moment(formdata.startDate).format('YYYY-MM-DD') : ''
          },
          {
            'fieldName': 'endDate',
            'fieldValue': formdata.endDate !== '' ? moment(formdata.endDate).format('YYYY-MM-DD') : ''
          }
        ]
      };
      this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/report/v1/feedbackReportTotalValue', data).subscribe(res => {
        this.totalValue = res['items'];
        this.buildFlag = true;
        if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
          this.paginationData.pageIndex = 0;
          this.paginator.pageIndex = 0;
          this.searchVal();
        }
      }, err => {
        console.log(err);
      });

    }
  }

}
