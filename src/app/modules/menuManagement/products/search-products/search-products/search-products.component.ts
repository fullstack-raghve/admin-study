import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatRadioModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { MatRadioChange } from '@angular/material/radio';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';


export interface UserData {
  sort: string;
  productImage: string;
  sku: number;
  productName: string;
  category: string;
  price: string;
  status: string;
}

@Component({
  selector: 'search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.scss']
})
export class SearchProductsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Products',
    link: '/search-products'
  }
  ];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  @ViewChild("searchProductsForm") searchProductsForm;
  searchProductsFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['sortOrder', 'productImage', 'productName', 'categories', 'status'];
  dataSource: MatTableDataSource<UserData>;
  // productType = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  buildFlag = false;
  public parentList = [];
  public addOnarray = [];
  public addOnList = [];
  public product;
  imgPath;
   @ViewChild('categoryInput') categoryInput: SelectAutocompleteComponent; 
  @ViewChild('addonInput') addonInput: SelectAutocompleteComponent;
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  public imgPathUrl = environment.APIEndpoint + 'img/';
  selectedCategoryOptions :any[]; 
  selectedAddonOptions:any[];
  constructor(private fb: FormBuilder, private https: HttpService) {
    this.getParentList();
    this.getAllProductAddons();
    this.buildSearchForm();

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

  categories1 = [];
  
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

  // getAllProductAddons() {
  //   let GET_ALL_ADDONS = environment.APIEndpoint + "api/rpa/menu/addon/v1/addon/list";
  //   this.https.getJson(GET_ALL_ADDONS)
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.addOnarray = response;
  //     })
  // }

  addons1 = [];
  getAllProductAddons() {
    let GET_ALL_PARENTS = environment.APIEndpoint + "api/rpa/menu/addon/v1/addon/list";
    this.https.getJson(GET_ALL_PARENTS)
      .subscribe((response) => {
        this.addOnarray = response;
        console.log('addOnarray : ' + this.addOnarray);
        this.addOnarray.forEach(res => {
          this.addons1.push({
            "addonImagePath": res.addonImagePath,
            "addonName": res.addonName,
            "addonOid": res.addonOid,
            "addonType": res.addonType,
            "displayPrice": res.displayPrice,
            "regionCode": res.regionCode,
            "regionOid": res.regionOid,
            "status": res.status,
            "value": res.addonOid
          });
        });
      })
  }

  // onChange(mrChange: MatRadioChange) {
  //   this.productType = mrChange.value;
  // }

  public buildSearchForm() {
    this.searchProductsFormGroup = this.fb.group({
      categoryIds: [""],
      isExclusive: [""],
      addonIds: [""],
      productType:[""],
      status: [""],
      searchVal: [""]
    });
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
    if (this.searchProductsFormGroup.invalid == false) {
      let formdata = this.searchProductsFormGroup.value;
      console.log(formdata);
      let exclusive = "";
      if (formdata.isExclusive != "") {
        exclusive = formdata.isExclusive == true ? "1" : "0"
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
            "fieldName": "categoryIds",
            "fieldValue": formdata.categoryIds.toString()
          },
          {
            "fieldName": "isExclusive",
            "fieldValue": exclusive
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          },
          {
            "fieldName": "productType",
            "fieldValue": formdata.productType
          },
          {
            "fieldName": "addonIds",
            "fieldValue": formdata.addonIds.toString()
          },
        ]
      }
      let SEARCH_PRODUCT = "api/rpa/product/v1/search"
      this.https.postJson(environment.APIEndpoint + SEARCH_PRODUCT, data).subscribe(res => {
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
        this.buildFlag = true;
      }, err => {
        console.log(err);
        this.searchStoreVal = true;
      })
    }
  }

  reset() {
    this.noRecords = false;
    this.categoryInput.selectAllChecked = false;
    this.addonInput.selectAllChecked = false;
    this.selectedCategoryOptions=[];
    this.selectedAddonOptions=[];
    this.buildSearchForm();
    this.searchVal();
  }
}
