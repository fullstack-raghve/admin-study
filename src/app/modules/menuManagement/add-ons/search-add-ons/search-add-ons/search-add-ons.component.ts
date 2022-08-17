import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';


export interface AddOnData {
  skuCode: number;
  addonName: string;
  categoryName:string;
  addonImagePath: string;
  modifiedTime: string;
  status: string;
}

@Component({
  selector: 'search-add-ons',
  templateUrl: './search-add-ons.component.html',
  styleUrls: ['./search-add-ons.component.scss']
})
export class SearchAddOnsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Add-ons',
    link: '/search-add-ons'
  }
  ];

  displayedColumns: string[] = ['skuCode', 'addonName', 'categoryName', 'image', 'modifiedTime', 'status'];
  dataSource: MatTableDataSource<AddOnData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  searchAddonFormGroup: FormGroup;
  public filePathUrl = localStorage.getItem('imgBaseUrl');

  constructor(private fb: FormBuilder,
    private https: HttpService) {
      this.getParentList();
      this.buildSearchForm();
    // this.dataSource = new MatTableDataSource();
  }

  public status: boolean = true;
  openFilter() {
    this.status = !this.status;
  }
  ngOnInit() {
  
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.searchVal();
  }
  public parentList = [];
  categories1 = [];
  
  @ViewChild('categoryInput') categoryInput: SelectAutocompleteComponent;

  getParentList() {
    let GET_ALL_PARENTS = environment.APIEndpoint + "api/rpa/productcategory/v1/get/list";
    this.https.getJson(GET_ALL_PARENTS)
      .subscribe((response) => {
        this.parentList = response;
        console.log('productList : ' + this.parentList);
        this.parentList.forEach(res => {
          this.categories1.push({
            "categoryId": res.categoryId,
            "categoryName": res.categoryName,
            "direction": res.direction,
            "parentProductCategoryId": res.parentProductCategoryId,
            "status": res.status,
            "value": res.categoryId
          });
        });
      })
  }

  public buildSearchForm() {
    let form = {
      skuCode: ["", Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')],
      addonName: ["", Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')],
      status: [""],
      searchVal: [""],
      categoryIds: [""]
    }
    this.searchAddonFormGroup = this.fb.group(form);
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
    if (this.searchAddonFormGroup.invalid == false) {
      let formdata = this.searchAddonFormGroup.value;
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
            "fieldName": "skuCode",
            "fieldValue": formdata.skuCode,
          },
          {
            "fieldName": "addonName",
            "fieldValue": formdata.addonName
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          },
          {
            "fieldName": "categoryIds",
            "fieldValue": formdata.categoryIds.toString()
          }
        ]
      }
      let SEARCH_ADDON = "api/rpa/menu/addon/v1/search"
      this.https.postJson(environment.APIEndpoint + SEARCH_ADDON, data).subscribe(res => {
        this.searchStoreVal = false;
        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
        this.dataSource = new MatTableDataSource(res["items"]);
        console.log(this.dataSource);
        this.dataSource.sort = this.sort;
        // this.buildFlag = true;
      }, err => {
        console.log(err);
        this.searchStoreVal = true;
      })
    }
  }
  selectedCategoryOptions :any[]; 
  resetForm() {
    this.noRecords = false;
    this.categoryInput.selectAllChecked = false;
    this.selectedCategoryOptions=[]
    this.buildSearchForm();
    this.searchVal();
  }

}
