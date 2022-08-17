import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';


export interface UserData {
  amenityOid: number;
  amenityImagePath: string;
  amenityTitle: string;
  status: string;
}

@Component({
  selector: 'search-amenities',
  templateUrl: './search-amenities.component.html',
  styleUrls: ['./search-amenities.component.scss']
})
export class SearchAmenitiesComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
      title: 'Store Management',
      link: ''
    },
    {
      title: 'Amenities',
      link: ''
    }
  ];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  @ViewChild("searchEnquiriesForm") searchEnquiriesForm;
  searchAboutUsFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['amenityOid', 'icon', 'amenityTitle','modifiedTime', 'status'];
  dataSource: MatTableDataSource<UserData>;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchAmenityFormGroup: FormGroup;
  public paginationData;
  public resultsLength = 0;
  constructor(private fb: FormBuilder, private https: HttpService,private router: Router) {
    this.dataSource = new MatTableDataSource();
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
    this.buildSearchAmenityForm();
    // this.searchVal();
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  
    if(sessionStorage.getItem('CheckType')=='Amenities')
    {
          if (sessionStorage.searchValue) {
      this.searchAmenityFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      this.paginator.pageIndex = obj.pageIndex;
    } else {
      this.searchVal();
    }
  }else{
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType','Amenities');
    }
     
    // this.dataSource.sort = this.sort;
  }
  
  public buildSearchAmenityForm() {
    let form = {
      amenityTitle: [""],
      status: [""],
      searchVal: [""]
    }
    this.searchAmenityFormGroup = this.fb.group(form);
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
    let formdata = this.searchAmenityFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
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
          "fieldName": "amenityTitle",
          "fieldValue": formdata.amenityTitle
        },
        {
          "fieldName": "status",
          "fieldValue": formdata.status
        }
      ]
    }

    let SEARCH_AMENITY = "api/rpa/store/amenity/v1/search"
    this.https.postJson(environment.APIEndpoint + SEARCH_AMENITY, data).subscribe(res => {
      this.searchStoreVal = false;
      console.log(res);
      this.dataSource = new MatTableDataSource(res["items"]);
      this.dataSource.sort = this.sort;
      console.log('data : ' + res);
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

  resetForm() {
    this.noRecords = false;
    this.buildSearchAmenityForm();
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  ViewAmenities(ID){
    localStorage.setItem('AmenitiesViewID',ID);
    this.router.navigate(['/view-amenities'])
  }
}
