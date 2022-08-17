import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

export interface UserData {
  FileType: string;
  FileName: string;
  ProcessignDate: string;
  ErrorCode: string;
  TotalRecords: string;
  SuccessRecords: string;
  FailureRecords: string;
  errorCode: string;
  Status: string;
}

@Component({
  selector: 'app-search-uploaded-files',
  templateUrl: './search-uploaded-files.component.html',
  styleUrls: ['./search-uploaded-files.component.scss']
})
export class SearchUploadedFilesComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Configurations',
    link: ''
  },
  {
    title: 'Search File Upload',
    link: ''
  },
  ];
  public filetypeVal;
  @ViewChild("searchFileForm") searchFileForm;
  searchFileFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['fileName', 'accrualRuleName', 'startDate','totalRecords',
    'successRecords', 'failureRecords','errorCode', 'status'];
  dataSource: MatTableDataSource<UserData>;
  public filePathUrl = environment.APIEndpoint;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  successRecordsPath;
  status = true;
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  public sortColumn = "modifiedTime";
 

  public sortDirection = "desc";
  fileTypes = [
    // {
    //   fileId: 'StoreFlatFile',
    //   fileName: 'Store Flat File'
    // },
    // {
    //   fileId: 'StoreStaffFlatFile',
    //   fileName: 'Store Staff FlatFile'
    // },
    {
      fileId: 'bonusFile',
      fileName: 'Bonus'
    }
    // {
    //   fileId: 'posFlatFile',
    //   fileName: 'Pos FlatFile'
    // },
    // {
    //   fileId: 'offlineTransaction',
    //   fileName: 'Offline Transaction'
    // },
    // {
    //   fileId: 'offlineTransactionFANDB',
    //   fileName: 'Offline Transaction FANDB'
    // },
    // {
    //   fileId: 'offlineTransactionFANDB_TIM',
    //   fileName: 'Offline Transaction FANDB_TIM'
    // }
//     storeFlatFile,
// storeStaffFlatFile,
// posFlatFile,
// offlineTransaction,
// offlineTransactionFANDB,
// offlineTransactionFANDB_TIM,
// bonusFile
  ];
  failureRecoreds: any;
  totalRecords: any;
  successRecords: any;
  constructor(private fb: FormBuilder, private https: HttpService) {
    this.dataSource = new MatTableDataSource();

  }

  ngOnInit() {
    this.buildSearchFileForm();
    this.searchVal();
    // this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  openFilter() {
    this.status = !this.status;
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
  buildSearchFileForm() {
    let form = {
      fileName: [""],
      // fileUploadType: [""],
      // status: [""],
      searchVal: [""],
      accrualRuleName: [""],
      fileUploadType: ['']
      // startDate: [""],
      // endDate: [""]
    }
    this.searchFileFormGroup = this.fb.group(form);
  }
  getFileTypeStatus(filetypeVal) {
    this.filetypeVal = filetypeVal.fileId;
  }
  searchVal() {
    this.searchStoreVal = true;
    let formdata = this.searchFileFormGroup.value;
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
          "fieldName": "accrualRuleName",
          "fieldValue": formdata.accrualRuleName
        },
        {
          "fieldName": "fileName",
          "fieldValue": formdata.fileName
        },
        {
          "fieldName": "fileType",
          "fieldValue": this.filetypeVal != undefined ? this.filetypeVal : ''
        },
        // {
        //   "fieldName": "startDate",
        //   "fieldValue": formdata.startDate!='' ? moment(formdata.startDate).format('DD-MM-YYYY'):''
        // },
        // {
        //   "fieldName": "endDate",
        //   "fieldValue": formdata.endDate!='' ? moment(formdata.endDate).format('DD-MM-YYYY'):''
        // }
      ]
    }

    // let SEARCH_AMENITY = "api/rpa/bonus/v1/partner/file/search"
    let SEARCH_AMENITY = "api/rpa/fileUpload/v1/file/search"

    
    this.https.postJson(environment.APIEndpoint + SEARCH_AMENITY, data).subscribe(res => {
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
      this.searchStoreVal = true;
    })
  }
  resetForm() {
    this.noRecords = false;
    this.filetypeVal = '';
    this.buildSearchFileForm();
    this.searchVal();
  }



  downloadFile(file) {
    var blob = new Blob([file], {type: 'text/plain'});
    var downloadUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "file";
    document.body.appendChild(a);
    a.click();
  }
}
