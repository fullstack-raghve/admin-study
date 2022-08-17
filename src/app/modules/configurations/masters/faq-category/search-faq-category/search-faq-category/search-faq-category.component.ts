import {
  OnInit,
  ViewChild,
  Component,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import {
  HttpService
} from '../../../../../../services/http-service';
import {
  environment
} from '../../../../../../../environments/environment';
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

export interface UserData {
  faqCategoryId: number;
  imgPath: number;
  faqTitle: string;
  arabFaqCategoryName: string;
  createdTime: string;
  lastModifiedOn: string;
  modifiedBy: string;
  status: string;
}

@Component({
  selector: 'app-search-faq-category',
  templateUrl: './search-faq-category.component.html',
  styleUrls: ['./search-faq-category.component.scss']
})
export class SearchFaqCategoryComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: ''
  }, {
    title: 'FAQ Category',
    link: '/search-country'
  }];
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  displayedColumns: string[] = ['faqCategoryId', 'imgPath', 'faqCategoryName', 'arabFaqCategoryName', 'createdTime', 'modifiedTime', 'modifiedBy', 'status'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  public isCitiesVisible;
  searchfaqFormGroup: FormGroup;
  public status: boolean = true;
  buildFlag = false;
  paginationDetail = new BehaviorSubject({
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  constructor(private https: HttpService, private fb: FormBuilder,private router:Router) {
    this.buildsearchFaqForm();
  }
 

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.searchVal();
    if(sessionStorage.getItem('CheckType')=='FAQ'){
      if (sessionStorage.searchValue) {
        this.searchfaqFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType','FAQ');
    }
  }
  public buildsearchFaqForm() {
    let form = {
      searchVal: [""],
      status: [""],
      title: ["", Validators.compose([Validators.pattern('[a-zA-Z0-9\u0600-\u06FF.\"&\'(),-:.?_ ]*')])]

    }
    this.searchfaqFormGroup = this.fb.group(form);
  }
  openFilter() {
    this.status = !this.status;
  }
  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  searchKey(){
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchVal() {
    this.searchStoreVal = true;
    let formdata = this.searchfaqFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    let data = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": formdata.searchVal,
      "fieldSearch": [{
        "fieldName": "status",
        "fieldValue": formdata.status
      },
      {
        "fieldName": "faqCategoryTitle",
        "fieldValue": formdata.title
      },

      ]
    }
    this.https.postJson(environment.APIEndpoint + "api/rpa/faq/category/v1/search", data).subscribe(res => {
      this.searchStoreVal = false;
      this.resultsLength = res["totalCount"];
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      this.dataSource = new MatTableDataSource(res["items"]);
      this.dataSource.sort = this.sort;
      this.buildFlag = true;
    }, err => {
      console.log(err);
      this.searchStoreVal = true;
    })
  }




  reset() {
    this.noRecords = false;
    this.buildsearchFaqForm();
    // this.searchVal();
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  MoveToView(ID){
    localStorage.setItem('FaqViewID',ID);
    this.router.navigate(['/view-faq-category'])
  }
}
