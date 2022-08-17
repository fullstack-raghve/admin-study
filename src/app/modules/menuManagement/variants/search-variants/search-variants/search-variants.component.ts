import { OnInit, ViewChild, Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'src/environments/environment';

export interface VariantsData {
  variantOid: string;
  variantName: string;
  modifiedTime: string;
  status: string;
}

@Component({
  selector: 'search-variants',
  templateUrl: './search-variants.component.html',
  styleUrls: ['./search-variants.component.scss']
})
export class SearchVariantsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Variants',
    link: '/search-variants'
  }
  ];

  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  displayedColumns: string[] = ['variantOid', 'variantName', 'modifiedTime', 'status'];
  dataSource: MatTableDataSource<VariantsData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  searchVariantsFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
  }

  public status: boolean = true;
  openFilter() {
    this.status = !this.status;
  }

  ngOnInit() {
    this.buildSearchVariantsForm();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.searchVal();
  }
  public buildSearchVariantsForm() {
    let form = {
      variantName: [""],
      status: [""],
      searchVal: [""]
    }
    this.searchVariantsFormGroup = this.fb.group(form);
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

  searchVal() {
    this.searchStoreVal = true;
    console.log(this.paginationData);
    if (this.searchVariantsFormGroup.invalid == false) {
      let formdata = this.searchVariantsFormGroup.value;
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
            "fieldName": "variantName",
            "fieldValue": formdata.variantName
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          }
        ]
      }
      let SEARCH_VARIANTS = "api/rpa/menu/variant/v1/search"
      this.https.postJson(environment.APIEndpoint + SEARCH_VARIANTS, data).subscribe(res => {
        this.searchStoreVal = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
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
    this.noRecords = false;
    this.buildSearchVariantsForm();
    this.searchVal();
  }

}
