import { OnInit, ViewChild, Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Sort } from '@angular/material/sort';

export interface UserData {
  flowId: string;
  flowName: string;
  createdTime: string;
  preview:any;
  // status: string;

}

@Component({
  selector: 'search-flow',
  templateUrl: './search-flow.component.html',
  styleUrls: ['./search-flow.component.scss']
})
export class SearchFlowComponent implements OnInit {
  select:any;
  public breadCrumbData: Array<Object> = [{
    title: 'Feedback',
    link: ''
  }
  ];

  @ViewChild("searchFlowForm") searchFlowForm;
  searchFlowFormGroup: FormGroup;
  displayedColumns: string[] = ['flowId', 'flowName', 'communicationType', 'countryName', 'brandName', 'feedbackCount','createdBy', 'createdTime', 'preview','channelType', 'action','clone'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  buildFlag = false;
  brand;

  // public flowAPI = environment.APIEndpoint;
  public flowURL: string = "";
  countries: any[];
  brandId: any;
  public searchResults: boolean = false;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";

    // import JOSN
    fileContent: any;
    pages = [];
    pageLength: any;
  public API_EndPoint: any;
    
  
  constructor(private fb: FormBuilder, private https: HttpService, public router:Router, public snackBar: MatSnackBar) {
    this.buildSearchForm();
    this.dataSource = new MatTableDataSource();
    this.flowURL = window.location.href;
    this.flowURL = this.flowURL.replace(/\/.*/,'');
    console.log(this.flowURL);
  }

  public status: boolean = true;

  openFilter() {
    this.status = !this.status;
  }

  ngOnInit() {
    this.getBrand();
    // this.getCountryByBrandId(0);
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.searchVal();
    this.API_EndPoint = environment.APIEndpoint;
    // this.flowAPI = this.flowAPI.replace(/\:8080.*/,'');
    // this.href = this.router.url;

  }


  public buildSearchForm() {
    this.searchFlowFormGroup = this.fb.group({
      flowId: [""],
      flowName: ["", Validators.pattern('[a-zA-Z\u0600-\u06FF \"&\'(),-:.?_ ]*')],
      createdTime: [""],
      fromDate: [""],
      endDate: [""],
      searchVal: [""],
      brandOid: [''],
      countryOid: ['']
    });
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  getUpdate(event) {
    console.log(event);
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  searchVal() {
    this.searchResults = true;
    if (this.searchFlowFormGroup.invalid == false) {
      let formdata = this.searchFlowFormGroup.value;
      let data =
      {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": this.sortColumn,
          "dir": this.sortDirection
        },
        "keySearch": formdata.searchVal,
        "fieldSearch": [
          {
            "fieldName": "countryOid",
            "fieldValue": formdata.countryOid
          },
          {
            "fieldName": "brandOid",
            "fieldValue": formdata.brandOid
          },
          {
            "fieldName": "fromDate",
            "fieldValue": formdata.fromDate !== '' ? moment(formdata.fromDate).format('YYYY-MM-DD'):'',
          }, {
            "fieldName": "toDate",
            "fieldValue": formdata.endDate !== '' ? moment(formdata.endDate).format('YYYY-MM-DD'):'',
          }

        ]
      };
      this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/flow/v1/search', data).subscribe(res => {
        this.resultsLength = res['totalCount'];
        this.searchResults = false;
        this.dataSource = new MatTableDataSource(res['items']);
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
        this.buildFlag = true;
        if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength ){
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




  getBrand() {
    const SEARCH_BRANDS = 'api/rpa/master/brand/v1/getAllBrand';
    this.https.getJson(environment.APIEndpoint + SEARCH_BRANDS).subscribe(res => {
      this.brand = res;
      console.log(this.brand);
    }, err => {
      console.log(err);
    });

  }

  getAllCountries(brandId) {
    console.log(brandId)
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regions";
    this.https.getJson(GET_ALL_COUNTRIES + '?brandOid=' + brandId)
      .subscribe((response) => {
        console.log(response);
        this.countries = response;
      })
  }
  reset() {
    this.buildSearchForm();
    this.searchVal();
  }

  sendToURL(){
    // console.log(this.selection.selected)
  }


  emailCopy(val: string){
    let selBox = document.createElement('textarea');
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 500,
        data: {
          status: "success",
          message: "Email URL copied"
        }
      });
    }

    messageCopy(val: string){
      let selBox = document.createElement('textarea');
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 500,
        data: {
          status: "success",
          message: "Message URL copied"
        }
      });
    }

    notificationCopy(val: string){
      let selBox = document.createElement('textarea');
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 500,
        data: {
          status: "success",
          message: "Notification URL copied"
        }
      });
    }

    // Import flow
    public uplodFlow(fileList: FileList): void {
      if (fileList[0].type == "application/json") {
        let file = fileList[0];
        let fileReader: FileReader = new FileReader();
        let self = this;
        let data: any;
        fileReader.onloadend = function (x) {
          self.fileContent = fileReader.result;
          console.log(JSON.parse(self.fileContent));
          data = JSON.parse(self.fileContent);
          self.getFlow(data);
          console.log(self.pages)
        }
        fileReader.readAsText(file);
      } else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message: "Supported format is .json"
          }
        });
      }
    }
    getFlow(value) {
      console.log(value)
      this.pageLength = value;
      console.log(this.pages);
      localStorage.setItem("importedFlowJson", JSON.stringify(this.pageLength));
      this.router.navigate(['/import-flow']);
      // var i;
      // for (i = 0; i < this.pageLength.length; i++) {
      //   delete this.pageLength[i]['pageId'];
      //   for (var w = 0; w < this.pageLength[i]['attributes'].length; w++) {
      //     delete this.pageLength[i]['attributes'][w]['questionId'];
      //     console.log(this.pageLength[i]['attributes'][w]['customerData']);
      //     if (this.pageLength[i]['attributes'][w]['customerData']) {
      //       this.pageLength[i]['attributes'][w]['customerData'].forEach(element => {
      //         console.log(delete element['questionId'])
      //       });
      //     }
      //     else {
      //       delete this.pageLength[i]['pageId'];
      //     }
      //   }
      // }
      // console.log(this.pageLength);
      // this.pageLength.sort(function (a, b) {
      //   return a.pageNo - b.pageNo
      // })
  
      // this.pageLength.forEach(element => {
      //   this.pageNumber.push(element.pageNo);
      // });
      // console.log(this.pageLength);
      // this.pageNumber.sort();
      // this.tabs.push(...this.pageNumber);
  
      // console.log(this.tabs);
      // var maxLengthElemnt = Math.max(...this.tabs);
      // this.idIndexNew = maxLengthElemnt;
      // console.log('max length', this.idIndexNew)
      // console.log(this.pageLength.length);
    }
    sortData(sort: Sort) {

      if (!sort.active || sort.direction === '') {
        this.sortColumn = "modifiedTime";
        this.sortDirection = "desc";
      } else {
        this.sortColumn = sort.active;
        this.sortDirection = sort.direction;
      }
  
      this.searchVal();
    }
}
